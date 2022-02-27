import { FunctionComponent, useEffect, useReducer, useState } from "react";
import { BalanceContainer } from "./components/BalanceContainer";
import { ShortcutsContainer } from "./components/ShortcutsContainer";
import { ActionType, DispatchContextProvider, reducer } from "./Reducer";
import { Balance } from "./types";
import { ApiContextProvider, ApiHelper } from "./util/ApiHelper";
import { getFromLocalStorage, LocalStorageKey } from "./util/LocalStorageHelper";

export interface AppState {
    balances: Balance[];
    displayedBalances: string[];
}

export const App: FunctionComponent = () => {
    const [{ balances, displayedBalances }, dispatch] = useReducer(reducer, {
        balances: JSON.parse(getFromLocalStorage(LocalStorageKey.BALANCES, "[]")),
        displayedBalances: JSON.parse(getFromLocalStorage(LocalStorageKey.DISPLAYED_BALANCES, "[]")),
    });

    const [api] = useState(
        new ApiHelper(
            process.env.REACT_APP_TRANSFERWISE_API_URL || "https://api.transferwise.com",
            process.env.REACT_APP_TRANSFERWISE_API_TOKEN
        )
    );

    useEffect(() => {
        const fetchInitialData = async () => {
            const fetchAfterTime = new Date().getTime() - 5 * 60 * 1000; // five minutes ago
            const balanceFetchTime = Number(getFromLocalStorage(LocalStorageKey.BALANCE_FETCH_TIME));

            if (balanceFetchTime === 0 || fetchAfterTime > balanceFetchTime) {
                try {
                    const balances = await api.getBalances();
                    dispatch({ type: ActionType.FETCH_DATA, balances: balances });
                } catch (e) {
                    console.warn(`Failed to fetch data, reusing existing data: ${e}`);
                    dispatch({ type: ActionType.REUSE_EXISTING_DATA });
                }
            } else {
                dispatch({ type: ActionType.REUSE_EXISTING_DATA });
            }
        };
        fetchInitialData().catch((e) => console.error(`Error while fetching data: ${e}`));
    }, [api]);

    return (
        <DispatchContextProvider value={dispatch}>
            <ApiContextProvider value={api}>
                <div className={"container"}>
                    <ShortcutsContainer />
                    <BalanceContainer balances={balances} displayedBalances={displayedBalances} />
                </div>
            </ApiContextProvider>
        </DispatchContextProvider>
    );
};
