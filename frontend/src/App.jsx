import { useEffect, useState } from "react";
import {
  BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate
} from "react-router-dom";
import {
  Menu, LogOut, GraduationCap, X, PanelLeftClose, PanelLeftOpen,
  ChevronRight, Sparkles
} from "lucide-react";
import api from "./api";
import { navigation } from "./config/modules";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import ResourcePage from "./components/ResourcePage";

function Toast({ toast }) {
  if (!toast) return null;
  return (
    <div className={`toast toast-${toast.type}`} role="status" aria-live="polite">
      <span className="toast-indicator" />
      <span>{toast.message}</span>
    </div>
  );
}

function Workspace({ admin, setAdmin, logout, notify }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const active = location.pathname.split("/")[1] || "dashboard";
  const current = navigation.find((item) => item.path === active) || navigation[0];
  const today = new Intl.DateTimeFormat("en", {
    weekday: "short", day: "numeric", month: "short", year: "numeric"
  }).format(new Date());

  useEffect(() => setSidebarOpen(false), [location.pathname]);

  return (
    <div className={`app-shell ${collapsed ? "sidebar-collapsed" : ""}`}>
      {sidebarOpen && (
        <button
          className="sidebar-scrim"
          aria-label="Close navigation"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside className={`sidebar ${sidebarOpen ? "sidebar-open" : ""}`}>
        <div className="sidebar-brand">
          <div className="brand-mark"><GraduationCap size={23} strokeWidth={1.8} /></div>
          <div className="brand-copy">
            <p className="brand-name">APEX <span>COACHING</span></p>
            <p className="brand-caption">ACADEMIC MANAGEMENT</p>
          </div>
          <button className="icon-button sidebar-close" onClick={() => setSidebarOpen(false)} aria-label="Close menu">
            <X size={18} />
          </button>
        </div>

        <div className="sidebar-scroll">
          <p className="nav-caption">WORKSPACE</p>
          <nav className="nav-list" aria-label="Main navigation">
            {navigation.map(({ label, path, icon: Icon }) => (
              <button
                key={path}
                onClick={() => navigate(`/${path}`)}
                className={`nav-link ${active === path ? "active" : ""}`}
                title={collapsed ? label : undefined}
                aria-current={active === path ? "page" : undefined}
              >
                <Icon size={18} strokeWidth={1.8} />
                <span className="nav-label">{label}</span>
                {active === path && <span className="nav-indicator" />}
              </button>
            ))}
          </nav>
        </div>

        <div className="sidebar-bottom">
          <div className="sidebar-note">
            <div className="sidebar-note-icon"><Sparkles size={15} /></div>
            <div className="sidebar-note-copy">
              <p className="sidebar-note-title">A calmer way to manage</p>
              <p className="sidebar-note-text">Keep your classes, people and payments in one organized place.</p>
            </div>
          </div>
          <div className="sidebar-version">
            <span className="online-dot" /> LOCAL WORKSPACE <span>V1.0</span>
          </div>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <div className="topbar-left">
            <button className="icon-button mobile-menu" onClick={() => setSidebarOpen(true)} aria-label="Open navigation">
              <Menu size={20} />
            </button>
            <button
              className="icon-button desktop-collapse"
              onClick={() => setCollapsed((value) => !value)}
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
            </button>
            <div className="topbar-heading">
              <div className="breadcrumb"><span>Apex Coaching</span><ChevronRight size={13} /><strong>{current.label}</strong></div>
              <p className="topbar-date">{today}</p>
            </div>
          </div>

          <div className="topbar-right">
            <div className="workspace-status"><span className="online-dot" /> <span>Workspace active</span></div>
            <div className="topbar-divider" />
            <div className="admin-chip">
              <div className="avatar">{(admin?.name || "A").charAt(0).toUpperCase()}</div>
              <div className="admin-copy">
                <p className="admin-name">{admin?.name || "Administrator"}</p>
                <p className="admin-role">Administrator</p>
              </div>
            </div>
            <button className="logout-button" onClick={logout} title="Sign out">
              <LogOut size={16} /><span>Sign out</span>
            </button>
          </div>
        </header>

        <div className="content-area">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard notify={notify} />} />
            <Route path="/reports" element={<Reports notify={notify} />} />
            <Route path="/settings" element={<Settings admin={admin} setAdmin={setAdmin} notify={notify} />} />
            {["students", "teachers", "courses", "batches", "enrollments", "payments", "attendance"].map((resource) => (
              <Route key={resource} path={`/${resource}`} element={<ResourcePage resource={resource} notify={notify} />} />
            ))}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>

        <footer className="footer">
          <span>© {new Date().getFullYear()} Apex Coaching Management</span>
          <span>Designed for organized learning operations</span>
        </footer>
      </main>
    </div>
  );
}

function AppContent() {
  const [admin, setAdmin] = useState(null);
  const [checking, setChecking] = useState(Boolean(localStorage.getItem("apex_token")));
  const [toast, setToast] = useState(null);

  function notify(message, type = "success") {
    setToast({ message, type });
    window.clearTimeout(window.__apexToastTimer);
    window.__apexToastTimer = window.setTimeout(() => setToast(null), 3400);
  }

  useEffect(() => {
    if (!localStorage.getItem("apex_token")) {
      setChecking(false);
      return;
    }
    api.get("/auth/me")
      .then((response) => setAdmin({
        id: response.data.id,
        name: response.data.name,
        email: response.data.email
      }))
      .catch(() => localStorage.removeItem("apex_token"))
      .finally(() => setChecking(false));
  }, []);

  function logout() {
    localStorage.removeItem("apex_token");
    setAdmin(null);
    notify("You have signed out.");
  }

  if (checking) {
    return <div className="loading-screen"><div className="loading-mark"><GraduationCap size={25} /></div><p>Preparing your workspace…</p></div>;
  }

  return (
    <>
      <Toast toast={toast} />
      {admin ? (
        <Workspace admin={admin} setAdmin={setAdmin} logout={logout} notify={notify} />
      ) : (
        <Login
          onLogin={(value) => {
            setAdmin(value);
            notify("Welcome to Apex Coaching.");
          }}
          notify={notify}
        />
      )}
    </>
  );
}

export default function App() {
  return <BrowserRouter><AppContent /></BrowserRouter>;
}
