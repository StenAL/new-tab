import React from 'react';

export default function SettingsModal({balances, displayedBalances, onCheckboxToggle}) {

    const balanceFilters = balances
        .map(b =>
            <div key={b.currency} className={"currency-filter"}>
                <div>
                    <div className={`currency-flag settings-flag currency-flag-${b.currency.toLowerCase()}`}/>
                    {b.currency}
                </div>
                <input type={'checkbox'} onChange={() => onCheckboxToggle(b.currency)} checked={displayedBalances.includes(b.currency)}/>
            </div>)

    return (
        <div>
            <h3>Select balances</h3>
            {balanceFilters}
        </div>
    )
}