import { FunctionComponent } from "react";

interface SettingsModalProps {
    balances: any;
    displayedBalances: any;
    onCheckboxToggle: any;
}
export const SettingsModal: FunctionComponent<SettingsModalProps> = ({
    balances,
    displayedBalances,
    onCheckboxToggle,
}) => {
    const balanceFilters = balances.map((b) => (
        <div key={b.currency} className={"currency-filter"}>
            <div>
                <div
                    className={`currency-flag settings-flag currency-flag-${b.currency.toLowerCase()}`}
                />
                <span className={"filter-text"}>{b.currency}</span>
            </div>
            <input
                type={"checkbox"}
                onChange={() => onCheckboxToggle(b.currency)}
                checked={displayedBalances.includes(b.currency)}
            />
        </div>
    ));

    return (
        <div>
            <h3 className={"settings-title"}>Select balances</h3>
            {balanceFilters}
        </div>
    );
};
