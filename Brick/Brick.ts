namespace Arkanoid {
  import ƒ = FudgeCore;

  type Vector = { x: number; y: number; };
  type Entity = { element: HTMLSpanElement, position: Vector, scale: Vector };
  type Moveable = Entity & { velocity: Vector };
  type Hit = { entity: Entity, position: Vector, class: string };

  let timePreviousFrame: number;

  let game: HTMLElement;
  const moveables: Moveable[] = [];
  let blocks: Entity[];
  let paddle: Entity;

  const nBalls: number = 1;
  const radius: number = 10;
  const blockSize: Vector = { x: 0, y: 0 };
  const gridSpace: Vector = { x: 5, y: 5 };

  window.addEventListener("load", hndLoad);

  async function hndLoad(): Promise<void> {
    game = document.querySelector("div#game")!;
    blockSize.x = game.clientWidth / 8;
    blockSize.y = blockSize.x / 2;

    for (let i: number = 0; i < nBalls; i++) {
      const ball: Moveable = createBall();
      moveables.push(ball);
    }

    blocks = await loadLevel("./Level.json");

    paddle = createPaddle({ x: game.clientWidth / 2, y: game.clientHeight - 20 }, { x: blockSize.x * 2, y: blockSize.y });
    game.appendChild(paddle.element);
    blocks.unshift(paddle);

    document.addEventListener("mousemove", hndMouse);
    let touch: ƒ.TouchEventDispatcher = new ƒ.TouchEventDispatcher(game);
    touch.activate(true);
    game.addEventListener(ƒ.EVENT_TOUCH.MOVE, hndTouch);
    game.addEventListener(ƒ.EVENT_TOUCH.TAP, hndTouch);

    timePreviousFrame = performance.now();
    update(timePreviousFrame);
  }

  function update(_time: number): void {
    let timeDelta: number = _time - timePreviousFrame;
    timePreviousFrame = _time;
    timeDelta /= 1000;

    processInput();
    move(timeDelta);

    requestAnimationFrame(update);
  }

  function processInput(): void {

  }

  function hndMouse(_event: MouseEvent): void {
    paddle.position.x = _event.clientX;
    paddle.element.style.transform = createMatrix(paddle.position, 0, paddle.scale)
  }

  function hndTouch(_event: CustomEvent): void {
    let detail: ƒ.EventTouchDetail = _event.detail;
    paddle.position.x = detail.position.x;
    paddle.element.style.transform = createMatrix(paddle.position, 0, paddle.scale)
  }

  function move(_timeDelta: number): void {
    for (const moveable of moveables) {
      let positionNew: Vector = {
        x: moveable.position.x + moveable.velocity.x * _timeDelta, y: moveable.position.y + moveable.velocity.y * _timeDelta
      };

      if (positionNew.y > game.clientHeight - radius || positionNew.y < radius) {
        moveable.velocity.y *= -1;
        positionNew.y = moveable.position.y;
      }
      if (positionNew.x > game.clientWidth - radius || positionNew.x < radius) {
        moveable.velocity.x *= -1;
        positionNew.x = moveable.position.x;
      }

      processCollisions(moveable, positionNew);
      moveable.position = positionNew;
      moveable.element.style.transform = createMatrix(positionNew, 0, moveable.scale);
    }
  }

  function processCollisions(_moveable: Moveable, _positionCheck: Vector): void {
    const hit: Hit | null = checkCollisions(_moveable, _positionCheck);
    const isDistractor: boolean = _moveable.element.className == "distractor";

    if (!hit)
      return;

    if (isDistractor) {
      if (hit.class == "paddle")
        console.log("Distractor hit");
      return;
    }

    reflectBall(_moveable, hit);

    switch (hit.class) {
      case "paddle":
        const deflect: number = 2 * hit.position.x / paddle.scale.x;
        if (_moveable.velocity.y < 0)
          _moveable.velocity.x = 200 * deflect;
        break;
      case "heart":
        console.log("Heart Hit!");
        let message: Common.Message = { type: Common.MESSAGE.HIT, docent: 1 };
        parent.postMessage(message);
        moveables.push(createDistractor(hit.entity.position, blockSize, "♥"));
      default:
        const type: string = hit.entity.element.getAttribute("type")!;
        if (Number(type) > 1)
          hit.entity.element.setAttribute("type", "" + (Number(type) - 1));
        else
          remove(blocks, blocks.indexOf(hit.entity));
    }
  }

  function checkCollisions(_moveable: Moveable, _position: Vector): Hit | null {
    for (let iBlock: number = 0; iBlock < blocks.length; iBlock++) {
      const block: Entity = blocks[iBlock];
      if (checkCollision(block, _position)) {
        const hit: Hit = {
          entity: block,
          position: { x: _position.x - block.position.x, y: _position.y - block.position.y },
          class: block.element.className
        };
        return hit;
      }
    }

    return null;
  }

  function checkCollision(_block: Entity, _position: Vector): boolean {
    const left: boolean = _position.x + radius < _block.position.x - _block.scale.x / 2;
    const right: boolean = _position.x - radius > _block.position.x + _block.scale.x / 2;
    const top: boolean = _position.y + radius < _block.position.y - _block.scale.y / 2;
    const bottom: boolean = _position.y - radius > _block.position.y + _block.scale.y / 2;
    return !(left || right || top || bottom);
  }

  function reflectBall(_ball: Moveable, _hit: Hit): void {
    const block: Entity = _hit.entity;
    if (_hit.position.y < -block.scale.y / 2 || _hit.position.y > block.scale.y / 2)
      _ball.velocity.y *= Math.sign(_ball.velocity.y) * Math.sign(_hit.position.y);
    if (_hit.position.x < - block.scale.x / 2 || _hit.position.x > block.scale.x / 2)
      _ball.velocity.x *= Math.sign(_ball.velocity.x) * Math.sign(_hit.position.x);
  }

  function createMatrix(_translation: Vector, _rotation: number, _scale: Vector): string {
    const sin: number = Math.sin(Math.PI * _rotation / 180);
    const cos: number = Math.cos(Math.PI * _rotation / 180);
    const matrix: number[] = [_scale.x * cos, _scale.x * sin, _scale.y * -sin, _scale.y * cos, _translation.x, _translation.y];

    return "matrix(" + matrix.toString() + ")";
  }

  function createBall(): Moveable {
    const ball: Moveable = <Moveable>createEntity(
      { x: 20 + Math.random() * game.clientWidth - 40, y: game.clientHeight - 40, }, 
      { x: radius * 2, y: radius * 2 }, 
      "ball"
    );
    ball.velocity = { x: 400, y: -400 };
    return ball;
  }

  function createDistractor(_position: Vector, _size: Vector, _type: string): Moveable {
    const distractor: Moveable = <Moveable>createBlock(_position, _size, _type);
    distractor.velocity = { x: 0, y: 100 };
    distractor.element.className = "distractor";
    return distractor;
  }

  function createPaddle(_position: Vector, _size: Vector): Entity {
    const paddle: Entity = <Entity>createBlock(_position, _size, "paddle");
    paddle.element.className = "paddle";
    return paddle;
  }

  function createBlock(_position: Vector, _size: Vector, _type: string): Entity {
    const block: Entity = createEntity(_position, _size, "block");
    block.element.style.transform = createMatrix(block.position, 0, block.scale)
    block.element.setAttribute("type", _type);
    return block;
  }

  function createEntity(_position: Vector, _size: Vector, _type: string): Entity {
    const entity: Entity = {
      element: document.createElement("span"),
      position: _position,
      scale: _size
    }
    entity.element.className = _type;
    game.appendChild(entity.element);
    return entity;
  }

  function remove(_collection: Entity[], _index: number): void {
    const element: HTMLElement = _collection[_index].element;
    element.parentElement!.removeChild(element);
    _collection.splice(_index, 1);
  }

  async function loadLevel(_filename: string): Promise<Entity[]> {
    const blocks: Entity[] = [];
    const content: Response = await fetch(_filename);
    const json: JSON = await content.json();
    let hearts: number = 0;
    console.log(json);

    for (const line in json) {
      const upmost: number = 40;
      const grid: Vector = { x: blockSize.x + gridSpace.x, y: blockSize.y + gridSpace.y };

      const descriptions: string[] = json[line];

      const types: string[] = [];
      for (const description of descriptions) {
        const nBlocks: number = Number(description[0]);
        const type: string = description[1];

        for (let iBlock: number = 0; iBlock < nBlocks; iBlock++)
          types.push(type);
      }

      const position: Vector = {
        x: game.clientWidth / 2 - grid.x * (types.length - 1) / 2, y: upmost + grid.y * Number(line)
      };
      for (const type of types) {
        if (type != "0") {
          const block: Entity = createBlock({ x: position.x, y: position.y }, blockSize, type);
          block.element.setAttribute("type", type);
          blocks.push(block);
          if (type == "♥") {
            block.element.className = "heart";
            block.element.setAttribute("type", String(hearts++));
          }
        }
        position.x += grid.x;
      }
    }

    return blocks;
  }
}
