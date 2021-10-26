"use strict";
var __assign = (this && this.__assign) || function () {
__assign = Object.assign || function(t) {
for (var s, i = 1, n = arguments.length; i < n; i++) {
s = arguments[i];
for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
t[p] = s[p];
}
return t;
};
return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
return new (P || (P = Promise))(function (resolve, reject) {
function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
step((generator = generator.apply(thisArg, _arguments || [])).next());
});
};
var __generator = (this && this.__generator) || function (thisArg, body) {
var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
function verb(n) { return function (v) { return step([n, v]); }; }
function step(op) {
if (f) throw new TypeError("Generator is already executing.");
while (_) try {
if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
if (y = 0, t) op = [op[0] & 2, t.value];
switch (op[0]) {
case 0: case 1: t = op; break;
case 4: _.label++; return { value: op[1], done: false };
case 5: _.label++; y = op[1]; op = [0]; continue;
case 7: op = _.ops.pop(); _.trys.pop(); continue;
default:
if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
if (t[2]) _.ops.pop();
_.trys.pop(); continue;
}
op = body.call(thisArg, _);
} catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
}
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var utils_1 = require("./utils");
var emptyBlob = new Blob() || '';
var emptyStream = new MediaStream();
var initialTime = { h: 0, m: 0, s: 0 };
var initState = {
time: initialTime,
seconds: 0,
recording: false,
paused: false,
medianotFound: false,
audioBlob: emptyBlob,
audioData: {
url: '',
chunks: [],
blob: emptyBlob,
duration: initialTime,
},
stream: emptyStream,
};
var timer;
var chunks = [];
var mediaRecorder;
function useRecorder(props) {
var _this = this;
var _a = (0, react_1.useState)({}), sF = _a[1];
var dataRef = (0, react_1.useRef)(initState);
var _b = dataRef.current, paused = _b.paused, recording = _b.recording, stream = _b.stream, medianotFound = _b.medianotFound, audioData = _b.audioData, time = _b.time;
var updatState = function () { return sF({}); };
var initRecorder = function () { return __awaiter(_this, void 0, void 0, function () {
var _a, _b, mimeTypeToUseWhenRecording;
return __generator(this, function (_c) {
switch (_c.label) {
case 0:
// @ts-ignore
navigator.getUserMedia =
// @ts-ignore
navigator.getUserMedia ||
// @ts-ignore
navigator.msGetUserMedia ||
// @ts-ignore
navigator.mozGetUserMedia ||
// @ts-ignore
navigator.webkitGetUserMedia;
if (!navigator.mediaDevices) return [3 /*break*/, 2];
_a = dataRef.current;
return [4 /*yield*/, navigator.mediaDevices.getUserMedia({ audio: true })];
case 1:
_a.stream = _c.sent();
if (props) {
_b = props.mimeTypeToUseWhenRecording, mimeTypeToUseWhenRecording = _b === void 0 ? '' : _b;
mediaRecorder = new MediaRecorder(dataRef.current.stream, {
mimeType: mimeTypeToUseWhenRecording,
});
}
else {
mediaRecorder = new MediaRecorder(dataRef.current.stream);
}
chunks = [];
mediaRecorder.ondataavailable = function (e) {
if (e.data && e.data.size > 0) {
chunks.push(e.data);
}
};
return [2 /*return*/, true];
case 2:
dataRef.current = __assign(__assign({}, dataRef.current), { medianotFound: true });
updatState();
return [2 /*return*/, false];
}
});
}); };
var handleAudioPause = function () {
if (!paused) {
clearInterval(timer);
mediaRecorder.pause();
dataRef.current = __assign(__assign({}, dataRef.current), { paused: true });
updatState();
}
};
var handleAudioStart = function () {
if (paused) {
startTimer();
mediaRecorder.resume();
dataRef.current = __assign(__assign({}, dataRef.current), { paused: false });
updatState();
}
};
var countDown = function () {
var seconds = dataRef.current.seconds + 1;
dataRef.current = __assign(__assign({}, dataRef.current), { seconds: seconds, time: (0, utils_1.secondsToTime)(seconds) });
updatState();
};
var startTimer = function () {
timer = setInterval(countDown, 1000);
};
var startRecording = function () { return __awaiter(_this, void 0, void 0, function () {
var isReady;
return __generator(this, function (_a) {
switch (_a.label) {
case 0:
if (!!recording) return [3 /*break*/, 2];
return [4 /*yield*/, initRecorder()];
case 1:
isReady = _a.sent();
if (isReady) {
chunks = [];
mediaRecorder.start(10);
startTimer();
dataRef.current = __assign(__assign({}, dataRef.current), { recording: true });
updatState();
}
_a.label = 2;
case 2: return [2 /*return*/];
}
});
}); };
var stopRecording = function () {
if (recording) {
clearInterval(timer);
mediaRecorder.stop();
dataRef.current = __assign(__assign({}, dataRef.current), { paused: false, recording: false, seconds: 0, time: initialTime });
saveAudio();
stream.getTracks().forEach(function (track) {
if (track.readyState === 'live') {
track.stop();
}
});
updatState();
}
};
var handleReset = function () {
if (dataRef.current.recording) {
stopRecording();
}
dataRef.current = __assign(__assign({}, dataRef.current), { time: initialTime, seconds: 0, recording: false, medianotFound: false, audioBlob: emptyBlob, audioData: initState.audioData });
updatState();
};
var saveAudio = function () {
// convert saved chunks to blob
var blob = new Blob(chunks, { type: 'audio/*' });
// generate video url from blob
var audioURL = window.URL.createObjectURL(blob);
// append videoURL to list of saved videos for rendering
dataRef.current = __assign(__assign({}, dataRef.current), { audioBlob: blob, audioData: {
blob: blob,
url: audioURL,
chunks: chunks,
duration: dataRef.current.time,
} });
updatState();
};
return {
time: time,
paused: paused,
recording: recording,
data: audioData,
reset: handleReset,
stop: stopRecording,
start: startRecording,
pause: handleAudioPause,
resume: handleAudioStart,
hasRecorder: !medianotFound,
};
}
exports.default = useRecorder;
