import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useSocket } from "../context/SocketContext";

function Profile() {
  const { currentUser, logout } = useAuth();
  const socket = useSocket();
  const navigate = useNavigate();

  const handleLogout = async () => {
    socket.disconnect();
    await logout();
    navigate("/login");
  };

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
          onClick={() => navigate("/matchmaking")}
          className="w-full rounded-xl bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700 mb-4"
        >
          🎮 Play Online
        </button>

        <button
          onClick={handleLogout}
          className="w-full rounded-xl bg-red-600 py-3 font-semibold text-white hover:bg-red-700"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Profile;