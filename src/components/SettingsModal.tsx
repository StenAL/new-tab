import { FunctionComponent, useMemo } from "react";
import { ActionType, useDispatchContext } from "../Reducer";
import { Balance } from "../types";

interface SettingsModalProps {
    balances: Balance[];
    displayedBalances: string[];
}

export const SettingsModal: FunctionComponent<SettingsModalProps> = ({ balances, displayedBalances }) => {
    const dispatch = useDispatchContext();
    const balanceFilters = useMemo(
        () =>
            balances.map((b) => (
                <div key={b.currency} className={"currency-filter"}>
                    <div>
                        <div className={`currency-flag settings-flag currency-flag-${b.currency.toLowerCase()}`} />
                        <span className={"filter-text"}>{b.currency}</span>
                    </div>
                    <input
                        type={"checkbox"}
                        onChange={() => dispatch({ type: ActionType.TOGGLE_BALANCE_VISIBILITY, currency: b.currency })}
                        checked={displayedBalances.includes(b.currency)}
                    />
                </div>
            )),
        [balances, dispatch, displayedBalances]
    );

    return (
        <div>
            <h3 className={"settings-title"}>Select balances</h3>
            {balanceFilters}
        </div>
    );
};
