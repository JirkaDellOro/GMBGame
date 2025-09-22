var Frame;
(function (Frame) {
    window.addEventListener("load", start);
    window.addEventListener("message", (_event) => affectDocent(_event.data.docent, _event.data.type));
    let game;
    const data = [
        [
            { title: "Project 1", docents: ["Hottong", "Hahne"], game: "Brick/Brick.html", data: {} },
            { title: "Theory 1", docents: ["Schlegel"], game: "Multiple", data: {} }
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
    function setupHeader(docents) {
        let span = document.querySelector("span#docents");
        span.innerHTML = "";
        for (let iDocent in docents) {
            span.innerHTML += `<img src="" id="${docents[iDocent]}">`;
            affectDocent(+iDocent, Common.MESSAGE.NEUTRAL);
        }
    }
    function affectDocent(_which, _effect) {
        const span = document.querySelector("span#docents");
        for (let child in span.children)
            if (_which != undefined && _which != Number(child))
                continue;
            else {
                const img = span.children[child];
                if (img.src.split("/").pop() == "Die.png") // don't change if already dead
                    continue;
                let folder = "Dummy"; // img.id; 
                img.src = `${Common.pathToPortraits}${folder}/${_effect}.png`;
            }
    }
})(Frame || (Frame = {}));
//# sourceMappingURL=Frame.js.map