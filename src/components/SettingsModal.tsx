import { FunctionComponent, useMemo } from "react";
import { Balance } from "../types";

interface SettingsModalProps {
    balances: Balance[];
    displayedBalances: string[];
    onCheckboxToggle: (currency: string) => void;
}
export const SettingsModal: FunctionComponent<SettingsModalProps> = ({
    balances,
    displayedBalances,
    onCheckboxToggle,
}) => {
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
                        onChange={() => onCheckboxToggle(b.currency)}
                        checked={displayedBalances.includes(b.currency)}
                    />
                </div>
            )),
        [balances, displayedBalances, onCheckboxToggle]
    );

    return (
        <div>
            <h3 className={"settings-title"}>Select balances</h3>
            {balanceFilters}
        </div>
    );
};
