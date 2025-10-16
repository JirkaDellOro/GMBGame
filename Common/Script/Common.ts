namespace Common {
  export enum MESSAGE {
    ANGRY = "Angry",
    HURT = "Hurt",
    IDLE = "Idle",
    DEAD = "Dead",
    FAIL = "Fail",
    PASS = "Pass"
  }

  export type Message = { type: MESSAGE, docent?: number | string };

  export const pathToPortraits: string = "/Common/Portraits/";

  export function sendMessage(_message: Common.MESSAGE, _docent?: number | string): void {
    let message: Common.Message = { type: _message, docent: _docent };
    parent.postMessage(message);
  }
}