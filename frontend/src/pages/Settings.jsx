import { useEffect, useState } from "react";
import { UserRound, ShieldCheck, Save, KeyRound } from "lucide-react";
import api from "../api";

export default function Settings({ admin, setAdmin, notify }) {
  const [name, setName] = useState(admin?.name || "");
  const [email, setEmail] = useState(admin?.email || "");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [profileBusy, setProfileBusy] = useState(false);
  const [passwordBusy, setPasswordBusy] = useState(false);

  useEffect(() => {
    setName(admin?.name || "");
    setEmail(admin?.email || "");
  }, [admin]);

  async function saveProfile(event) {
    event.preventDefault();

    if (profileBusy) return;

    setProfileBusy(true);

    try {
      const response = await api.put("/auth/profile", {
        name: name.trim(),
        email: email.trim().toLowerCase(),
      });

      const updatedAdmin = response.data.admin;

      // Replace the old token with the refreshed token.
      localStorage.setItem("apex_token", response.data.token);

      // Update the administrator information across the application.
      setAdmin(updatedAdmin);

      setName(updatedAdmin.name);
      setEmail(updatedAdmin.email);

      notify("Profile updated successfully.", "success");
    } catch (error) {
      notify(
        error.response?.data?.message || "Could not update profile.",
        "error",
      );
    } finally {
      setProfileBusy(false);
    }
  }

  async function savePassword(event) {
    event.preventDefault();

    if (passwordBusy) return;

    setPasswordBusy(true);

    try {
      await api.put("/auth/password", {
        currentPassword,
        newPassword,
      });

      setCurrentPassword("");
      setNewPassword("");

      notify("Password changed successfully.", "success");
    } catch (error) {
      notify(
        error.response?.data?.message || "Could not change password.",
        "error",
      );
    } finally {
      setPasswordBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="eyebrow">WORKSPACE PREFERENCES</p>
        <h1 className="page-title">Settings</h1>
        <p className="page-subtitle">
          Manage your administrator profile and account security.
        </p>
      </div>

      <div className="settings-intro">
        <div className="settings-intro-icon">
          <ShieldCheck size={20} />
        </div>

        <div>
          <p className="settings-intro-title">Administrator account</p>
          <p className="settings-intro-text">
            Changes made here apply to the account currently signed in to Apex.
          </p>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        {/* Profile information */}
        <section className="panel settings-panel">
          <div className="settings-panel-heading">
            <div className="stat-icon">
              <UserRound size={19} />
            </div>

            <div>
              <h2 className="section-title">Profile information</h2>
              <p className="muted-text">
                Update your administrator name and sign-in email.
              </p>
            </div>
          </div>

          <form onSubmit={saveProfile} className="settings-form">
            <label className="block space-y-2">
              <span className="field-label">Full name</span>

              <input
                className="field-control"
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
                minLength="2"
                maxLength="120"
                placeholder="Enter your name"
              />
            </label>

            <label className="block space-y-2">
              <span className="field-label">Email address</span>

              <input
                className="field-control"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                maxLength="180"
                placeholder="Enter your email address"
              />

              <span className="field-hint">
                This email address will be used for your future logins.
              </span>
            </label>

            <div className="settings-form-footer">
              <button
                className="primary-button"
                type="submit"
                disabled={profileBusy}
              >
                <Save size={14} />
                {profileBusy ? "Saving…" : "Save profile"}
              </button>
            </div>
          </form>
        </section>

        {/* Change password */}
        <section className="panel settings-panel">
          <div className="settings-panel-heading">
            <div className="stat-icon gold">
              <KeyRound size={19} />
            </div>

            <div>
              <h2 className="section-title">Change password</h2>
              <p className="muted-text">
                Choose a password with at least 8 characters.
              </p>
            </div>
          </div>

          <form onSubmit={savePassword} className="settings-form">
            <label className="block space-y-2">
              <span className="field-label">Current password</span>

              <input
                className="field-control"
                type="password"
                autoComplete="current-password"
                value={currentPassword}
                onChange={(event) => setCurrentPassword(event.target.value)}
                required
                placeholder="Enter current password"
              />
            </label>

            <label className="block space-y-2">
              <span className="field-label">New password</span>

              <input
                className="field-control"
                type="password"
                autoComplete="new-password"
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                minLength="8"
                required
                placeholder="Enter new password"
              />

              <span className="field-hint">
                Use a combination that is easy for you to remember and difficult
                to guess.
              </span>
            </label>

            <div className="settings-form-footer">
              <button
                className="primary-button"
                type="submit"
                disabled={passwordBusy}
              >
                <ShieldCheck size={14} />
                {passwordBusy ? "Updating…" : "Update password"}
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}
