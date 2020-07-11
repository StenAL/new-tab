import React from 'react';

export default function SettingsModal({balances, displayedBalances, onCheckboxToggle}) {

    const balanceFilters = balances
        .map(b =>
            <div key={b.currency} className={"currency-filter"}>
                <div className={`currency-flag settings-flag currency-flag-${b.currency.toLowerCase()}`}/>
                <input type={'checkbox'} onClick={() => onCheckboxToggle(b.currency)} checked={displayedBalances.includes(b.currency)}/>
            </div>)

    return (
        <div>
            {balanceFilters}
        </div>
    )
}