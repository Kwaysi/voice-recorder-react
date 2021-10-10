import Recorder from "./lib";
import React, { useState } from "react";

import RecorderUI from "./RecorderUI";
import RecorderHooks from "./RecorderHooks";

export default function App() {
  const [isHooks, setHooks] = useState(false);
  return (
    <>
      <button onClick={() => setHooks(!isHooks)}>
        {isHooks ? "Use Component" : "Use Hooks"}
      </button>
      <br />
      <br />
      <br />
      {isHooks ? (
        <>
          <h3>Using Recorder with hooks</h3>
          <RecorderHooks />
        </>
      ) : (
        <>
          <h3>Using Recorder with Recorder component</h3>
          <Recorder Render={RecorderUI} />
        </>
      )}
    </>
  );
}
