namespace Arkanoid {
  import ƒ = FudgeCore;

  type Vector = { x: number; y: number; };
  type Entity = { element: HTMLSpanElement, position: Vector };
  type Ball = Entity & { velocity: Vector };
  type Block = Entity & { scale: Vector };
  type Distractor = Ball;
  type Paddle = Block;
  type Hit = { block: Block, position: Vector };

  let timePreviousFrame: number = 0;

  let game: HTMLElement;
  const balls: Ball[] = [];
  let blocks: Block[];
  let paddle: Paddle;
  let distractor: Distractor;

  const nBalls: number = 1;
  const radius: number = 10;

  window.addEventListener("load", hndLoad);
  document.addEventListener("mousemove", hndMouse);

  async function hndLoad(): Promise<void> {
    game = document.querySelector("body div")!;
    let touch: ƒ.TouchEventDispatcher = new ƒ.TouchEventDispatcher(game);
    touch.activate(true);
    game.addEventListener(ƒ.EVENT_TOUCH.MOVE, hndTouch);
    game.addEventListener(ƒ.EVENT_TOUCH.TAP, hndTouch);

    for (let i: number = 0; i < nBalls; i++) {
      const ball: Ball = createBall();
      game.appendChild(ball.element);
      balls.push(ball);
    }

    blocks = await loadLevel("./Level.json");
    for (const block of blocks)
      game.appendChild(block.element);

    paddle = createBlock({ x: game.clientWidth / 2, y: game.clientHeight - 20 }, 100)
    game.appendChild(paddle.element);
    paddle.element.className = "paddle";
    blocks.unshift(paddle);

    distractor = createBonus();
    game.appendChild(distractor.element);

    update(0);
  }

  function update(_time: number): void {
    let timeDelta: number = _time - timePreviousFrame;
    timeDelta /= 1000;

    processInput();
    move(timeDelta);

    timePreviousFrame = _time;
    requestAnimationFrame(update);
  }

  function processInput(): void {

  }

  function hndMouse(_event: MouseEvent): void {
    paddle.position.x = _event.clientX;
    // paddle.position.y = _event.clientY;
    paddle.element.style.transform = createMatrix(paddle.position, 0, paddle.scale)
  }

  function hndTouch(_event: CustomEvent): void {
    let detail: ƒ.EventTouchDetail = _event.detail;
    paddle.position.x = detail.position.x;
    paddle.element.style.transform = createMatrix(paddle.position, 0, paddle.scale)
  }

  function move(_timeDelta: number): void {
    for (const ball of balls) {
      let positionNew: Vector = {
        x: ball.position.x + ball.velocity.x * _timeDelta, y: ball.position.y + ball.velocity.y * _timeDelta
      };

      if (positionNew.y > game.clientHeight - radius || positionNew.y < radius) {
        ball.velocity.y *= -1;
        positionNew.y = ball.position.y;
      }
      if (positionNew.x > game.clientWidth - radius || positionNew.x < radius) {
        ball.velocity.x *= -1;
        positionNew.x = ball.position.x;
      }

      processBallCollisions(ball, positionNew);

      if (!distractor)
        return;

      distractor.position.x += distractor.velocity.x * _timeDelta;
      distractor.position.y += distractor.velocity.y * _timeDelta;
      distractor.element.style.transform = createMatrix(distractor.position, 0, { x: radius * 2, y: radius * 2 })
      console.log(distractor.position);
      if (checkCollision(paddle, distractor.position)) {
        console.log("Distractor!");
        distractor.element.parentElement!.removeChild(distractor.element);
        distractor = null;
      }
    }
  }

  function processBallCollisions(_ball: Ball, _positionCheck: Vector): void {
    const hit: Hit | null = checkCollisions(_ball, _positionCheck);

    if (hit) {
      if (hit.block != paddle) {
        let message: Common.Message = { type: Common.MESSAGE.HIT, docent: 1 };
        parent.postMessage(message);
        const type: string = hit.block.element.getAttribute("type")!;
        if (Number(type) > 1)
          hit.block.element.setAttribute("type", "" + (Number(type) - 1));
        else
          remove(blocks, blocks.indexOf(hit.block));
      }
      else {
        const deflect: number = 2 * hit.position.x / paddle.scale.x;
        if (_ball.velocity.y < 0)
          _ball.velocity.x = 200 * deflect;
      }
    }

    _ball.position = _positionCheck;
    _ball.element.style.transform = createMatrix(_positionCheck, 0, { x: radius * 2, y: radius * 2 })
  }

  function checkCollisions(_ball: Ball, _position: Vector): Hit | null {
    for (let iBlock: number = 0; iBlock < blocks.length; iBlock++) {
      const block: Block = blocks[iBlock];
      if (checkCollision(block, _position)) {
        const hit: Hit = {
          block: block, position: { x: _position.x - block.position.x, y: _position.y - block.position.y }
        };
        reflectBall(_ball, hit);
        return hit;
      }
    }

    return null;
  }

  function checkCollision(_block: Block, _position: Vector): boolean {
    const left: boolean = _position.x + radius < _block.position.x - _block.scale.x / 2;
    const right: boolean = _position.x - radius > _block.position.x + _block.scale.x / 2;
    const top: boolean = _position.y + radius < _block.position.y - _block.scale.y / 2;
    const bottom: boolean = _position.y - radius > _block.position.y + _block.scale.y / 2;
    return !(left || right || top || bottom);
  }

  function reflectBall(_ball: Ball, _hit: Hit): void {
    const block: Block = _hit.block;
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

  function createBall(): Ball {
    const ball: Ball = {
      element: document.createElement("span"),
      position: { x: 20 + Math.random() * game.clientWidth - 40, y: game.clientHeight - 40, },
      velocity: { x: 400, y: -400 }
    }
    ball.element.className = "ball";
    return ball;
  }
  function createBonus(): Ball {
    const bonus: Ball = {
      element: document.createElement("span"),
      position: { x: game.clientWidth / 2, y: 10, },
      velocity: { x: 0, y: 100 }
    }
    bonus.element.className = "ball";
    return bonus;
  }

  function createBlock(_position: Vector, _width: number): Block {
    const block: Block = {
      element: document.createElement("span"),
      position: _position,
      scale: { x: _width, y: 20 }
    }
    block.element.className = "block";
    block.element.style.transform = createMatrix(block.position, 0, block.scale)
    return block;
  }

  function remove(_collection: Block[] | Ball[], _index: number): void {
    const element: HTMLElement = _collection[_index].element;
    element.parentElement!.removeChild(element);
    _collection.splice(_index, 1);
  }

  async function loadLevel(_filename: string): Promise<Block[]> {
    const blocks: Block[] = [];
    const content: Response = await fetch(_filename);
    const json: JSON = await content.json();
    console.log(json);

    for (const line in json) {
      const upmost: number = 40;
      const grid: Vector = { x: 60, y: 30 }

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
          const block: Block = createBlock({ x: position.x, y: position.y }, 50);
          block.element.setAttribute("type", type);
          blocks.push(block);
        }
        position.x += grid.x;
      }
    }

    return blocks;
  }
}
