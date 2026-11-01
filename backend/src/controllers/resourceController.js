import oracledb from "oracledb";
import { resources } from "../config/resources.js";
import { query } from "../config/database.js";

const cleanValue = (value) =>
  value === "" || value === undefined ? null : value;

function normalizeBody(config, body) {
  const data = {};

  for (const field of config.fields) {
    if (
      Object.hasOwn(body, field.toLowerCase()) ||
      Object.hasOwn(body, field)
    ) {
      let value = body[field.toLowerCase()] ?? body[field];
      value = cleanValue(value);

      if (config.numbers?.includes(field) && value !== null) {
        value = Number(value);

        if (!Number.isFinite(value)) {
          const error = new Error(`Invalid number supplied for ${field}.`);
          error.status = 400;
          throw error;
        }
      }

      if (config.dates?.includes(field) && value !== null) {
        const parsedDate = new Date(value);

        if (Number.isNaN(parsedDate.getTime())) {
          const error = new Error(`Invalid date supplied for ${field}.`);
          error.status = 400;
          throw error;
        }

        value = parsedDate;
      }

      data[field] = value;
    } else if (config.defaults && Object.hasOwn(config.defaults, field)) {
      data[field] = config.defaults[field];
    }
  }

  return data;
}

function getResourceConfig(resource) {
  return resources[resource] || null;
}

function validateId(value) {
  const id = Number(value);

  if (!Number.isSafeInteger(id) || id <= 0) {
    const error = new Error("Invalid record ID.");
    error.status = 400;
    throw error;
  }

  return id;
}

// GET all records
export async function list(req, res) {
  const config = getResourceConfig(req.params.resource);

  if (!config) {
    return res.status(404).json({ message: "Unknown module." });
  }

  const search = String(req.query.search || "").trim();
  const binds = {};
  let where = "";

  if (search && config.search.length) {
    where =
      " WHERE (" +
      config.search
        .map((field, index) => {
          binds[`s${index}`] = `%${search.toUpperCase()}%`;
          return `UPPER(${field}) LIKE :s${index}`;
        })
        .join(" OR ") +
      ")";
  }

  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 100));

  const result = await query(
    `SELECT * FROM ${config.table}${where}
     ORDER BY ${config.id} DESC
     OFFSET :offset ROWS FETCH NEXT :limit ROWS ONLY`,
    {
      ...binds,
      offset: (page - 1) * limit,
      limit,
    },
  );

  res.json({
    data: result.rows,
    page,
    limit,
  });
}

// GET one complete record by its database ID
export async function getById(req, res) {
  const config = getResourceConfig(req.params.resource);

  if (!config) {
    return res.status(404).json({ message: "Unknown module." });
  }

  const id = validateId(req.params.id);

  const result = await query(
    `SELECT * FROM ${config.table} WHERE ${config.id} = :id`,
    { id },
  );

  if (!result.rows || result.rows.length === 0) {
    return res.status(404).json({
      message: "Record not found.",
    });
  }

  res.json({
    data: result.rows[0],
  });
}

// CREATE a record
export async function create(req, res) {
  const config = getResourceConfig(req.params.resource);

  if (!config) {
    return res.status(404).json({ message: "Unknown module." });
  }

  const data = normalizeBody(config, req.body);

  const missing = config.required.filter(
    (field) => data[field] === null || data[field] === undefined,
  );

  if (missing.length) {
    return res.status(400).json({
      message: `Required fields: ${missing.join(", ")}`,
    });
  }

  const fields = Object.keys(data);

  if (!fields.length) {
    return res.status(400).json({
      message: "No valid fields supplied.",
    });
  }

  const binds = Object.fromEntries(
    fields.map((field) => [field.toLowerCase(), data[field]]),
  );

  const result = await query(
    `INSERT INTO ${config.table} (${fields.join(", ")})
     VALUES (${fields.map((field) => `:${field.toLowerCase()}`).join(", ")})
     RETURNING ${config.id} INTO :newId`,
    {
      ...binds,
      newId: {
        dir: oracledb.BIND_OUT,
        type: oracledb.NUMBER,
      },
    },
    { autoCommit: true },
  );

  res.status(201).json({
    message: "Record created successfully.",
    id: result.outBinds.newId[0],
  });
}

// UPDATE an existing record
export async function update(req, res) {
  const config = getResourceConfig(req.params.resource);

  if (!config) {
    return res.status(404).json({ message: "Unknown module." });
  }

  const id = validateId(req.params.id);
  const data = normalizeBody(config, req.body);
  const fields = Object.keys(data);

  if (!fields.length) {
    return res.status(400).json({
      message: "No valid fields supplied.",
    });
  }

  const missing = config.required.filter(
    (field) => data[field] === null || data[field] === undefined,
  );

  if (missing.length) {
    return res.status(400).json({
      message: `Required fields: ${missing.join(", ")}`,
    });
  }

  const binds = Object.fromEntries(
    fields.map((field) => [field.toLowerCase(), data[field]]),
  );

  binds.recordId = id;

  const result = await query(
    `UPDATE ${config.table}
     SET ${fields.map((field) => `${field} = :${field.toLowerCase()}`).join(", ")}
     WHERE ${config.id} = :recordId`,
    binds,
    { autoCommit: true },
  );

  if (!result.rowsAffected) {
    return res.status(404).json({
      message: "Record not found.",
    });
  }

  res.json({
    message: "Record updated successfully.",
  });
}

// DELETE a record
export async function remove(req, res) {
  const config = getResourceConfig(req.params.resource);

  if (!config) {
    return res.status(404).json({ message: "Unknown module." });
  }

  const id = validateId(req.params.id);

  const result = await query(
    `DELETE FROM ${config.table} WHERE ${config.id} = :id`,
    { id },
    { autoCommit: true },
  );

  if (!result.rowsAffected) {
    return res.status(404).json({
      message: "Record not found.",
    });
  }

  res.json({
    message: "Record deleted successfully.",
  });
}
