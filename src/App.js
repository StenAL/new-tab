import React from "react";
import ShortcutsContainer from "./components/ShortcutsContainer";
import BalanceContainer from "./components/BalanceContainer";

function App() {
    return (
        <div className={"container"}>
            <ShortcutsContainer />
            <BalanceContainer />
        </div>
    );
}

export default App;
