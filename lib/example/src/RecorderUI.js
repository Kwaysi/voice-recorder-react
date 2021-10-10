"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
// Recorder UI component
function RecorderUI(_a) {
    var time = _a.time, stop = _a.stop, data = _a.data, start = _a.start, pause = _a.pause, resume = _a.resume, paused = _a.paused, recording = _a.recording;
    var audioRef = (0, react_1.useRef)(null);
    var _b = (0, react_1.useState)(false), hasRecording = _b[0], setHasRecording = _b[1];
    var togglePlay = function () {
        var _a, _b, _c;
        if ((_a = audioRef.current) === null || _a === void 0 ? void 0 : _a.paused) {
            (_b = audioRef.current) === null || _b === void 0 ? void 0 : _b.play();
        }
        else {
            (_c = audioRef.current) === null || _c === void 0 ? void 0 : _c.pause();
        }
    };
    (0, react_1.useEffect)(function () {
        if (data.url && audioRef.current) {
            audioRef.current.src = data.url;
        }
    }, [data.url]);
    return (React.createElement(React.Fragment, null,
        React.createElement("button", { type: 'button', onClick: function () {
                if (recording) {
                    stop();
                    setHasRecording(true);
                }
                else {
                    start();
                    setHasRecording(false);
                }
            } }, "start/stop"),
        recording && (React.createElement(React.Fragment, null,
            React.createElement("button", { type: 'button', onClick: function () {
                    if (recording) {
                        if (paused)
                            resume();
                        else
                            pause();
                    }
                } }, "pause/resume"),
            React.createElement("p", null,
                time.h,
                ":",
                time.m,
                ":",
                time.s),
            React.createElement("br", null),
            React.createElement("br", null))),
        !recording && hasRecording && (React.createElement("button", { type: 'button', onClick: togglePlay, className: 'mr-4' }, "Play/Pause")),
        React.createElement("audio", { ref: audioRef, hidden: true })));
}
exports.default = RecorderUI;
//# sourceMappingURL=RecorderUI.js.map