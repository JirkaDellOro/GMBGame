namespace Quiz {
  import ƒ = FudgeCore;

  enum TASK {
    SC, MC
  }
  type Task = { type: TASK, question: string, options: string[], correct: number | number[] };

  const tasks: Task[] = [
    { type: TASK.SC, question: "Which city is germany's capital?", options: ["Berlin", "Hamburg", "München", "Frankfurt"], correct: 0 }
  ];

  window.addEventListener("load", start);
  const task: Task = tasks[0];

  function start(): void {
    createHTML(task);
    document.querySelector("button")!.addEventListener("click", () => validate(task));
  }

  function validate(_task: Task): void {
    const formdata: FormData = new FormData(document.forms[0]);
    const result: string = <string>formdata.get("option");
    console.log(result == "" + _task.correct);
  }

  function createHTML(_task: Task): void {
    let question: HTMLDivElement = document.querySelector("div#Question")!;
    let options: HTMLDivElement = document.querySelector("div#Options")!;
    question.innerText = tasks[0].question;
    const spans: HTMLSpanElement[] = [];

    for (let option in _task.options) {
      const input: HTMLInputElement = document.createElement("input");
      input.type = "radio";
      input.id = "option" + option;
      input.name = "option";
      input.value = option;

      const label: HTMLLabelElement = document.createElement("label");
      label.htmlFor = input.id;
      label.innerText = _task.options[option];

      const span: HTMLSpanElement = document.createElement("span");
      span.appendChild(input);
      span.appendChild(label);
      spans.push(span);
    }

    while (spans.length)
      options.appendChild(spans.splice(ƒ.random.getIndex(spans), 1)[0]);
  }
}
