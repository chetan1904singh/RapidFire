class TimerManager {

  constructor(io) {
    this.io = io;
    this.activeTimers = new Map();
  }

  start(room, onComplete) {

    this.stop(room.id);

    room.timeLeft = 20;

    this.io.to(room.id).emit("timer-update", room.timeLeft);

    const interval = setInterval(() => {

      room.timeLeft--;

      this.io.to(room.id).emit("timer-update", room.timeLeft);

      if (room.timeLeft <= 0) {

        this.stop(room.id);

        onComplete();

      }

    }, 1000);

    this.activeTimers.set(room.id, interval);

  }

  stop(roomId) {

    if (this.activeTimers.has(roomId)) {

      clearInterval(this.activeTimers.get(roomId));

      this.activeTimers.delete(roomId);

    }

  }

}

export default TimerManager;