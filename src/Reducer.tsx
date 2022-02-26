import { createContext, Dispatch, Reducer, useContext } from "react";
import { AppState } from "./App";
import { Balance } from "./types";
import { getFromLocalStorage, LocalStorageKey, setLocalStorage } from "./util/LocalStorageHelper";

export enum ActionType {
    FETCH_DATA = "FETCH_DATA",
    REUSE_EXISTING_DATA = "REUSE_EXISTING_DATA",
    TOGGLE_BALANCE_VISIBILITY = "TOGGLE_BALANCE_VISIBILITY",
}

export type Action = FetchDataAction | ToggleBalanceVisibility | ReuseExistingDataAction;

interface ActionBase {
    type: ActionType;
}

interface FetchDataAction extends ActionBase {
    type: ActionType.FETCH_DATA;
    balances: Balance[];
}

interface ReuseExistingDataAction extends ActionBase {
    type: ActionType.REUSE_EXISTING_DATA;
}

interface ToggleBalanceVisibility extends ActionBase {
    type: ActionType.TOGGLE_BALANCE_VISIBILITY;
    currency: string;
}

export const reducer: Reducer<AppState, Action> = (state, action) => {
    switch (action.type) {
        case ActionType.FETCH_DATA:
            setLocalStorage(LocalStorageKey.BALANCES, JSON.stringify(action.balances));
            setLocalStorage(LocalStorageKey.BALANCE_FETCH_TIME, new Date().getTime().toString());

            // initially display all balances
            if (state.displayedBalances.length === 0) {
                const allCurrencies = action.balances.map((b) => b.currency);
                setLocalStorage(LocalStorageKey.DISPLAYED_BALANCES, JSON.stringify(allCurrencies));
                return { ...state, balances: action.balances, displayedBalances: allCurrencies };
            }
            return { ...state, balances: action.balances };
        case ActionType.REUSE_EXISTING_DATA:
            const existingBalance: Balance[] = JSON.parse(getFromLocalStorage(LocalStorageKey.BALANCES, "[]"));
            if (existingBalance.length === 0) {
                console.error("Trying to reuse existing balance but can not find any balances.");
            }
            return { ...state, balances: existingBalance };
        case ActionType.TOGGLE_BALANCE_VISIBILITY:
            let newBalances: string[];
            if (state.displayedBalances.includes(action.currency)) {
                newBalances = state.displayedBalances.filter((b) => b !== action.currency);
            } else {
                newBalances = state.displayedBalances.slice();
                newBalances.push(action.currency);
            }
            setLocalStorage(LocalStorageKey.DISPLAYED_BALANCES, JSON.stringify(newBalances));
            return { ...state, displayedBalances: newBalances };
    }
    return state;
};

const DispatchContext = createContext<Dispatch<Action> | undefined>(undefined);

export const useDispatchContext: () => Dispatch<Action> = () => {
    const context = useContext(DispatchContext);
    if (context === undefined) {
        throw new Error("useCount must be used within a CountProvider");
    }
    return context;
};

export const DispatchContextProvider = DispatchContext.Provider;
