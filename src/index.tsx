import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import * as Modal from "react-modal";

import { App } from "./App";

import "./index.scss";
import "currency-flags/dist/currency-flags.css";

const container = document.getElementById("root");
if (!container) {
    throw new Error("Failed to initialize React root, element with id 'root' is null");
}
Modal.setAppElement(container);

const root = createRoot(container);
root.render(
    <StrictMode>
        <App />
    </StrictMode>
);
