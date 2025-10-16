namespace Frame {
  import ƒ = FudgeCore;
  window.addEventListener("load", start);
  window.addEventListener("message", (_event) => receiveMessage(_event.data));

  let game: HTMLIFrameElement;

  type Module = { title: string, points: number, docents: string[], game: string, data: Record<string, string>, description: string };
  type Docent = { title: string, first: string, name: string, job: string, traits: { [trait: string]: number } };
  type Game = { url: string, callToAction: string };


  let modules: Module[][];
  let docents: { [id: string]: Docent };
  let games: { [id: string]: Game };





  async function start(): Promise<void> {
    console.log("Start Frame");

    modules = await (await fetch("/Frame/Modules.json")).json();
    docents = await (await fetch("/Frame/Docents.json")).json();
    games = await (await fetch("/Frame/Games.json")).json();

    const module: Module = modules[0][0];

    game = document.querySelector("iframe");
    let query: string = new URLSearchParams(module.data).toString()
    game.src = games[module.game].url + "?" + query;
    console.log(game, module.game);

    game.src = "Frame/Dialog/Start.html" + "?" + query;
    await new Promise<void>((_resolve) => {
      game.addEventListener("load", () => { console.log("loaded"); _resolve(); });
    });

    setupStart(module);
    // setupHeader(module.docents);
  }

  function setupStart(_module: Module): void {
    console.log("Setup Start Page");

    game.contentDocument.querySelector("h1").textContent = _module.title;
    game.contentDocument.querySelector("div").textContent = _module.description;
    game.contentDocument.querySelector("div#Call").textContent = games[_module.game].callToAction;
    game.contentDocument.querySelector("input").value = "" + _module.points;


    const enemies: HTMLDivElement = game.contentDocument.querySelector("div#Docents");
    const template: HTMLSpanElement = enemies.querySelector("div.docent");
    enemies.removeChild(template);

    for (let id of _module.docents) {
      const clone: HTMLElement = <HTMLElement>template.cloneNode(true);
      const docent: Docent = docents[id];
      clone.querySelector("img").src = Common.pathToPortraits + id + "_Idle.png";
      clone.querySelector("h2").textContent = docent.title + " " + docent.first + " " + docent.name;
      clone.querySelector("h3").textContent = docent.job;

      const meters: NodeListOf<HTMLMeterElement> = clone.querySelectorAll("meter");
      for (let i: number = 0; i < meters.length; i++) {
        const trait: string = Object.keys(docent.traits)[i];
        meters[i].value = docent.traits[trait];
        meters[i].previousSibling.textContent = trait;
      }

      enemies.appendChild(clone);
    }
  }

  function setupHeader(_docents: string[]) {
    let span: HTMLSpanElement = document.querySelector("span#docents")!;
    span.innerHTML = "";
    for (let iDocent in _docents) {
      const docent: Docent = docents[_docents[iDocent]];
      span.innerHTML += `<figure><img src="" id="${_docents[iDocent]}"/><figcaption>${docent.first}</figcaption></figure>`;
      affectDocent(+iDocent, Common.MESSAGE.IDLE);
    }
  }


  function receiveMessage(_data: any): any {
    let message: Common.MESSAGE = _data.type;

    switch (message) {
      case Common.MESSAGE.FAIL:
        console.log("FAIL!");
        break;
      case Common.MESSAGE.PASS:
        console.log("PASS!");
        break;
      default:
        affectDocent(_data.docent, message);
        break;
    }
  }

  function affectDocent(_which: number | string | undefined, _effect: Common.MESSAGE) {
    const images: NodeListOf<HTMLImageElement> = document.querySelector("span#docents")!.querySelectorAll("img");

    let docent: string;
    if (_which) {
      docent = _which.toString();
      if (typeof (_which) == "number")
        docent = images[_which].id;
    }
    for (const img of images)
      if (docent != undefined && docent != img.id) // affect only image with the id docent, or all docent chosen
        continue;
      else {
        if (img.src.endsWith("Dead.png")) // don't change if already dead
          continue;
        img.src = `${Common.pathToPortraits}${img.id}_${_effect}.png`;
      }
  }
}

