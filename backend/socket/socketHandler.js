import { EVENTS } from "./events.js";
import PlayerManager from "./PlayerManager.js";
import GameManager from "./GameManager.js";

export default function socketHandler(io) {

    const gameManager = new GameManager(io);

    io.on("connection", (socket) => {

        const uid = socket.user.uid;
        const email = socket.user.email;

        console.log(`🟢 ${email} Connected`);

        // Register player
        PlayerManager.addPlayer(
            uid,
            socket.user.name || socket.user.email.split("@")[0],
            email,
            socket
        );

        // -------------------------
        // Matchmaking
        // -------------------------

        socket.on(EVENTS.FIND_MATCH, () => {
            gameManager.findMatch(uid);
        });

        socket.on(EVENTS.CANCEL_MATCH, () => {
            gameManager.cancelMatch(uid);
        });

        // -------------------------
        // Game
        // -------------------------

        socket.on(EVENTS.PLAYER_READY, (roomId) => {
            gameManager.playerReady(uid, roomId);
        });

        socket.on(EVENTS.SUBMIT_ANSWER, (data) => {
            gameManager.submitAnswer(
                uid,
                data.roomId,
                data.answer
            );
        });

        // -------------------------
        // Disconnect
        // -------------------------

        socket.on(EVENTS.DISCONNECT, () => {
            console.log(`🔴 ${email} Disconnected`);
            gameManager.disconnect(uid);
        });

    });

}