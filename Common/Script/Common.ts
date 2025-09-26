namespace Common {
  export enum MESSAGE {
    ANGRY="Angry", 
    HURT="Hurt", 
    IDLE="Idle",
    DEAD="Dead"
  }

  export type Message = {type:MESSAGE, docent?: number};

  export const pathToPortraits: string = "Common/Header/Portraits/";
}