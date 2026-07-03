class MatchmakingQueue {

  constructor() {

    this.queue = [];

  }

  add(player) {

    const exists = this.queue.some(

      p => p.uid === player.uid

    );

    if (!exists)

      this.queue.push(player);

  }

  remove(uid) {

    this.queue = this.queue.filter(

      player => player.uid !== uid

    );

  }

  contains(uid) {

    return this.queue.some(

      player => player.uid === uid

    );

  }

  size() {

    return this.queue.length;

  }

  getQueue() {

    return this.queue;

  }

  popTwoPlayers() {

    if (this.queue.length < 2)

      return null;

    return [

      this.queue.shift(),

      this.queue.shift(),

    ];

  }

}

export default new MatchmakingQueue();