import { useEffect, useState } from "react";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  RefreshCw,
  Users,
  SlidersHorizontal,
  X,
} from "lucide-react";

import api from "../api";
import { modules } from "../config/modules";
import Modal from "./Modal";
import Field from "./Field";

const singularNames = {
  students: "Student",
  teachers: "Teacher",
  courses: "Course",
  batches: "Batch",
  enrollments: "Enrollment",
  payments: "Payment",
  attendance: "Attendance record",
};

const pretty = (key) =>
  key
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());

const display = (value) => {
  if (value == null || value === "") return "—";

  if (value instanceof Date) {
    return value.toISOString().slice(0, 10);
  }

  return String(value).replace("T00:00:00.000Z", "").replace("T00:00:00", "");
};

function formatFormValue(value) {
  if (value == null) return "";

  if (value instanceof Date) {
    return value.toISOString().slice(0, 10);
  }

  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}T/.test(value)) {
    return value.slice(0, 10);
  }

  return value;
}

export default function ResourcePage({ resource, notify }) {
  const config = modules[resource];

  const [rows, setRows] = useState([]);
  const [search, setSearch] = useState("");

  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({});

  const [lookups, setLookups] = useState({});

  const [busy, setBusy] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editLoading, setEditLoading] = useState(false);

  // Load directory records and lookup data
  async function load() {
    setBusy(true);

    try {
      const lookupFields = config.fields.filter(
        (field) => field[2] === "lookup",
      );

      const [list, ...lookupResults] = await Promise.all([
        api.get(`/${resource}`, {
          params: { search },
        }),

        ...lookupFields.map((field) => api.get(`/lookups/${field[4]}`)),
      ]);

      setRows(list.data.data || []);

      const keys = lookupFields.map((field) => field[4]);

      setLookups(
        Object.fromEntries(
          keys.map((key, index) => [key, lookupResults[index].data]),
        ),
      );
    } catch (error) {
      notify(
        error.response?.data?.message ||
          `Could not load ${config.title.toLowerCase()}.`,
        "error",
      );
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => {
    const timer = window.setTimeout(() => load(), search ? 250 : 0);

    return () => window.clearTimeout(timer);
  }, [resource, search]);

  // Open create form
  function openCreate() {
    setEditing(null);
    setForm({});
    setEditLoading(false);
    setModal(true);
  }

  // Open edit form using the latest database record
  async function openEdit(row) {
    const recordId = row[config.id];

    if (!recordId) {
      notify("Could not identify the selected record.", "error");
      return;
    }

    setEditing(row);
    setForm({});
    setEditLoading(true);
    setModal(true);

    try {
      // Retrieve the complete record directly from the backend.
      const response = await api.get(`/${resource}/${recordId}`);

      const record = response.data?.data;

      if (!record) {
        throw new Error("The requested record was not returned.");
      }

      // Populate the form using the complete database response.
      const next = {};

      config.fields.forEach(([name]) => {
        next[name] = formatFormValue(record[name]);
      });

      setEditing(record);
      setForm(next);
    } catch (error) {
      setModal(false);
      setEditing(null);
      setForm({});

      notify(
        error.response?.data?.message ||
          error.message ||
          "Could not retrieve this record.",
        "error",
      );
    } finally {
      setEditLoading(false);
    }
  }

  // Update individual form fields
  const updateField = (name, value) => {
    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  // Create or update a record
  async function save(event) {
    event.preventDefault();

    if (saving || editLoading) return;

    setSaving(true);

    try {
      const payload = Object.fromEntries(
        Object.entries(form).map(([key, value]) => [key.toLowerCase(), value]),
      );

      if (editing) {
        await api.put(`/${resource}/${editing[config.id]}`, payload);
      } else {
        await api.post(`/${resource}`, payload);
      }

      notify(
        editing
          ? `${singularNames[resource]} updated successfully.`
          : `${singularNames[resource]} created successfully.`,
        "success",
      );

      setModal(false);
      setEditing(null);
      setForm({});

      await load();
    } catch (error) {
      notify(
        error.response?.data?.message || "Could not save this record.",
        "error",
      );
    } finally {
      setSaving(false);
    }
  }

  // Delete a record
  async function remove(row) {
    const recordName =
      row.FULL_NAME ||
      row.COURSE_NAME ||
      row.BATCH_NAME ||
      row.STUDENT_CODE ||
      `#${row[config.id]}`;

    if (
      !window.confirm(`Delete ${recordName}? This action cannot be undone.`)
    ) {
      return;
    }

    try {
      await api.delete(`/${resource}/${row[config.id]}`);

      notify(`${singularNames[resource]} deleted successfully.`, "success");

      await load();
    } catch (error) {
      notify(
        error.response?.data?.message || "Could not delete this record.",
        "error",
      );
    }
  }

  return (
    <div className="space-y-6">
      <div className="page-heading">
        <div>
          <p className="eyebrow">ACADEMY MANAGEMENT</p>

          <h1 className="page-title">{config.title}</h1>

          <p className="page-subtitle">{config.subtitle}</p>
        </div>

        <button className="primary-button" onClick={openCreate}>
          <Plus size={16} />
          Add {singularNames[resource]}
        </button>
      </div>

      <section className="panel overflow-hidden">
        <div className="resource-toolbar">
          <div>
            <div className="flex items-center gap-2">
              <div className="toolbar-icon">
                <Users size={15} />
              </div>

              <h2 className="section-title">{config.title} directory</h2>
            </div>

            <p className="muted-text mt-1">
              Search, review and maintain your records.
            </p>
          </div>

          <div className="resource-actions">
            <label className="resource-search">
              <Search size={16} />

              <input
                type="search"
                placeholder={`Search ${config.title.toLowerCase()}…`}
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                aria-label={`Search ${config.title}`}
              />

              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  aria-label="Clear search"
                >
                  <X size={14} />
                </button>
              )}
            </label>

            <button
              className="secondary-button refresh-button"
              onClick={load}
              disabled={busy}
            >
              <RefreshCw size={14} className={busy ? "animate-spin" : ""} />

              <span>Refresh</span>
            </button>
          </div>
        </div>

        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                {config.columns.map((column) => (
                  <th key={column}>{pretty(column)}</th>
                ))}

                <th className="text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {busy ? (
                <tr>
                  <td
                    colSpan={config.columns.length + 1}
                    className="empty-cell"
                  >
                    <span className="table-loading">
                      <RefreshCw size={15} className="animate-spin" />
                      Loading records…
                    </span>
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={config.columns.length + 1}
                    className="empty-cell"
                  >
                    <div className="table-empty">
                      <div className="table-empty-icon">
                        <SlidersHorizontal size={19} />
                      </div>

                      <strong>
                        {search
                          ? "No matching records"
                          : `No ${config.title.toLowerCase()} yet`}
                      </strong>

                      <span>
                        {search
                          ? "Try another search term or clear your search."
                          : `Add your first ${singularNames[
                              resource
                            ].toLowerCase()} to get started.`}
                      </span>

                      {!search && (
                        <button className="text-action" onClick={openCreate}>
                          Add {singularNames[resource]}
                          <Plus size={13} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                rows.map((row) => (
                  <tr key={row[config.id]}>
                    {config.columns.map((column) => (
                      <td key={column}>
                        {column === "STATUS" ? (
                          <span
                            className={`status-pill ${String(
                              row[column] || "",
                            ).toLowerCase()}`}
                          >
                            {display(row[column])}
                          </span>
                        ) : (
                          display(row[column])
                        )}
                      </td>
                    ))}

                    <td>
                      <div className="row-actions">
                        <button
                          className="row-action-button"
                          title={`Edit ${singularNames[resource]}`}
                          aria-label={`Edit ${singularNames[resource]}`}
                          onClick={() => openEdit(row)}
                        >
                          <Pencil size={14} />
                        </button>

                        <button
                          className="row-action-button danger"
                          title={`Delete ${singularNames[resource]}`}
                          aria-label={`Delete ${singularNames[resource]}`}
                          onClick={() => remove(row)}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="resource-footer">
          <span>
            {rows.length} {rows.length === 1 ? "record" : "records"}{" "}
            {search ? "matching your search" : "shown"}
          </span>

          <span>Changes are saved to the Oracle database</span>
        </div>
      </section>

      {modal && (
        <Modal
          title={`${editing ? "Edit" : "Add"} ${singularNames[resource]}`}
          subtitle={
            editing
              ? "Update the information for this record."
              : `Enter the details to create a new ${singularNames[
                  resource
                ].toLowerCase()}.`
          }
          onClose={() => !saving && !editLoading && setModal(false)}
        >
          {editLoading ? (
            <div className="flex min-h-48 flex-col items-center justify-center gap-3">
              <RefreshCw size={24} className="animate-spin" />

              <p className="muted-text">
                Retrieving the latest record from the database…
              </p>
            </div>
          ) : (
            <form onSubmit={save} className="space-y-5">
              <div className="grid gap-x-4 gap-y-5 sm:grid-cols-2">
                {config.fields.map((field) => (
                  <div
                    key={field[0]}
                    className={field[2] === "textarea" ? "sm:col-span-2" : ""}
                  >
                    <Field
                      field={field}
                      value={form[field[0]]}
                      onChange={updateField}
                      lookups={lookups}
                    />
                  </div>
                ))}
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => setModal(false)}
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  className="primary-button"
                  type="submit"
                  disabled={saving}
                >
                  {saving
                    ? "Saving…"
                    : editing
                      ? "Save changes"
                      : `Create ${singularNames[resource].toLowerCase()}`}
                </button>
              </div>
            </form>
          )}
        </Modal>
      )}
    </div>
  );
}
