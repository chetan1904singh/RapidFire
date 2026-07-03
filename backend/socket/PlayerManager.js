class PlayerManager {

  constructor() {
    this.players = new Map();
  }

  addPlayer(uid, name, email, socket) {

    this.players.set(uid, {

      uid,

      name,

      email,

      socket,

      status: "idle",

      roomId: null,

      score: 0,

      ready: false,

      answer: null,

    });

  }

  getPlayer(uid) {
    return this.players.get(uid);
  }

  getPlayerBySocket(socketId) {

    for (const player of this.players.values()) {

      if (player.socket.id === socketId) {
        return player;
      }

    }

    return null;
  }

  removePlayer(uid) {
    this.players.delete(uid);
  }

  setStatus(uid, status) {

    const player = this.getPlayer(uid);

    if (player) {
      player.status = status;
    }

  }

  setRoom(uid, roomId) {

    const player = this.getPlayer(uid);

    if (player) {
      player.roomId = roomId;
    }

  }

  clearRoom(uid) {

    const player = this.getPlayer(uid);

    if (!player) return;

    player.roomId = null;
    player.status = "idle";
    player.ready = false;
    player.answer = null;
    player.score = 0;

  }

}

export default new PlayerManager();