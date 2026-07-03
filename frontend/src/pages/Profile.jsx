import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/axios";

function Profile() {
  const { currentUser, logout } = useAuth();

  useEffect(() => {
    async function testBackend() {
      try {
        const token = await currentUser.getIdToken();

        console.log("Firebase Token:", token);

        const res = await api.get("/api/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("Backend Response:", res.data);
      } catch (err) {
        console.error(err.response?.data || err.message);
      }
    }

    if (currentUser) {
      testBackend();
    }
  }, [currentUser]);

  return (
  <div
    className="min-h-screen flex items-center justify-center bg-[#0f172a] px-6"
    style={{
      backgroundImage: "url('/background.jpg')",
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
    }}
  >
    <div className="w-full max-w-md rounded-3xl bg-slate-900/70 backdrop-blur-2xl border border-white/10 p-10 shadow-2xl text-center">
      <h2 className="text-3xl font-bold text-white mb-8">Profile</h2>

      <div className="space-y-4 mb-8">
        <div>
          <p className="text-sm text-gray-400">Name</p>
          <p className="text-lg font-semibold text-white">
            {currentUser?.displayName || "Not provided"}
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-400">Email</p>
          <p className="text-lg font-semibold text-white break-all">
            {currentUser?.email}
          </p>
        </div>
      </div>

      <button
        onClick={logout}
        className="w-full rounded-xl bg-red-600 py-3 font-semibold text-white transition hover:bg-red-700"
      >
        Logout
      </button>
    </div>
  </div>
);
}

export default Profile;