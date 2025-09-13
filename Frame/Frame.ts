namespace Frame {
  window.addEventListener("load", start);
  window.addEventListener("message", (_event)=>console.log(_event));

  let game: HTMLIFrameElement;

  type Stage = {title: string, docents: string[], game: string, data: object};

  const data:Stage[][] = [
    [
      { title: "Project 1", docents: ["Hottong", "Hahne"], game: "Brick/Brick.html", data: {} },
      { title: "Theory 1", docents: ["Schlegel"], game: "Multiple", data: {} }
    ]
  ];


  function start(): void {
    console.log("Start Frame");
    let stage:Stage = data[0][0];

    game = document.querySelector("iframe");
    game.src = stage.game;
    console.log(game, stage.game);

    setupHeader(stage.docents);
  }
 
  function setupHeader(docents: string[]) {
    let span: HTMLSpanElement = document.querySelector("span#docents")!;
    span.innerHTML = "";
    for (let docent of docents) {
      let folder: string = "Dummy"; // docent;  // change this to docent when the images are available
      span.innerHTML += `<img src="Common/Header/Portraits/${folder}/Neutral.png">`;
    }
  }
}

