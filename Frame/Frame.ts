namespace Frame {
  window.addEventListener("load", start);
  window.addEventListener("message", (_event) => affectDocent(_event.data));

  let game: HTMLIFrameElement;

  type Stage = { title: string, docents: string[], game: string, data: object };

  const data: Stage[][] = [
    [
      { title: "Project 1", docents: ["Hottong", "Hahne"], game: "Brick/Brick.html", data: {} },
      { title: "Theory 1", docents: ["Schlegel"], game: "Multiple", data: {} }
    ]
  ];


  function start(): void {
    console.log("Start Frame");
    let stage: Stage = data[0][0];

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
      span.innerHTML += `<img src="${Common.pathToPortraits}${folder}/Neutral.png" id="${docent}">`;
    }
  }
  
  function affectDocent(_effect: Common.MESSAGE) {
    const span: HTMLSpanElement = document.querySelector("span#docents")!;
    const img: HTMLImageElement = <HTMLImageElement>span.children[0];
    img.src = `${Common.pathToPortraits}${img.id}/Attack.png`;
  }
}

