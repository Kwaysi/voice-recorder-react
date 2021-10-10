"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.secondsToTime = void 0;
function secondsToTime(secs) {
    var hours = Math.floor(secs / (60 * 60));
    var divisor_for_minutes = secs % (60 * 60);
    var minutes = Math.floor(divisor_for_minutes / 60);
    var divisor_for_seconds = divisor_for_minutes % 60;
    var seconds = Math.ceil(divisor_for_seconds);
    var obj = {
        h: hours,
        m: minutes,
        s: seconds,
    };
    return obj;
}
exports.secondsToTime = secondsToTime;
