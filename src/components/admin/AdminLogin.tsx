import React, { useState } from "react";
import api from "../../services/api";

const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Call backend admin login endpoint (adjust endpoint to match your backend)
      const res = await api.apiAuth("/admin/login", "POST", { email, password });

      // Expecting token + admin info in response; adapt to your backend shape
      const token = res?.token || res?.accessToken;
      if (!token) throw new Error(res?.message || "Login failed");

      // Save token locally (you can replace with a context login)
      localStorage.setItem("token", token);
      localStorage.setItem("adminEmail", email);

      // Redirect to admin dashboard (hash or path routing depends on your app)
      window.location.href = "#/admin/dashboard";
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Unable to login. Check credentials and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <h3 className="text-xl font-bold mb-4">Admin Login</h3>

      {error && <div className="text-sm text-red-600 mb-3">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-gray-700 mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full border rounded-md px-3 py-2"
            placeholder="admin@yourdomain.com"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-700 mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full border rounded-md px-3 py-2"
            placeholder="••••••••"
          />
        </div>

        <div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-blue text-white py-2 rounded-md font-semibold hover:opacity-95"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminLogin;
