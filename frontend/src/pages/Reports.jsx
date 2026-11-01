import { useEffect, useState } from "react";
import {
  FileSpreadsheet,
  Users,
  GraduationCap,
  BookOpen,
  CalendarDays,
  ClipboardList,
  Wallet,
  ClipboardCheck,
  RefreshCw,
  Download,
} from "lucide-react";
import api from "../api";

const icons = {
  Students: Users,
  Teachers: GraduationCap,
  Courses: BookOpen,
  Batches: CalendarDays,
  Enrollments: ClipboardList,
  Payments: Wallet,
  Attendance: ClipboardCheck,
};

function escapeCsv(value) {
  const text = String(value ?? "");
  return `"${text.replaceAll('"', '""')}"`;
}

export default function Reports({ notify }) {
  const [rows, setRows] = useState([]);
  const [busy, setBusy] = useState(true);

  async function loadReports() {
    setBusy(true);

    try {
      const response = await api.get("/reports/summary");
      setRows(response.data || []);
    } catch (error) {
      notify(
        error.response?.data?.message || "Could not load reports.",
        "error",
      );
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => {
    loadReports();
  }, []);

  function exportCsv() {
    if (!rows.length) return;

    const content = [
      ["Module", "Total"].map(escapeCsv).join(","),
      ...rows.map((row) => [row.CATEGORY, row.TOTAL].map(escapeCsv).join(",")),
    ].join("\r\n");

    const blob = new Blob(["\uFEFF", content], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");

    anchor.href = url;
    anchor.download = "apex-coaching-summary.csv";

    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();

    URL.revokeObjectURL(url);

    notify("Report exported as CSV.", "success");
  }

  return (
    <div className="space-y-6">
      <div className="page-heading">
        <div>
          <p className="eyebrow">ACADEMY INSIGHTS</p>

          <h1 className="page-title">Reports</h1>

          <p className="page-subtitle">
            A clear summary of the records stored in your database.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            className="secondary-button"
            onClick={loadReports}
            disabled={busy}
          >
            <RefreshCw size={14} className={busy ? "animate-spin" : ""} />
            Refresh
          </button>

          <button
            className="primary-button"
            onClick={exportCsv}
            disabled={busy || !rows.length}
          >
            <Download size={14} />
            Export CSV
          </button>
        </div>
      </div>

      <section>
        <div className="section-heading-row">
          <div>
            <h2 className="section-title">Record totals</h2>

            <p className="muted-text">
              A quick count across all seven management modules
            </p>
          </div>

          <span className="tag">ORACLE DATABASE</span>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {rows.map((row) => {
            const Icon = icons[row.CATEGORY] || FileSpreadsheet;

            return (
              <article className="stat-card" key={row.CATEGORY}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="stat-label">{row.CATEGORY}</p>

                    <p className="stat-value">
                      {Number(row.TOTAL).toLocaleString()}
                    </p>

                    <p className="stat-note">Total records</p>
                  </div>

                  <div className="stat-icon">
                    <Icon size={19} />
                  </div>
                </div>
              </article>
            );
          })}

          {busy &&
            rows.length === 0 &&
            [1, 2, 3].map((item) => (
              <div className="stat-card report-skeleton" key={item} />
            ))}
        </div>
      </section>

      <section className="panel overflow-hidden">
        <div className="panel-heading px-5 pt-5">
          <div>
            <h2 className="section-title">Database record summary</h2>

            <p className="muted-text">
              Counts returned from the reporting endpoint
            </p>
          </div>

          <div className="stat-icon gold">
            <FileSpreadsheet size={18} />
          </div>
        </div>

        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Module</th>
                <th className="text-right">Total records</th>
              </tr>
            </thead>

            <tbody>
              {rows.map((row) => (
                <tr key={row.CATEGORY}>
                  <td>{row.CATEGORY}</td>

                  <td className="text-right font-semibold text-[#e5ede4]">
                    {Number(row.TOTAL).toLocaleString()}
                  </td>
                </tr>
              ))}

              {!busy && rows.length === 0 && (
                <tr>
                  <td colSpan="2" className="empty-cell">
                    No report data is available yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="resource-footer">
          <span>{rows.length} modules included</span>

          <span>{busy ? "Updating report…" : "Report data is up to date"}</span>
        </div>
      </section>
    </div>
  );
}
