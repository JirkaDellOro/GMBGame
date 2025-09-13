var Frame;
(function (Frame) {
    window.addEventListener("load", start);
    window.addEventListener("message", (_event) => affectDocent(_event.data));
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
        for (let docent of docents) {
            let folder = "Dummy"; // docent;  // change this to docent when the images are available
            span.innerHTML += `<img src="${Common.pathToPortraits}${folder}/Neutral.png" id="${docent}">`;
        }
    }
    function affectDocent(_effect) {
        const span = document.querySelector("span#docents");
        const img = span.children[0];
        img.src = `${Common.pathToPortraits}${img.id}/Attack.png`;
    }
})(Frame || (Frame = {}));
//# sourceMappingURL=Frame.js.map