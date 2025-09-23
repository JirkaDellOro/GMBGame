var Arkanoid;
(function (Arkanoid) {
    var ƒ = FudgeCore;
    let STATE;
    (function (STATE) {
        STATE[STATE["START"] = 0] = "START";
        STATE[STATE["RUN"] = 1] = "RUN";
        STATE[STATE["OVER"] = 2] = "OVER";
        STATE[STATE["HIT"] = 3] = "HIT";
    })(STATE || (STATE = {}));
    const moveables = [];
    const radius = 10;
    const blockSize = { x: 0, y: 0 };
    const gridSpace = { x: 5, y: 5 };
    const timeToAttack = 5; //seconds to launch next attacking distractor
    const velocity = { x: 0, y: -400 };
    let timePreviousFrame;
    let game;
    let blocks;
    let paddle;
    let ball;
    let state;
    window.addEventListener("load", hndLoad);
    async function hndLoad() {
        game = document.querySelector("div#game");
        blockSize.x = game.clientWidth / 8;
        blockSize.y = blockSize.x / 2;
        ball = createBall(); //first in moveable array
        moveables.push(ball);
        blocks = await loadLevel("./Level.json");
        paddle = createPaddle({ x: game.clientWidth / 2, y: game.clientHeight * 0.9 }, { x: blockSize.x * 2, y: blockSize.y });
        game.appendChild(paddle.element);
        blocks.unshift(paddle);
        document.addEventListener("mousemove", hndMouse);
        document.addEventListener("click", hndMouse);
        let touch = new ƒ.TouchEventDispatcher(game);
        touch.activate(true);
        game.addEventListener(ƒ.EVENT_TOUCH.MOVE, hndTouch);
        game.addEventListener(ƒ.EVENT_TOUCH.TAP, hndTouch);
        restart();
        ƒ.Time.game.setTimer(timeToAttack * 1000, 0, hndTimer);
        timePreviousFrame = performance.now();
        update(timePreviousFrame);
        // ƒ.DebugTextArea.textArea = document.querySelector("textarea");
        // ƒ.Debug.setFilter(ƒ.DebugTextArea, ƒ.DEBUG_FILTER.ALL);
    }
    function restart() {
        ball.velocity = { x: 0, y: 0 };
        state = STATE.START;
        positionPaddle();
    }
    function update(_time) {
        let timeDelta = _time - timePreviousFrame;
        timePreviousFrame = _time;
        timeDelta /= 1000;
        move(timeDelta);
        requestAnimationFrame(update);
    }
    function hndMouse(_event) {
        // ƒ.Debug.log(_event.type);
        positionPaddle(_event.clientX);
        if (state == STATE.START && _event.type == "click")
            startBall();
    }
    function hndTouch(_event) {
        // ƒ.Debug.log(_event.type);
        positionPaddle(_event.detail.position.x);
        if (state == STATE.START && _event.type != ƒ.EVENT_TOUCH.MOVE)
            startBall();
    }
    function startBall() {
        velocity.x = Math.random() * 100 - 50;
        ball.velocity = { x: velocity.x, y: velocity.y };
        state = STATE.RUN;
        ball.element.setAttribute("type", "");
        paddle.element.setAttribute("type", "");
    }
    function positionPaddle(_x = paddle.position.x) {
        if (state == STATE.HIT)
            return;
        paddle.position.x = _x;
        paddle.element.style.transform = createMatrix(paddle.position, 0, paddle.scale);
        if (state == STATE.START)
            ball.position = { x: paddle.position.x, y: paddle.position.y - paddle.scale.y / 2 - radius };
    }
    function hndTimer(_event) {
        if (state != STATE.RUN)
            return;
        let hearts = blocks.filter((_entity) => _entity.element.className == "heart");
        let heart = ƒ.Random.default.getElement(hearts);
        moveables.push(createDistractor(heart.position, blockSize, "☠"));
        sendMessage(Common.MESSAGE.KILL, +heart.element.getAttribute("type"));
    }
    function move(_timeDelta) {
        if (state == STATE.OVER)
            return;
        for (const moveable of moveables) {
            let positionNew = {
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
    function processCollisions(_moveable, _positionCheck) {
        const hit = checkCollisions(_moveable, _positionCheck);
        if (_moveable.position.y > paddle.position.y) {
            if (_moveable == ball) {
                ball.element.setAttribute("type", "out");
                restart();
                return;
            }
            else {
                remove(moveables, moveables.indexOf(_moveable));
                sendMessage(Common.MESSAGE.NEUTRAL);
            }
        }
        if (!hit)
            return;
        if (_moveable != ball) {
            if (hit.class == "paddle") {
                console.log("Distractor hit");
                paddle.element.setAttribute("type", "out");
                state = STATE.HIT;
            }
            return;
        }
        reflectBall(_moveable, hit);
        switch (hit.class) {
            case "paddle":
                const deflect = 2 * hit.position.x / paddle.scale.x;
                if (_moveable.velocity.y < 0)
                    _moveable.velocity.x = 200 * deflect;
                break;
            case "heart":
                console.log("Heart Hit!");
                sendMessage(Common.MESSAGE.DIE, +hit.entity.element.getAttribute("type"));
                moveables.push(createDistractor(hit.entity.position, blockSize, "♥"));
            default:
                const type = hit.entity.element.getAttribute("type");
                if (Number(type) > 1)
                    hit.entity.element.setAttribute("type", "" + (Number(type) - 1));
                else
                    remove(blocks, blocks.indexOf(hit.entity));
        }
        if (game.querySelectorAll("span.heart").length == 0)
            state = STATE.OVER;
    }
    function checkCollisions(_moveable, _position) {
        for (let iBlock = 0; iBlock < blocks.length; iBlock++) {
            const block = blocks[iBlock];
            if (checkCollision(block, _position)) {
                const hit = {
                    entity: block,
                    position: { x: _position.x - block.position.x, y: _position.y - block.position.y },
                    class: block.element.className
                };
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
        const block = _hit.entity;
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
        const ball = createEntity({ x: 20 + Math.random() * game.clientWidth - 40, y: game.clientHeight - 40, }, { x: radius * 2, y: radius * 2 }, "ball");
        ball.velocity = { x: 400, y: -400 };
        return ball;
    }
    function createDistractor(_position, _size, _type) {
        const distractor = createBlock(_position, _size, _type);
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
        const block = createEntity(_position, _size, "block");
        block.element.style.transform = createMatrix(block.position, 0, block.scale);
        block.element.setAttribute("type", _type);
        return block;
    }
    function createEntity(_position, _size, _type) {
        const entity = {
            element: document.createElement("span"),
            position: _position,
            scale: _size
        };
        entity.element.className = _type;
        game.appendChild(entity.element);
        return entity;
    }
    function remove(_collection, _index) {
        const element = _collection[_index].element;
        element.parentElement.removeChild(element);
        _collection.splice(_index, 1);
    }
    function sendMessage(_message, _docent) {
        let message = { type: _message, docent: _docent };
        parent.postMessage(message);
    }
    async function loadLevel(_filename) {
        const blocks = [];
        const content = await fetch(_filename);
        const json = await content.json();
        let hearts = 0;
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
})(Arkanoid || (Arkanoid = {}));
//# sourceMappingURL=Brick.js.map