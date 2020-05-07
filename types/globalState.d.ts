interface GlobalState {
  getState() : object;
  setState(key: string, value: object) : void;
  setNextState(value: object) : void;
  isEmpty() : boolean;
  clear(key?: string) : void;
}

export const globalState: GlobalState;
