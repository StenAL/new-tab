import { StrictMode } from "react";
import { render } from "react-dom";
import { App } from "./App";

import "./index.scss";
import "currency-flags/dist/currency-flags.css";

render(
    <StrictMode>
        <App />
    </StrictMode>,
    document.getElementById("root")
);
