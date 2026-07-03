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
        <div style={{ padding: 30 }}>
            <h1>Finding Opponent...</h1>

            <p>Please wait...</p>

            <button onClick={cancelSearch}>
                Cancel
            </button>
        </div>
    );
}

export default Matchmaking;