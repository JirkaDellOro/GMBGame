var Arkanoid;
(function (Arkanoid) {
    var ƒ = FudgeCore;
    let timePreviousFrame;
    let game;
    const balls = [];
    let blocks;
    let paddle;
    let distractor;
    const nBalls = 1;
    const radius = 10;
    const blockSize = { x: 0, y: 0 };
    const gridSpace = { x: 5, y: 5 };
    window.addEventListener("load", hndLoad);
    async function hndLoad() {
        game = document.querySelector("div#game");
        blockSize.x = game.clientWidth / 8;
        blockSize.y = blockSize.x / 2;
        for (let i = 0; i < nBalls; i++) {
            const ball = createBall();
            game.appendChild(ball.element);
            balls.push(ball);
        }
        blocks = await loadLevel("./Level.json");
        for (const block of blocks)
            game.appendChild(block.element);
        paddle = createPaddle({ x: game.clientWidth / 2, y: game.clientHeight - 20 }, { x: blockSize.x * 2, y: blockSize.y });
        game.appendChild(paddle.element);
        blocks.unshift(paddle);
        distractor = createDistractor();
        game.appendChild(distractor.element);
        document.addEventListener("mousemove", hndMouse);
        let touch = new ƒ.TouchEventDispatcher(game);
        touch.activate(true);
        game.addEventListener(ƒ.EVENT_TOUCH.MOVE, hndTouch);
        game.addEventListener(ƒ.EVENT_TOUCH.TAP, hndTouch);
        timePreviousFrame = performance.now();
        update(timePreviousFrame);
    }
    function update(_time) {
        let timeDelta = _time - timePreviousFrame;
        timePreviousFrame = _time;
        timeDelta /= 1000;
        processInput();
        move(timeDelta);
        requestAnimationFrame(update);
    }
    function processInput() {
    }
    function hndMouse(_event) {
        paddle.position.x = _event.clientX;
        // paddle.position.y = _event.clientY;
        paddle.element.style.transform = createMatrix(paddle.position, 0, paddle.scale);
    }
    function hndTouch(_event) {
        let detail = _event.detail;
        paddle.position.x = detail.position.x;
        paddle.element.style.transform = createMatrix(paddle.position, 0, paddle.scale);
    }
    function move(_timeDelta) {
        for (const ball of balls) {
            let positionNew = {
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
            distractor.element.style.transform = createMatrix(distractor.position, 0, { x: radius * 3, y: radius * 2 });
            if (checkCollision(paddle, distractor.position)) {
                console.log("Distractor!");
                distractor.element.parentElement.removeChild(distractor.element);
                distractor = null;
            }
        }
    }
    function processBallCollisions(_ball, _positionCheck) {
        const hit = checkCollisions(_ball, _positionCheck);
        if (hit) {
            if (hit.block != paddle) {
                let message = { type: Common.MESSAGE.HIT, docent: 1 };
                parent.postMessage(message);
                const type = hit.block.element.getAttribute("type");
                if (Number(type) > 1)
                    hit.block.element.setAttribute("type", "" + (Number(type) - 1));
                else
                    remove(blocks, blocks.indexOf(hit.block));
            }
            else {
                const deflect = 2 * hit.position.x / paddle.scale.x;
                if (_ball.velocity.y < 0)
                    _ball.velocity.x = 200 * deflect;
            }
        }
        _ball.position = _positionCheck;
        _ball.element.style.transform = createMatrix(_positionCheck, 0, { x: radius * 2, y: radius * 2 });
    }
    function checkCollisions(_ball, _position) {
        for (let iBlock = 0; iBlock < blocks.length; iBlock++) {
            const block = blocks[iBlock];
            if (checkCollision(block, _position)) {
                const hit = {
                    block: block, position: { x: _position.x - block.position.x, y: _position.y - block.position.y }
                };
                reflectBall(_ball, hit);
                return hit;
            }
        }
        return null;
    }
    function checkCollision(_block, _position) {
        const left = _position.x + radius < _block.position.x - _block.scale.x / 2;
        const right = _position.x - radius > _block.position.x + _block.scale.x / 2;
        const top = _position.y + radius < _block.position.y - _block.scale.y / 2;
        const bottom = _position.y - radius > _block.position.y + _block.scale.y / 2;
        return !(left || right || top || bottom);
    }
    function reflectBall(_ball, _hit) {
        const block = _hit.block;
        if (_hit.position.y < -block.scale.y / 2 || _hit.position.y > block.scale.y / 2)
            _ball.velocity.y *= Math.sign(_ball.velocity.y) * Math.sign(_hit.position.y);
        if (_hit.position.x < -block.scale.x / 2 || _hit.position.x > block.scale.x / 2)
            _ball.velocity.x *= Math.sign(_ball.velocity.x) * Math.sign(_hit.position.x);
    }
    function createMatrix(_translation, _rotation, _scale) {
        const sin = Math.sin(Math.PI * _rotation / 180);
        const cos = Math.cos(Math.PI * _rotation / 180);
        const matrix = [_scale.x * cos, _scale.x * sin, _scale.y * -sin, _scale.y * cos, _translation.x, _translation.y];
        return "matrix(" + matrix.toString() + ")";
    }
    function createBall() {
        const ball = createEntity({ x: 20 + Math.random() * game.clientWidth - 40, y: game.clientHeight - 40, }, "ball");
        ball.velocity = { x: 400, y: -400 };
        ball.element.className = "ball";
        return ball;
    }
    function createDistractor() {
        const distractor = createEntity({ x: game.clientWidth / 2, y: 10, }, "distractor");
        distractor.velocity = { x: 0, y: 100 };
        distractor.element.className = "distractor";
        return distractor;
    }
    function createPaddle(_position, _size) {
        const paddle = createBlock(_position, _size, "paddle");
        paddle.element.className = "paddle";
        return paddle;
    }
    function createBlock(_position, _size, _type) {
        const block = createEntity(_position, "block");
        block.scale = { x: _size.x, y: _size.y };
        block.element.style.transform = createMatrix(block.position, 0, block.scale);
        block.element.setAttribute("type", _type);
        return block;
    }
    function createEntity(_position, _type) {
        const entity = {
            element: document.createElement("span"),
            position: _position
        };
        entity.element.className = _type;
        return entity;
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
            const grid = { x: blockSize.x + gridSpace.x, y: blockSize.y + gridSpace.y };
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
                    const block = createBlock({ x: position.x, y: position.y }, blockSize, type);
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