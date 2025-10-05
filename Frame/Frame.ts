namespace Frame {
  window.addEventListener("load", start);
  window.addEventListener("message", (_event) => affectDocent(_event.data.docent, _event.data.type));

  let game: HTMLIFrameElement;

  type Stage = { title: string, docents: string[], game: string, data: object };
  type Docent = {title: string, first: string, name: string, skills: {skill: string, value: number}[]};

  const docents: {[id: string]: Docent} = {
    "NH": {title: "Prof.", first: "Nikolaus", name: "Hottong", skills: []},
    "UH": {title: "Prof. Dr.", first: "Uwe", name: "Hahne", skills: []},
    "NS": {title: "Prof. Dr.", first: "Norbert", name: "Schnell", skills: []},
    "JD": {title: "Prof.", first: "Jirka", name: "Dell'Oro-Friedl", skills: []},
    "JT": {title: "MA", first: "Julien", name: "Trübiger", skills: []},
    "CM": {title: "Prof.", first: "Christoph", name: "Müller", skills: []},
    "CF": {title: "Dipl.-Vw.", first: "Christian", name: "Franz", skills: []},
  };

  const data: Stage[][] = [
    [
      { title: "Project 1", docents: ["CM", "UH"], game: "Brick/Brick.html", data: {} },
      { title: "Code 1", docents: ["JD"], game: "Multiple", data: {} },
      { title: "Theory 1", docents: ["TS"], game: "Multiple", data: {} }
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

  function setupHeader(_docents: string[]) {
    let span: HTMLSpanElement = document.querySelector("span#docents")!;
    span.innerHTML = "";
    for (let iDocent in _docents) {
      const docent:Docent = docents[_docents[iDocent]];
      span.innerHTML += `<figure><img src="" id="${_docents[iDocent]}"/><figcaption>${docent.first}</figcaption></figure>`;
      affectDocent(+iDocent, Common.MESSAGE.IDLE);
    }
  }

  function affectDocent(_which: number, _effect: Common.MESSAGE) {
    const images: NodeListOf<HTMLImageElement> = document.querySelector("span#docents")!.querySelectorAll("img");
    for (let iImage in images)
      if (_which != undefined && _which != Number(iImage))
        continue;
      else {
        const img: HTMLImageElement = images[iImage];
        if (img.src.endsWith("Dead.png")) // don't change if already dead
          continue;
        img.src = `${Common.pathToPortraits}${img.id}_${_effect}.png`;
      }
  }
}

