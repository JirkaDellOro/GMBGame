var Quiz;
(function (Quiz) {
    let TASK;
    (function (TASK) {
        TASK[TASK["SC"] = 0] = "SC";
        TASK[TASK["MC"] = 1] = "MC";
    })(TASK || (TASK = {}));
    const tasks = [
        { type: TASK.SC, question: "Which city is germany's capital?", answers: ["Berlin", "Hamburg", "München", "Frankfurt"], correct: 1 }
    ];
    window.addEventListener("load", start);
    function start() {
        createHTML(tasks[0]);
    }
    function createHTML(_task) {
        let question = document.querySelector("div#Question");
        let options = document.querySelector("div#Options");
        question.innerText = tasks[0].question;
        for (let answer in _task.answers) {
            console.log(answer);
            let button = document.createElement("input");
            button.type = "radio";
            button.id = "answer" + answer;
            button.name = "answers";
            let label = document.createElement("label");
            label.htmlFor = button.id;
            label.innerText = _task.answers[answer];
            let option = document.createElement("span");
            options.appendChild(option);
            option.appendChild(button);
            option.appendChild(label);
        }
    }
})(Quiz || (Quiz = {}));
//# sourceMappingURL=Quiz.js.map