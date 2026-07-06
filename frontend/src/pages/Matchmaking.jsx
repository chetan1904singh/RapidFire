import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

import { useAuth } from "../context/AuthContext";
import { useSocket } from "../context/SocketContext";

function Matchmaking() {
    const { currentUser } = useAuth();
    const socket = useSocket();
    const navigate = useNavigate();
    const [selected, setSelected] = useState(null);

    useEffect(() => {
        let isMounted = true;

        async function connectSocket() {
            try {
                const token = await currentUser.getIdToken();

                socket.auth = { token };

                // Remove old listeners (important)
                socket.off("connect");
                

                socket.on("connect", () => {
                    console.log("✅ Connected:", socket.id);

                    socket.emit("find-match");
                });

                socket.on("game-start", (data) => {

                    console.log("🎮 GAME START");

                    console.log(data);

                    navigate(`/quiz/${data.roomId}`);

                });

                if (!socket.connected) {
                    socket.connect();
                } else {
                    // Already connected
                    console.log("➡️ Emitting find-match");
                    socket.emit("find-match");
                }
            } catch (err) {
                console.error(err);
            }
        }

        connectSocket();

        return () => {
    socket.off("connect");
    socket.off("game-start");
};
    }, [currentUser]);

    const cancelSearch = () => {
        socket.emit("cancel-match");
        navigate("/profile");
    };

    return (
  <div className="min-h-screen flex items-center justify-center px-4">
    <div className="w-full max-w-md bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-8 text-center">
      
      <h1 className="text-3xl font-bold text-white mb-4">
        Finding Opponent
      </h1>

      <div className="flex justify-center my-6">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>

      <p className="text-gray-300 mb-8">
        Looking for a worthy opponent...
        <br />
        Please wait.
      </p>

      <button
        onClick={cancelSearch}
        className="w-full bg-red-600 hover:bg-red-700 transition-all duration-200 text-white font-semibold py-3 rounded-xl"
      >
        Cancel Search
      </button>
    </div>
  </div>
);
}

export default Matchmaking;