namespace Quiz {
  import ƒ = FudgeCore;

  enum TASK {
    SC, MC
  }
  type Task = { type: TASK, question: string, options: string[], correct: number | number[] };
  type DocentTask = { docent: string, task: Task };

  window.addEventListener("load", start);

  async function start(): Promise<void> {
    let tasks: DocentTask[] = await createTasks();
    while (tasks.length) {
      let task: DocentTask = ƒ.random.splice(tasks);
      createHTML(task.task);
      let button: HTMLButtonElement = document.querySelector("button")!;
      await new Promise((_resolve) => {
        let hndClick: EventListener = () => {
          button.removeEventListener("click", hndClick);
          if (validate(task.task)) {
            Common.sendMessage(Common.MESSAGE.HURT, task.docent);
          }
          _resolve(0);
        }
        button.addEventListener("click", hndClick);
      });
    }
  }

  async function createTasks(): Promise<DocentTask[]> {
    const resonse: Response = await fetch("Visual1.json");
    let tasksAll: DocentTask = await resonse.json();

    let tasks: { docent: string, task: Task }[] = [];
    let docents: string[] = <string[]>Reflect.ownKeys(tasksAll);

    while (tasks.length < 3) {
      let docent: string = docents.pop();
      if (!docent)
        docent = <string>ƒ.random.getElement(Reflect.ownKeys(tasksAll));

      let task: Task = ƒ.random.splice(tasksAll[docent])
      tasks.push({ docent: docent, task: task });
    }
    console.log(tasks);

    return tasks;
  }

  function validate(_task: Task): boolean {
    const formdata: FormData = new FormData(document.forms[0]);
    const result: string = <string>formdata.get("option");
    return (result == "" + _task.correct);
  }

  function createHTML(_task: Task): void {
    let question: HTMLDivElement = document.querySelector("div#Question")!;
    question.innerText = _task.question;
    let options: HTMLDivElement = document.querySelector("div#Options")!;
    options.innerHTML = "";
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
