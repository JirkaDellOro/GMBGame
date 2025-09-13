///<reference path="../Common/FUDGE/FudgeCore.d.ts"/>
var Arkanoid;
(function (Arkanoid) {
    var ƒ = FudgeCore;
    let timePreviousFrame = 0;
    let game;
    const balls = [];
    let blocks;
    let paddle;
    const nBalls = 1;
    const radius = 10;
    window.addEventListener("load", hndLoad);
    document.addEventListener("mousemove", hndMouse);
    async function hndLoad() {
        game = document.querySelector("body");
        let touch = new ƒ.TouchEventDispatcher(game);
        touch.activate(true);
        game.addEventListener(ƒ.EVENT_TOUCH.MOVE, () => console.log("MOVE"));
        for (let i = 0; i < nBalls; i++) {
            const ball = createBall();
            game.appendChild(ball.element);
            balls.push(ball);
        }
        blocks = await loadLevel("./Level.json");
        for (const block of blocks)
            game.appendChild(block.element);
        paddle = createBlock({ x: game.clientWidth / 2, y: game.clientHeight - 20 }, 100);
        game.appendChild(paddle.element);
        paddle.element.className = "paddle";
        blocks.unshift(paddle);
        update(0);
    }
    function update(_time) {
        let timeDelta = _time - timePreviousFrame;
        timeDelta /= 1000;
        processInput();
        move(timeDelta);
        timePreviousFrame = _time;
        requestAnimationFrame(update);
    }
    function processInput() {
    }
    function hndMouse(_event) {
        paddle.position.x = _event.clientX;
        // paddle.position.y = _event.clientY;
        paddle.element.style.transform = createMatrix(paddle.position, 0, paddle.scale);
    }
    function move(_timeDelta) {
        for (const ball of balls) {
            const position = {
                x: ball.position.x + ball.velocity.x * _timeDelta, y: ball.position.y + ball.velocity.y * _timeDelta
            };
            if (position.y > game.clientHeight - radius || position.y < radius) {
                ball.velocity.y *= -1;
                position.y = ball.position.y;
            }
            if (position.x > game.clientWidth - radius || position.x < radius) {
                ball.velocity.x *= -1;
                position.x = ball.position.x;
            }
            const hit = checkCollisions(ball, position);
            if (hit) {
                if (hit.block != paddle) {
                    parent.postMessage("test");
                    const type = hit.block.element.getAttribute("type");
                    if (Number(type) > 1)
                        hit.block.element.setAttribute("type", "" + (Number(type) - 1));
                    else
                        remove(blocks, blocks.indexOf(hit.block));
                }
                else {
                    const deflect = 2 * hit.position.x / paddle.scale.x;
                    if (ball.velocity.y < 0)
                        ball.velocity.x = 200 * deflect;
                }
            }
            ball.position = position;
            ball.element.style.transform = createMatrix(position, 0, { x: radius * 2, y: radius * 2 });
        }
    }
    function checkCollisions(_ball, _position) {
        for (let iBlock = 0; iBlock < blocks.length; iBlock++) {
            const block = blocks[iBlock];
            const left = _position.x + radius < block.position.x - block.scale.x / 2;
            const right = _position.x - radius > block.position.x + block.scale.x / 2;
            const top = _position.y + radius < block.position.y - block.scale.y / 2;
            const bottom = _position.y - radius > block.position.y + block.scale.y / 2;
            if (left || right || top || bottom)
                continue;
            else {
                // console.log("Collision:", _position.x, _position.y);
                const hit = {
                    block: block, position: { x: _position.x - block.position.x, y: _position.y - block.position.y }
                };
                if (hit.position.y < -block.scale.y / 2 || hit.position.y > block.scale.y / 2)
                    _ball.velocity.y *= Math.sign(_ball.velocity.y) * Math.sign(hit.position.y);
                if (hit.position.x < -block.scale.x / 2 || hit.position.x > block.scale.x / 2)
                    _ball.velocity.x *= Math.sign(_ball.velocity.x) * Math.sign(hit.position.x);
                return hit;
            }
        }
        return null;
    }
    function createMatrix(_translation, _rotation, _scale) {
        const sin = Math.sin(Math.PI * _rotation / 180);
        const cos = Math.cos(Math.PI * _rotation / 180);
        const matrix = [_scale.x * cos, _scale.x * sin, _scale.y * -sin, _scale.y * cos, _translation.x, _translation.y];
        return "matrix(" + matrix.toString() + ")";
    }
    function createBall() {
        const ball = {
            element: document.createElement("span"),
            position: { x: 20 + Math.random() * game.clientWidth - 40, y: game.clientHeight - 40, },
            velocity: { x: 400, y: -400 }
        };
        ball.element.className = "ball";
        return ball;
    }
    function createBlock(_position, _width) {
        const block = {
            element: document.createElement("span"),
            position: _position,
            scale: { x: _width, y: 20 }
        };
        block.element.className = "block";
        block.element.style.transform = createMatrix(block.position, 0, block.scale);
        return block;
    }
    function remove(_collection, _index) {
        const element = _collection[_index].element;
        element.parentElement.removeChild(element);
        _collection.splice(_index, 1);
    }
    async function loadLevel(_filename) {
        const blocks = [];
        const content = await fetch(_filename);
        const json = await content.json();
        console.log(json);
        for (const line in json) {
            const upmost = 40;
            const grid = { x: 60, y: 30 };
            const descriptions = json[line];
            const types = [];
            for (const description of descriptions) {
                const nBlocks = Number(description[0]);
                const type = description[1];
                for (let iBlock = 0; iBlock < nBlocks; iBlock++)
                    types.push(type);
            }
            const position = {
                x: game.clientWidth / 2 - grid.x * (types.length - 1) / 2, y: upmost + grid.y * Number(line)
            };
            for (const type of types) {
                if (type != "0") {
                    const block = createBlock({ x: position.x, y: position.y }, 50);
                    block.element.setAttribute("type", type);
                    blocks.push(block);
                }
                position.x += grid.x;
            }
        }
        return blocks;
    }
})(Arkanoid || (Arkanoid = {}));
//# sourceMappingURL=Brick.js.map