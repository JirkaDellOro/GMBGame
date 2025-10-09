var Quiz;
(function (Quiz) {
    var ƒ = FudgeCore;
    let TASK;
    (function (TASK) {
        TASK[TASK["SC"] = 0] = "SC";
        TASK[TASK["MC"] = 1] = "MC";
    })(TASK || (TASK = {}));
    window.addEventListener("load", start);
    async function start() {
        let tasks = await createTasks();
        let success = 0;
        while (tasks.length) {
            await ƒ.Time.game.delay(2000);
            let task = ƒ.random.splice(tasks);
            Common.sendMessage(Common.MESSAGE.IDLE);
            Common.sendMessage(Common.MESSAGE.ANGRY, task.docent);
            createHTML(task.task);
            let button = document.querySelector("button");
            await new Promise((_resolve) => {
                let hndClick = () => {
                    button.removeEventListener("click", hndClick);
                    if (validate(task.task)) {
                        Common.sendMessage(Common.MESSAGE.HURT, task.docent);
                        success++;
                    }
                    else
                        Common.sendMessage(Common.MESSAGE.IDLE, task.docent);
                    _resolve(0);
                };
                button.addEventListener("click", hndClick);
            });
        }
        if (success < 3)
            Common.sendMessage(Common.MESSAGE.IDLE);
        else
            Common.sendMessage(Common.MESSAGE.DEAD);
    }
    async function createTasks() {
        const resonse = await fetch("Visual1.json");
        let tasksAll = await resonse.json();
        let tasks = [];
        let docents = Reflect.ownKeys(tasksAll);
        while (tasks.length < 3) {
            let docent = docents.pop();
            if (!docent)
                docent = ƒ.random.getElement(Reflect.ownKeys(tasksAll));
            let task = ƒ.random.splice(tasksAll[docent]);
            tasks.push({ docent: docent, task: task });
        }
        console.log(tasks);
        return tasks;
    }
    function validate(_task) {
        const formdata = new FormData(document.forms[0]);
        const result = formdata.get("option");
        return (result == "" + _task.correct);
    }
    function createHTML(_task) {
        let question = document.querySelector("div#Question");
        question.innerText = _task.question;
        let options = document.querySelector("div#Options");
        options.innerHTML = "";
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