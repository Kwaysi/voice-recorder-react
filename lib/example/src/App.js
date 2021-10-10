"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var lib_1 = __importDefault(require("./lib"));
var RecorderUI_1 = __importDefault(require("./RecorderUI"));
var RecorderHooks_1 = __importDefault(require("./RecorderHooks"));
function App() {
    var _a = (0, react_1.useState)(false), isHooks = _a[0], setHooks = _a[1];
    return (React.createElement(React.Fragment, null,
        React.createElement("button", { onClick: function () { return setHooks(!isHooks); } }, isHooks ? "Use Component" : "Use Hooks"),
        React.createElement("br", null),
        React.createElement("br", null),
        React.createElement("br", null),
        isHooks ? (React.createElement(React.Fragment, null,
            React.createElement("h3", null, "Using Recorder with hooks"),
            React.createElement(RecorderHooks_1.default, null))) : (React.createElement(React.Fragment, null,
            React.createElement("h3", null, "Using Recorder with Recorder component"),
            React.createElement(lib_1.default, { Render: RecorderUI_1.default })))));
}
exports.default = App;
//# sourceMappingURL=App.js.map