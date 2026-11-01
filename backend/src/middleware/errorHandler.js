export function errorHandler(error, req, res, next) {
  console.error(error);
  if (res.headersSent) return next(error);
  const oracleCode = error.errorNum;
  if (oracleCode === 1) return res.status(409).json({ message: "A record with this unique value already exists." });
  if (oracleCode === 2291) return res.status(400).json({ message: "A related record does not exist. Check the selected student, course, teacher or batch." });
  if (oracleCode === 2292) return res.status(409).json({ message: "This record is being used by another record and cannot be deleted." });
  if (oracleCode === 2290) return res.status(400).json({ message: "One or more values are outside the allowed options." });
  res.status(error.status || 500).json({
    message: error.status ? error.message : "An unexpected server error occurred."
  });
}
