import { useState } from "react";
import {
  GraduationCap, LockKeyhole, Mail, ArrowRight, Eye, EyeOff, ShieldCheck
} from "lucide-react";
import api from "../api";

export default function Login({ onLogin, notify }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);

  async function submit(event) {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    try {
      const result = await api.post("/auth/login", { email: email.trim(), password });
      localStorage.setItem("apex_token", result.data.token);
      onLogin(result.data.admin);
    } catch (error) {
      notify(error.response?.data?.message || "Unable to sign in. Check your email and password.", "error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="login-shell">
      <div className="login-decoration one" />
      <div className="login-decoration two" />

      <section className="login-layout">
        <div className="login-story">
          <div className="login-brand">
            <div className="brand-mark"><GraduationCap size={25} strokeWidth={1.8} /></div>
            <div>
              <p className="brand-name">APEX <span>COACHING</span></p>
              <p className="brand-caption">ACADEMIC MANAGEMENT</p>
            </div>
          </div>

          <div className="login-story-content">
            <p className="login-kicker">A MORE ORGANIZED WAY TO LEARN</p>
            <h1 className="login-story-title">Bring every part of your <span>academy</span> together.</h1>
            <p className="login-story-description">
              Keep student records, teaching teams, class schedules and payments connected in one thoughtful workspace.
            </p>
          </div>

          <p className="login-story-footer">ONE WORKSPACE · CLEARER OPERATIONS · BETTER FOCUS</p>
        </div>

        <div className="login-form-side">
          <div className="login-form-wrap">
            <p className="eyebrow">ADMINISTRATOR ACCESS</p>
            <h2 className="login-form-title mt-3">Welcome back.</h2>
            <p className="login-form-description">Sign in with your administrator account to continue to your workspace.</p>

            <form onSubmit={submit} className="login-form">
              <label className="block space-y-2">
                <span className="field-label">Email address</span>
                <div className="relative">
                  <Mail className="input-icon" size={16} />
                  <input
                    className="field-control input-with-icon"
                    type="email"
                    autoComplete="username"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                  />
                </div>
              </label>

              <label className="block space-y-2">
                <span className="field-label">Password</span>
                <div className="relative">
                  <LockKeyhole className="input-icon" size={16} />
                  <input
                    className="field-control input-with-icon"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword((value) => !value)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </label>

              <button className="primary-button login-submit" type="submit" disabled={busy}>
                {busy ? "Signing in…" : "Sign in to workspace"}
                {!busy && <ArrowRight size={16} />}
              </button>
            </form>

            <div className="login-note">
              <ShieldCheck size={14} className="mx-auto mb-2 text-[#9fbea9]" />
              <p>Administrator access is intended for the local academic project environment.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
