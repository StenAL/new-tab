import { createContext, Dispatch, Reducer, useContext } from "react";
import { AppState } from "./components/BalanceContainer";
import { Balance } from "./types";

export enum ActionType {
    FETCH_DATA = "FETCH_DATA",
    TOGGLE_BALANCE_VISIBILITY = "TOGGLE_BALANCE_VISIBILITY",
    TOGGLE_MODAL_OPEN = "TOGGLE_MODAL_OPEN",
    CLOSE_MODAL = "CLOSE_MODAL",
}

export type Action = FetchDataAction | ToggleBalanceVisibility | ToggleModalOpenAction | CloseModalAction;

interface ActionBase {
    type: ActionType;
}

interface FetchDataAction extends ActionBase {
    type: ActionType.FETCH_DATA;
    balances: Balance[];
}

interface ToggleBalanceVisibility extends ActionBase {
    type: ActionType.TOGGLE_BALANCE_VISIBILITY;
    currency: string;
}

interface ToggleModalOpenAction extends ActionBase {
    type: ActionType.TOGGLE_MODAL_OPEN;
}

interface CloseModalAction extends ActionBase {
    type: ActionType.CLOSE_MODAL;
}

// TODO add saveToLocalStorage helper
export const reducer: Reducer<AppState, Action> = (state, action) => {
    switch (action.type) {
        case ActionType.FETCH_DATA:
            localStorage.setItem("balances", JSON.stringify(action.balances));
            localStorage.setItem("balanceFetchTime", new Date().getTime().toString());

            // initially display all balances
            if (state.displayedBalances.length === 0) {
                const allCurrencies = action.balances.map((b) => b.currency);
                localStorage.setItem("displayedBalances", JSON.stringify(allCurrencies));
                return { ...state, balances: action.balances, displayedBalances: allCurrencies };
            }
            return { ...state, balances: action.balances };
        case ActionType.TOGGLE_BALANCE_VISIBILITY:
            let newBalances: string[];
            if (state.displayedBalances.includes(action.currency)) {
                newBalances = state.displayedBalances.filter((b) => b !== action.currency);
            } else {
                newBalances = state.displayedBalances.slice();
                newBalances.push(action.currency);
            }
            localStorage.setItem("displayedBalances", JSON.stringify(newBalances));
            return { ...state, displayedBalances: newBalances };
        case ActionType.TOGGLE_MODAL_OPEN:
            return { ...state, isModalOpen: !state.isModalOpen };
        case ActionType.CLOSE_MODAL:
            return { ...state, isModalOpen: false };
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
