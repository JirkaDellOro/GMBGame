var Frame;
(function (Frame) {
    window.addEventListener("load", start);
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
        // game.src = 
        console.log(game, stage.game);
        setupHeader(stage.docents);
    }
    function setupHeader(docents) {
        let header = document.querySelector("div#header");
        // header.innerHTML = "";
    }
})(Frame || (Frame = {}));
//# sourceMappingURL=Frame.js.map