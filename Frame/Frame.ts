namespace Frame {
  window.addEventListener("load", start);
  window.addEventListener("message", (_event) => affectDocent(_event.data.docent, _event.data.type));

  let game: HTMLIFrameElement;

  type Stage = { title: string, docents: string[], game: string, data: Record<string,string> };
  type Docent = {title: string, first: string, name: string, skills: {skill: string, value: number}[]};

  const docents: {[id: string]: Docent} = {
    "NO": {title: "Prof.", first: "Nikolaus", name: "Hottong", skills: []},
    "UH": {title: "Prof. Dr.", first: "Uwe", name: "Hahne", skills: []},
    "NS": {title: "Prof. Dr.", first: "Norbert", name: "Schnell", skills: []},
    "JD": {title: "Prof.", first: "Jirka", name: "Dell'Oro-Friedl", skills: []},
    "JT": {title: "MA", first: "Julien", name: "Trübiger", skills: []},
    "CM": {title: "Prof.", first: "Christoph", name: "Müller", skills: []},
    "CF": {title: "Dipl.-Vw.", first: "Christian", name: "Franz", skills: []},
    "NH": {title: "MA", first: "Niv", name: "Shpigel", skills: []},
  };

  const data: Stage[][] = [
    [
      { title: "Project 1", docents: ["KO", "UH"], game: "Brick/Brick.html", data: {} },
      { title: "Visual 1", docents: ["NH", "CM"], game: "Quiz/Quiz.html", data: {tasks: "Visual1.json"} },
      { title: "Theory 1", docents: ["TS"], game: "Multiple", data: {} }
    ]
  ];

  

  function start(): void {
    console.log("Start Frame");
    let stage: Stage = data[0][1];

    game = document.querySelector("iframe");
    let query: string = new URLSearchParams(stage.data).toString()
    game.src = stage.game + "?" + query;
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

