namespace Common {
  export enum MESSAGE {
    KILL="kill", 
    HIT="hit", 
    NEUTRAL="neutral"
  }

  export type Message = {type:MESSAGE, docent?: number};

  export const pathToPortraits: string = "Common/Header/Portraits/";
}