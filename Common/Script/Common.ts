namespace Common {
  export enum MESSAGE {
    KILL="Kill", 
    HIT="Hit", 
    NEUTRAL="Neutral",
    DIE="Die"
  }

  export type Message = {type:MESSAGE, docent?: number};

  export const pathToPortraits: string = "Common/Header/Portraits/";
}