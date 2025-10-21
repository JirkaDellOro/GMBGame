var Frame;
(function (Frame) {
    window.addEventListener("load", start);
    window.addEventListener("message", (_event) => receiveMessage(_event.data));
    let game;
    let modules;
    let docents;
    let games;
    let curriculum;
    let module;
    async function start() {
        console.log("Start Frame");
        modules = await (await fetch(Common.root + "/Frame/Modules.json")).json();
        docents = await (await fetch(Common.root + "/Frame/Docents.json")).json();
        games = await (await fetch(Common.root + "/Frame/Games.json")).json();
        curriculum = await (await fetch(Common.root + "/Frame/Curriculum.json")).json();
        module = modules[curriculum[0]];
        game = document.querySelector("iframe");
        setupStart(module);
    }
    async function setupStop(_module, _pass) {
        console.log("Setup Stop Page");
        await load("/Frame/Dialog/Stop.html");
        game.contentDocument.querySelector("h1").textContent = _module.title;
        game.contentDocument.querySelector("input").value = "" + _module.points;
        game.contentDocument.querySelector("div#Result").textContent = _pass ? "YOU PASSED!" : "YOU FAILED!";
        let selector = "input[name=" + (_pass ? "Bonus" : "MalusBasic") + "]";
        let receiver = document.body.querySelector(selector);
        receiver.value = "" + (+receiver.value + _module.points);
    }
    async function setupStart(_module) {
        console.log("Setup Start Page");
        await load("/Frame/Dialog/Start.html");
        game.contentDocument.querySelector("h1").textContent = _module.title;
        game.contentDocument.querySelector("div").textContent = _module.description;
        game.contentDocument.querySelector("div#Call").textContent = games[_module.game].callToAction;
        game.contentDocument.querySelector("input").value = "" + _module.points;
        game.contentDocument.querySelector("button").addEventListener("click", () => startGame(_module));
        const enemies = game.contentDocument.querySelector("div#Docents");
        const template = enemies.querySelector("div.docent");
        enemies.removeChild(template);
        for (let id of _module.docents) {
            const clone = template.cloneNode(true);
            const docent = docents[id];
            clone.querySelector("img").src = Common.pathToPortraits + id + "_Idle.png";
            clone.querySelector("h2").textContent = docent.title + " " + docent.first + " " + docent.name;
            clone.querySelector("h3").textContent = docent.job;
            const meters = clone.querySelectorAll("meter");
            for (let i = 0; i < meters.length; i++) {
                const trait = Object.keys(docent.traits)[i];
                meters[i].value = docent.traits[trait];
                meters[i].previousSibling.textContent = trait;
            }
            enemies.appendChild(clone);
        }
    }
    async function load(_path) {
        game.src = Common.root + _path;
        await new Promise((_resolve) => {
            game.addEventListener("load", () => { console.log("loaded"); _resolve(); });
        });
    }
    function startGame(_module) {
        let query = new URLSearchParams(_module.data).toString();
        game.src = games[_module.game].url + "?" + query;
        console.log(game, _module.game);
        +"?" + query;
        setupHeader(_module.docents);
    }
    function setupHeader(_docents) {
        let span = document.querySelector("span#docents");
        span.innerHTML = "";
        for (let iDocent in _docents) {
            const docent = docents[_docents[iDocent]];
            span.innerHTML += `<figure><img src="" id="${_docents[iDocent]}"/><figcaption>${docent.first}</figcaption></figure>`;
            affectDocent(+iDocent, Common.MESSAGE.IDLE);
        }
    }
    function receiveMessage(_data) {
        let message = _data.type;
        switch (message) {
            case Common.MESSAGE.FAIL:
                console.log("FAIL!");
                setupStop(module, false);
                break;
            case Common.MESSAGE.PASS:
                console.log("PASS!");
                setupStop(module, true);
                break;
            default:
                affectDocent(_data.docent, message);
                break;
        }
    }
    function affectDocent(_which, _effect) {
        const images = document.querySelector("span#docents").querySelectorAll("img");
        let docent;
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
})(Frame || (Frame = {}));
//# sourceMappingURL=Frame.js.map