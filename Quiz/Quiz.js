var Quiz;
(function (Quiz) {
    var ƒ = FudgeCore;
    let TASK;
    (function (TASK) {
        TASK[TASK["SC"] = 0] = "SC";
        TASK[TASK["MC"] = 1] = "MC";
    })(TASK || (TASK = {}));
    const tasks = [
        { type: TASK.SC, question: "Which city is germany's capital?", options: ["Berlin", "Hamburg", "München", "Frankfurt"], correct: 0 }
    ];
    window.addEventListener("load", start);
    const task = tasks[0];
    function start() {
        createHTML(task);
        document.querySelector("button").addEventListener("click", () => validate(task));
    }
    function validate(_task) {
        const formdata = new FormData(document.forms[0]);
        const result = formdata.get("option");
        console.log(result == "" + _task.correct);
    }
    function createHTML(_task) {
        let question = document.querySelector("div#Question");
        let options = document.querySelector("div#Options");
        question.innerText = tasks[0].question;
        const spans = [];
        for (let option in _task.options) {
            const input = document.createElement("input");
            input.type = "radio";
            input.id = "option" + option;
            input.name = "option";
            input.value = option;
            const label = document.createElement("label");
            label.htmlFor = input.id;
            label.innerText = _task.options[option];
            const span = document.createElement("span");
            span.appendChild(input);
            span.appendChild(label);
            spans.push(span);
        }
        while (spans.length)
            options.appendChild(spans.splice(ƒ.random.getIndex(spans), 1)[0]);
    }
})(Quiz || (Quiz = {}));
//# sourceMappingURL=Quiz.js.map