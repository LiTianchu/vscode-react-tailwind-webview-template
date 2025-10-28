import * as React from "react";
import { createRoot } from 'react-dom/client';
import { App } from "./App";
import "./styles.css"; // import tailwind styles

// Not used currently, comment out to avoid linting issues
// declare const acquireVsCodeApi: <T = unknown>() => {
//   getState: () => T;
//   setState: (data: T) => void;
//   postMessage: (msg: unknown) => void;
// };

const elm = document.querySelector("#root");
if (elm) {
    const root = createRoot(elm);

    root.render(<App />);
}

// Webpack HMR
// @ts-expect-error to ignore import.meta errors
if (import.meta.webpackHot) {
    // @ts-expect-error to ignore import.meta errors
    import.meta.webpackHot.accept()
}
