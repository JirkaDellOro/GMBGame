namespace Quiz {
  enum TASK {
    SC, MC
  }
  type Task = { type: TASK, question: string, answers: string[], correct: number | number[] };

  const tasks: Task[] = [
    { type: TASK.SC, question: "Which city is germany's capital?", answers: ["Berlin", "Hamburg", "München", "Frankfurt"], correct: 1 }
  ];

  window.addEventListener("load", start);

  function start(): void {
    createHTML(tasks[0]);
  }

  function createHTML(_task: Task) {

    let question: HTMLDivElement = document.querySelector("div#Question")!;
    let options: HTMLDivElement = document.querySelector("div#Options")!;
    question.innerText = tasks[0].question;

    for (let answer in _task.answers) {
      console.log(answer);
      let button: HTMLInputElement = document.createElement("input");
      button.type = "radio";
      button.id = "answer" + answer;
      button.name = "answers";
      let label: HTMLLabelElement = document.createElement("label");
      label.htmlFor = button.id;
      label.innerText = _task.answers[answer];
      
      let option: HTMLSpanElement = document.createElement("span");
      options.appendChild(option);
      option.appendChild(button);
      option.appendChild(label);
    }
  }
}
