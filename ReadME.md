# Voice Recoder React

React component for recording audio in browser

Inspired by https://github.com/sivaprakashDesingu/react-voice-recorder

This component decouple the UI from the recording functionality.

# Demo

https://codesandbox.io/s/prod-star-sxndo

# Props
The following props are passed by both hooks and Component

| Prop | Default | Description |
| --- | ----------- |  -------- |
| time | {h:0 ,m:0 ,s:0} | An object that holds the duration of a recording |
| stop | n/a | a function that stops the media recorder |
| start | n/a | a function that starts the media recorder |
| pause | n/a | a function that pauses the media recorder |
| resume | n/a | a function that resumes the media recorder |
| reset | n/a | a function that discards all current recording data |
| data | {blob: Blob; url: string; chunks: Blob[];duration: Time;} | This object holds the data about the last recording |
| paused | false | indicates if the current recording is paused |
| recording | false | indicates if there is an ongoing recording |
| props | '{}' | This is unique only to the component usage. It accepts additional props to pass to the sub component |

Please refer to the demo to understand better.

# Usage

This component can be used as hooks or render props

## Hooks Usage

Please refer to the demo for a working example


# Recoder component

Please refer to the demo for a working example