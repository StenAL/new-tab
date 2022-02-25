import { FunctionComponent } from "react";
import { ShortcutsContainer } from "./components/ShortcutsContainer";
import { BalanceContainer } from "./components/BalanceContainer";

export const App: FunctionComponent = () => {
    return (
        <div className={"container"}>
            <ShortcutsContainer />
            <BalanceContainer />
        </div>
    );
};
export default App;
