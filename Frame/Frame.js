var Frame;
(function (Frame) {
    window.addEventListener("load", start);
    window.addEventListener("message", (_event) => receiveMessage(_event.data));
    let game;
    const docents = {
        "NO": { title: "Prof.", first: "Nikolaus", name: "Hottong", skills: [] },
        "UH": { title: "Prof. Dr.", first: "Uwe", name: "Hahne", skills: [] },
        "NS": { title: "Prof. Dr.", first: "Norbert", name: "Schnell", skills: [] },
        "JD": { title: "Prof.", first: "Jirka", name: "Dell'Oro-Friedl", skills: [] },
        "JT": { title: "MA", first: "Julien", name: "Trübiger", skills: [] },
        "CM": { title: "Prof.", first: "Christoph", name: "Müller", skills: [] },
        "CF": { title: "Dipl.-Vw.", first: "Christian", name: "Franz", skills: [] },
        "NH": { title: "B.F.A", first: "Niv", name: "Shpigel", skills: [] },
    };
    const data = [
        [
            { title: "Project 1", docents: ["KO", "UH"], game: "Brick/Brick.html", data: {} },
            { title: "Visual 1", docents: ["NH", "CM"], game: "Quiz/Quiz.html", data: { tasks: "Visual1.json" } },
            { title: "Theory 1", docents: ["TS"], game: "Multiple", data: {} }
        ]
    ];
    function start() {
        console.log("Start Frame");
        let stage = data[0][1];
        game = document.querySelector("iframe");
        let query = new URLSearchParams(stage.data).toString();
        game.src = stage.game + "?" + query;
        console.log(game, stage.game);
        setupHeader(stage.docents);
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