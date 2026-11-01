import { useEffect, useState } from "react";
import {
  Users, GraduationCap, BookOpen, CalendarDays, Wallet, TrendingUp,
  ArrowUpRight, RefreshCw, Sparkles
} from "lucide-react";
import {
  Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis
} from "recharts";
import api from "../api";

const money = (value) => `৳${Number(value || 0).toLocaleString("en-BD")}`;

export default function Dashboard({ notify }) {
  const [data, setData] = useState(null);
  const [busy, setBusy] = useState(true);

  async function loadDashboard() {
    setBusy(true);
    try {
      const response = await api.get("/dashboard");
      setData(response.data);
    } catch (error) {
      notify(error.response?.data?.message || "Dashboard could not load.", "error");
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => { loadDashboard(); }, []);

  const stats = data?.stats;
  const cards = [
    { label: "Total students", value: stats?.students, note: "Registered learners", Icon: Users, tone: "" },
    { label: "Teaching staff", value: stats?.teachers, note: "Teacher records", Icon: GraduationCap, tone: "gold" },
    { label: "Available courses", value: stats?.courses, note: "Course catalogue", Icon: BookOpen, tone: "blue" },
    { label: "Active batches", value: stats?.batches, note: "Scheduled groups", Icon: CalendarDays, tone: "" },
    { label: "Total revenue", value: money(stats?.revenue), note: "Successful payments", Icon: Wallet, tone: "gold" },
    { label: "Outstanding fees", value: money(stats?.outstanding), note: "Fees yet to collect", Icon: TrendingUp, tone: "rose" }
  ];

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div className="space-y-7">
      <section className="dashboard-welcome">
        <div>
          <p className="eyebrow">YOUR ACADEMY AT A GLANCE</p>
          <h1 className="page-title">{greeting}.</h1>
          <p className="page-subtitle">Here’s what’s happening across your coaching center today.</p>
        </div>
        <button className="secondary-button" onClick={loadDashboard} disabled={busy}>
          <RefreshCw size={14} className={busy ? "animate-spin" : ""} /> Refresh overview
        </button>
      </section>

      <section>
        <div className="section-heading-row">
          <div>
            <h2 className="section-title">Performance overview</h2>
            <p className="muted-text">Key numbers from your current records</p>
          </div>
          <span className="live-tag"><span className="online-dot" /> LIVE DATABASE</span>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {cards.map(({ label, value, note, Icon, tone }) => (
            <article className="stat-card" key={label}>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="stat-label">{label}</p>
                  <p className="stat-value">{busy && !data ? "—" : value ?? "0"}</p>
                  <p className="stat-note">{note}</p>
                </div>
                <div className={`stat-icon ${tone}`}><Icon size={19} strokeWidth={1.8} /></div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <div className="grid gap-5 xl:grid-cols-[1.55fr_1fr]">
        <section className="panel dashboard-panel">
          <div className="panel-heading">
            <div>
              <h2 className="section-title">Revenue overview</h2>
              <p className="muted-text">Monthly collected payments</p>
            </div>
            <span className="tag">LAST 6 MONTHS</span>
          </div>
          <div className="chart-area">
            {data?.monthlyRevenue?.length ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.monthlyRevenue} margin={{ top: 12, right: 8, left: -16, bottom: 0 }}>
                  <defs>
                    <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#a8c9b7" stopOpacity={0.28} />
                      <stop offset="100%" stopColor="#a8c9b7" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="rgba(222,231,219,.08)" vertical={false} />
                  <XAxis dataKey="MONTH" stroke="#81958a" tickLine={false} axisLine={false} tick={{ fill: "#8da095", fontSize: 10 }} />
                  <YAxis stroke="#81958a" tickLine={false} axisLine={false} tick={{ fill: "#8da095", fontSize: 9 }} />
                  <Tooltip
                    contentStyle={{ background: "#20332e", border: "1px solid rgba(222,231,219,.16)", borderRadius: 11, color: "#edf1e9", fontSize: 11 }}
                    formatter={(value) => [money(value), "Revenue"]}
                    labelStyle={{ color: "#b8c9bb", marginBottom: 4 }}
                  />
                  <Area type="monotone" dataKey="REVENUE" stroke="#a8c9b7" strokeWidth={2.5} fill="url(#revenueFill)" activeDot={{ r: 5, fill: "#d5bb85", stroke: "#20332e", strokeWidth: 2 }} />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="chart-empty">
                <div className="chart-empty-icon"><TrendingUp size={21} /></div>
                <p>{busy ? "Loading revenue data…" : "Your revenue story starts here."}</p>
                <span>Monthly collections will appear after payments are recorded.</span>
              </div>
            )}
          </div>
        </section>

        <section className="panel dashboard-panel">
          <div className="panel-heading">
            <div>
              <h2 className="section-title">Recent payments</h2>
              <p className="muted-text">Latest transactions recorded</p>
            </div>
            <div className="stat-icon gold"><Wallet size={18} /></div>
          </div>
          <div className="activity-list">
            {data?.recentPayments?.length ? data.recentPayments.map((payment) => (
              <div key={payment.PAYMENT_ID} className="activity-row">
                <div className="activity-avatar"><Wallet size={15} /></div>
                <div className="activity-main">
                  <p className="activity-name">{payment.FULL_NAME || "Student payment"}</p>
                  <p className="activity-meta">{payment.PAYMENT_METHOD || "Payment"} · {payment.PAYMENT_DATE?.slice?.(0, 10) || "Date unavailable"}</p>
                </div>
                <span className="activity-amount">{money(payment.AMOUNT)}</span>
              </div>
            )) : (
              <div className="activity-empty">
                <Sparkles size={18} />
                <p>{busy ? "Loading transactions…" : "No payments recorded yet."}</p>
                <span>New payment activity will show up here.</span>
              </div>
            )}
          </div>
        </section>
      </div>

      <section className="panel overflow-hidden">
        <div className="panel-heading px-5 pt-5">
          <div>
            <h2 className="section-title">Recently registered students</h2>
            <p className="muted-text">The latest additions to your student records</p>
          </div>
          <div className="stat-icon"><Users size={18} /></div>
        </div>
        <div className="table-wrap">
          <table className="data-table">
            <thead><tr><th>Student ID</th><th>Student name</th><th>Phone number</th><th>Status</th></tr></thead>
            <tbody>
              {data?.recentStudents?.length ? data.recentStudents.map((student) => (
                <tr key={student.STUDENT_ID}>
                  <td>{student.STUDENT_CODE || `ST-${student.STUDENT_ID}`}</td>
                  <td>{student.FULL_NAME}</td>
                  <td>{student.PHONE || "—"}</td>
                  <td><span className={`status-pill ${String(student.STATUS || "").toLowerCase()}`}>{student.STATUS || "—"}</span></td>
                </tr>
              )) : (
                <tr><td colSpan="4" className="empty-cell">{busy ? "Loading student records…" : "No students registered yet."}</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="table-footer-note"><span>Showing the latest student records</span><ArrowUpRight size={14} /></div>
      </section>
    </div>
  );
}
