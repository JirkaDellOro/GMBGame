var Frame;
(function (Frame) {
    window.addEventListener("load", start);
    window.addEventListener("message", (_event) => receiveMessage(_event.data));
    let game;
    let modules;
    let docents;
    let games;
    async function start() {
        console.log("Start Frame");
        modules = await (await fetch("/Frame/Modules.json")).json();
        docents = await (await fetch("/Frame/Docents.json")).json();
        games = await (await fetch("/Frame/Games.json")).json();
        const module = modules[0][0];
        game = document.querySelector("iframe");
        let query = new URLSearchParams(module.data).toString();
        game.src = games[module.game].url + "?" + query;
        console.log(game, module.game);
        game.src = "Frame/Dialog/Start.html" + "?" + query;
        await new Promise((_resolve) => {
            game.addEventListener("load", () => { console.log("loaded"); _resolve(); });
        });
        setupStart(module);
        // setupHeader(module.docents);
    }
    function setupStart(_module) {
        console.log("Setup Start Page");
        game.contentDocument.querySelector("h1").textContent = _module.title;
        game.contentDocument.querySelector("div").textContent = _module.description;
        game.contentDocument.querySelector("div#Call").textContent = games[_module.game].callToAction;
        game.contentDocument.querySelector("input").value = "" + _module.points;
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
                break;
            case Common.MESSAGE.PASS:
                console.log("PASS!");
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