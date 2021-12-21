const state = {
  data: {},
  listeners: [],
  getState() {
    return this.data;
  },
  setState(newState) {
    this.data = newState;
    for (const cb of this.listeners) {
      cb();
    }
  },
  subscribe(callback: (any) => any) {
    if (this.listeners.length < 3) {
      this.listeners.push(callback);
    }
  },
};

export { state };
