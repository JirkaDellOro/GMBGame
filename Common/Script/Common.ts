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

  export const root: string = (() => {
    let path: string[] = location.href.split("/");
    path.pop();
    return path.join("/");
  })();
  export const pathToPortraits: string = root + "/Common/Portraits/";

  export function sendMessage(_message: Common.MESSAGE, _docent?: number | string): void {
    let message: Common.Message = { type: _message, docent: _docent };
    parent.postMessage(message);
  }
}