import React from "react";
import 'currency-flags/dist/currency-flags.css'
import CurrencyBalance from "./CurrencyBalance";

export default function BalanceContainer() {
    const token = process.env.REACT_APP_TRANSFERWISE_API_TOKEN;
    const apiUrl = process.env.REACT_APP_TRANSFERWISE_API_URL || "https://api.transferwise.com";

    const [balance, setBalance] = React.useState({balances: []});

    const fetchProfileId = async () => {
        console.log("fetching TW profile id")
        const profileIdResponse = await fetch(apiUrl + `/v1/profiles`,
            {headers: {'Authorization': `Bearer ${token}`}});
        const profileArray = await profileIdResponse.json();
        const profileId = profileArray[0].id
        window.localStorage.setItem('transferwiseProfileId', profileId);
        return profileId;
    }

    const fetchBalance = async () => {
        let profileId = window.localStorage.getItem('transferwiseProfileId')
        if (!profileId) {
            profileId = await fetchProfileId();
        }

        console.log("fetching TW balance")
        const balanceResponse = await fetch(apiUrl + `/v1/borderless-accounts?profileId=${profileId}`,
            {headers: {'Authorization': `Bearer ${token}`}});
        const balanceArray = await balanceResponse.json();
        const b = balanceArray[0]
        window.localStorage.setItem('balance', JSON.stringify(b));
        window.localStorage.setItem('balanceFetchTime', new Date().toString());
        setBalance(b);
    }

    const reuseExistingBalance = () => {
        const existingBalance = JSON.parse(localStorage.getItem('balance'));
        if (existingBalance !== null) {
            setBalance(existingBalance)
        } else {
            console.log('Trying to reuse existing balance failed, balance not found.')
        }
    }

    const fetchAfterTime = new Date(new Date() - 5 * 60 * 1000); // five minutes ago
    const balanceFetchTime = Date.parse(window.localStorage.getItem('balanceFetchTime'))

    if (isNaN(balanceFetchTime) || fetchAfterTime > balanceFetchTime) {
        fetchBalance()
            .catch(e => {
                console.log(e);
                reuseExistingBalance();
            });
    } else if (Object.keys(balance).length === 1) { // balance has not been initialzed yet
        reuseExistingBalance()
    }

    const refreshBalance = (event) => {
        const target = event.target;
        target.classList.add('spin-animation')
        fetchBalance()
            .catch(e => {
                console.log(e);
                reuseExistingBalance();
            });
        setTimeout(() => target.classList.remove('spin-animation'), 1000)
    }

    const currencyBalances = balance.balances
        .map(b => <CurrencyBalance currency={b.currency} value={b.amount.value} key={b.currency}/>)

    return (
        <div className={"balance-container"}>
            <div className={"balance"}>
                <img src={process.env.PUBLIC_URL + "/transferwise.png"} alt={'TransferWise'} className={'transferwise-icon'}/>
                <h2>
                    Current Balance
                    <button className={'refresh-button'} onClick={refreshBalance}>
                        <img src={process.env.PUBLIC_URL + "/refresh.png"} alt={'refresh'} className={'refresh-icon'}/>
                    </button>
                </h2>
                {currencyBalances}
            </div>
        </div>
    )
}