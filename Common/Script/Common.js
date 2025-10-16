var Common;
(function (Common) {
    let MESSAGE;
    (function (MESSAGE) {
        MESSAGE["ANGRY"] = "Angry";
        MESSAGE["HURT"] = "Hurt";
        MESSAGE["IDLE"] = "Idle";
        MESSAGE["DEAD"] = "Dead";
        MESSAGE["FAIL"] = "Fail";
        MESSAGE["PASS"] = "Pass";
    })(MESSAGE = Common.MESSAGE || (Common.MESSAGE = {}));
    Common.root = (() => {
        let path = location.href.split("/");
        path.pop();
        return path.join("/");
    })();
    Common.pathToPortraits = Common.root + "/Common/Portraits/";
    function sendMessage(_message, _docent) {
        let message = { type: _message, docent: _docent };
        parent.postMessage(message);
    }
    Common.sendMessage = sendMessage;
})(Common || (Common = {}));
//# sourceMappingURL=Common.js.map