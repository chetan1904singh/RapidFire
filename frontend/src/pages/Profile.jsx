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
    <div style={{ padding: 30 }}>
      <h2>Profile</h2>

      <p>
        <strong>Name:</strong> {currentUser?.displayName}
      </p>

      <p>
        <strong>Email:</strong> {currentUser?.email}
      </p>

      <br />

      <button onClick={() => navigate("/matchmaking")}>
        🎮 Play Online
      </button>

      <br />
      <br />

      <button onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}

export default Profile;