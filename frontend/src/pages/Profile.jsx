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
    <div style={{ padding: 20 }}>
      <h2>Profile</h2>

      <p>{currentUser?.displayName}</p>

      <p>{currentUser?.email}</p>

      <button onClick={logout}>Logout</button>
    </div>
  );
}

export default Profile;