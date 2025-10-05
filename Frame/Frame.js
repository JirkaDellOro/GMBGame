var Frame;
(function (Frame) {
    window.addEventListener("load", start);
    window.addEventListener("message", (_event) => affectDocent(_event.data.docent, _event.data.type));
    let game;
    const docents = {
        "NH": { title: "Prof.", first: "Nikolaus", name: "Hottong", skills: [] },
        "UH": { title: "Prof. Dr.", first: "Uwe", name: "Hahne", skills: [] },
        "NS": { title: "Prof. Dr.", first: "Norbert", name: "Schnell", skills: [] },
        "JD": { title: "Prof.", first: "Jirka", name: "Dell'Oro-Friedl", skills: [] },
        "JT": { title: "MA", first: "Julien", name: "Trübiger", skills: [] },
        "CM": { title: "Prof.", first: "Christoph", name: "Müller", skills: [] },
        "CF": { title: "Dipl.-Vw.", first: "Christian", name: "Franz", skills: [] },
    };
    const data = [
        [
            { title: "Project 1", docents: ["CM", "UH"], game: "Brick/Brick.html", data: {} },
            { title: "Code 1", docents: ["JD"], game: "Multiple", data: {} },
            { title: "Theory 1", docents: ["TS"], game: "Multiple", data: {} }
        ]
    ];
    function start() {
        console.log("Start Frame");
        let stage = data[0][0];
        game = document.querySelector("iframe");
        game.src = stage.game;
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
    function affectDocent(_which, _effect) {
        const images = document.querySelector("span#docents").querySelectorAll("img");
        for (let iImage in images)
            if (_which != undefined && _which != Number(iImage))
                continue;
            else {
                const img = images[iImage];
                if (img.src.endsWith("Dead.png")) // don't change if already dead
                    continue;
                img.src = `${Common.pathToPortraits}${img.id}_${_effect}.png`;
            }
    }
})(Frame || (Frame = {}));
//# sourceMappingURL=Frame.js.map