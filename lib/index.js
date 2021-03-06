"use strict";
var __extends=(this && this.__extends)||(function(){
var extendStatics=function(d,b){
extendStatics=Object.setPrototypeOf ||
({__proto__:[]} instanceof Array && function(d,b){d.__proto__=b;})||
function(d,b){for(var p in b)if(Object.prototype.hasOwnProperty.call(b,p))d[p]=b[p];};
return extendStatics(d,b);
};
return function(d,b){
if(typeof b !== "function" && b !== null)
throw new TypeError("Class extends value " + String(b)+ " is not a constructor or null");
extendStatics(d,b);
function __(){this.constructor=d;}
d.prototype=b === null ? Object.create(b):(__.prototype=b.prototype,new __());
};
})();
var __assign=(this && this.__assign)|| function(){
__assign=Object.assign || function(t){
for(var s,i=1,n=arguments.length; i < n; i++){
s=arguments[i];
for(var p in s)if(Object.prototype.hasOwnProperty.call(s,p))
t[p]=s[p];
}
return t;
};
return __assign.apply(this,arguments);
};
var __createBinding=(this && this.__createBinding)||(Object.create ?(function(o,m,k,k2){
if(k2 === undefined)k2=k;
Object.defineProperty(o,k2,{enumerable:true,get:function(){return m[k];}});
}):(function(o,m,k,k2){
if(k2 === undefined)k2=k;
o[k2]=m[k];
}));
var __setModuleDefault=(this && this.__setModuleDefault)||(Object.create ?(function(o,v){
Object.defineProperty(o,"default",{enumerable:true,value:v});
}):function(o,v){
o["default"]=v;
});
var __importStar=(this && this.__importStar)|| function(mod){
if(mod && mod.__esModule)return mod;
var result={};
if(mod != null)for(var k in mod)if(k !== "default" && Object.prototype.hasOwnProperty.call(mod,k))__createBinding(result,mod,k);
__setModuleDefault(result,mod);
return result;
};
var __awaiter=(this && this.__awaiter)|| function(thisArg,_arguments,P,generator){
function adopt(value){return value instanceof P ? value :new P(function(resolve){resolve(value);});}
return new(P ||(P=Promise))(function(resolve,reject){
function fulfilled(value){try{step(generator.next(value));} catch(e){reject(e);}}
function rejected(value){try{step(generator["throw"](value));} catch(e){reject(e);}}
function step(result){result.done ? resolve(result.value):adopt(result.value).then(fulfilled,rejected);}
step((generator=generator.apply(thisArg,_arguments || [])).next());
});
};
var __generator=(this && this.__generator)|| function(thisArg,body){
var _={label:0,sent:function(){if(t[0] & 1)throw t[1]; return t[1];},trys:[],ops:[]},f,y,t,g;
return g={next:verb(0),"throw":verb(1),"return":verb(2)},typeof Symbol === "function" &&(g[Symbol.iterator]=function(){return this;}),g;
function verb(n){return function(v){return step([n,v]);};}
function step(op){
if(f)throw new TypeError("Generator is already executing.");
while(_)try{
if(f=1,y &&(t=op[0] & 2 ? y["return"] :op[0] ? y["throw"] ||((t=y["return"])&& t.call(y),0):y.next)&& !(t=t.call(y,op[1])).done)return t;
if(y=0,t)op=[op[0] & 2,t.value];
switch(op[0]){
case 0:case 1:t=op; break;
case 4:_.label++; return{value:op[1],done:false};
case 5:_.label++; y=op[1]; op=[0]; continue;
case 7:op=_.ops.pop(); _.trys.pop(); continue;
default:
if(!(t=_.trys,t=t.length > 0 && t[t.length - 1])&&(op[0] === 6 || op[0] === 2)){_=0; continue;}
if(op[0] === 3 &&(!t ||(op[1] > t[0] && op[1] < t[3]))){_.label=op[1]; break;}
if(op[0] === 6 && _.label < t[1]){_.label=t[1]; t=op; break;}
if(t && _.label < t[2]){_.label=t[2]; _.ops.push(op); break;}
if(t[2])_.ops.pop();
_.trys.pop(); continue;
}
op=body.call(thisArg,_);
} catch(e){op=[6,e]; y=0;} finally{f=t=0;}
if(op[0] & 5)throw op[1]; return{value:op[0] ? op[1] :void 0,done:true};
}
};
var __importDefault=(this && this.__importDefault)|| function(mod){
return(mod && mod.__esModule)? mod :{"default":mod};
};
Object.defineProperty(exports,"__esModule",{value:true});
exports.useRecorder=void 0;
var react_1=__importStar(require("react"));
var useRecorder_1=__importDefault(require("./useRecorder"));
exports.useRecorder=useRecorder_1.default;
var utils_1=require("./utils");
var Recorder=/** @class */(function(_super){
__extends(Recorder,_super);
function Recorder(props){
var _this=_super.call(this,props)|| this;
_this.emptyBlob=new Blob();
_this.initialTime={h:0,m:0,s:0};
_this.handleAudioPause=function(){
if(!_this.state.paused){
clearInterval(_this.timer);
_this.mediaRecorder.pause();
_this.setState({paused:true});
}
};
_this.handleAudioStart=function(){
if(_this.state.paused){
_this.startTimer();
_this.mediaRecorder.resume();
_this.setState({paused:false});
}
};
_this.stopRecording=function(){
if(_this.state.recording){
clearInterval(_this.timer);
_this.mediaRecorder.stop();
_this.setState({
seconds:0,
recording:false,
paused:false,
time:_this.initialTime,
});
_this.saveAudio();
_this.stream.getTracks().forEach(function(track){
if(track.readyState === 'live'){
track.stop();
}
});
}
};
_this.handleReset=function(){
if(_this.state.recording){
_this.stopRecording();
}
_this.setState({
seconds:0,
recording:false,
medianotFound:false,
time:_this.initialTime,
audioBlob:_this.emptyBlob,
},function(){
_this.props.handleReset && _this.props.handleReset(_this.state);
});
};
_this.state={
seconds:0,
recording:false,
paused:false,
medianotFound:false,
time:_this.initialTime,
audioBlob:_this.emptyBlob,
audioData:{
url:'',
chunks:[],
blob:_this.emptyBlob,
duration:_this.initialTime,
},
};
// this.timer=0;
_this.countDown=_this.countDown.bind(_this);
_this.startTimer=_this.startTimer.bind(_this);
_this.handleReset=_this.handleReset.bind(_this);
_this.stopRecording=_this.stopRecording.bind(_this);
_this.startRecording=_this.startRecording.bind(_this);
_this.handleAudioPause=_this.handleAudioPause.bind(_this);
_this.handleAudioStart=_this.handleAudioStart.bind(_this);
return _this;
}
Recorder.prototype.initRecorder=function(){
return __awaiter(this,void 0,void 0,function(){
var _a;
var _this=this;
return __generator(this,function(_b){
switch(_b.label){
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
if(!navigator.mediaDevices)return [3 /*break*/,2];
_a=this;
return [4 /*yield*/,navigator.mediaDevices.getUserMedia({audio:true})];
case 1:
_a.stream=_b.sent();
if(this.props.mimeTypeToUseWhenRecording){
this.mediaRecorder=new MediaRecorder(this.stream,{
mimeType:this.props.mimeTypeToUseWhenRecording,
});
}
else{
this.mediaRecorder=new MediaRecorder(this.stream);
}
this.chunks=[];
this.mediaRecorder.ondataavailable=function(e){
if(e.data && e.data.size > 0){
_this.chunks.push(e.data);
}
};
return [2 /*return*/,true];
case 2:
this.setState({medianotFound:true});
return [2 /*return*/,false];
}
});
});
};
Recorder.prototype.startTimer=function(){
this.timer=setInterval(this.countDown,1000);
};
Recorder.prototype.countDown=function(){
var seconds=this.state.seconds + 1;
this.setState({
seconds:seconds,
time:(0,utils_1.secondsToTime)(seconds),
});
};
Recorder.prototype.startRecording=function(){
return __awaiter(this,void 0,void 0,function(){
var isReady;
return __generator(this,function(_a){
switch(_a.label){
case 0:
if(!!this.state.recording)return [3 /*break*/,2];
return [4 /*yield*/,this.initRecorder()];
case 1:
isReady=_a.sent();
if(isReady){
// wipe old data chunks
this.chunks=[];
// start recorder with 10ms buffer
this.mediaRecorder.start(10);
this.startTimer();
this.setState({recording:true});
}
_a.label=2;
case 2:return [2 /*return*/];
}
});
});
};
Recorder.prototype.saveAudio=function(){
var blob=new Blob(this.chunks,{type:'audio/*'});
var audioURL=window.URL.createObjectURL(blob);
this.setState({
audioData:{
blob:blob,
url:audioURL,
chunks:this.chunks,
duration:this.state.time,
},
});
if(this.props.handleAudioStop)
this.props.handleAudioStop({
blob:blob,
url:audioURL,
chunks:this.chunks,
duration:this.state.time,
});
};
Recorder.prototype.render=function(){
var Render=this.props.Render;
var _a=this.state,medianotFound=_a.medianotFound,time=_a.time,audioData=_a.audioData,recording=_a.recording,paused=_a.paused;
return(react_1.default.createElement("div",{className:''},
react_1.default.createElement(Render,__assign({time:time,data:audioData,paused:paused,recording:recording},this.props.props,{reset:this.handleReset,stop:this.stopRecording,start:this.startRecording,hasRecorder:!medianotFound,pause:this.handleAudioPause,resume:this.handleAudioStart}))));
};
return Recorder;
}(react_1.Component));
exports.default=Recorder;
