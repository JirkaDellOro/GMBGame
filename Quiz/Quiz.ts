namespace Quiz {
  import ƒ = FudgeCore;

  enum TASK {
    SC, MC
  }
  type Task = { type: TASK, question: string, options: string[], correct: number | number[] };
  type DocentTask = { docent: string, task: Task };

  window.addEventListener("load", start);

  async function start(): Promise<void> {
    const tasks: DocentTask[] = await createTasks();
    let success: number = 0;

    while (tasks.length) {
      await ƒ.Time.game.delay(2000);
      const task: DocentTask = ƒ.random.splice(tasks);
      Common.sendMessage(Common.MESSAGE.IDLE);
      Common.sendMessage(Common.MESSAGE.ANGRY, task.docent);
      createHTML(task.task);
      const button: HTMLButtonElement = document.querySelector("button")!;
      await new Promise((_resolve) => {
        const hndClick: EventListener = () => {
          button.removeEventListener("click", hndClick);
          if (validate(task.task)) {
            Common.sendMessage(Common.MESSAGE.HURT, task.docent);
            success++;
          }
          else
            Common.sendMessage(Common.MESSAGE.IDLE, task.docent);
          _resolve(0);
        }
        button.addEventListener("click", hndClick);
      });
    }

    await ƒ.Time.game.delay(2000);
    if (success < 3) {
      Common.sendMessage(Common.MESSAGE.IDLE);
      Common.sendMessage(Common.MESSAGE.FAIL);
      return;
    }

    Common.sendMessage(Common.MESSAGE.DEAD);
    Common.sendMessage(Common.MESSAGE.PASS);
  }

  async function createTasks(): Promise<DocentTask[]> {
    const resonse: Response = await fetch("Visual1.json");
    const tasksAll: DocentTask = await resonse.json();

    const tasks: { docent: string, task: Task }[] = [];
    const docents: string[] = <string[]>Reflect.ownKeys(tasksAll);

    while (tasks.length < 3) {
      let docent: string = docents.pop();
      if (!docent)
        docent = <string>ƒ.random.getElement(Reflect.ownKeys(tasksAll));

      const task: Task = ƒ.random.splice(tasksAll[docent])
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
    const question: HTMLDivElement = document.querySelector("div#Question")!;
    question.innerText = _task.question;
    const options: HTMLDivElement = document.querySelector("div#Options")!;
    options.innerHTML = "";
    const spans: HTMLSpanElement[] = [];

    for (const option in _task.options) {
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
