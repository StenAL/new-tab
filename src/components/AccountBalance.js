import React, {useEffect} from "react";
import 'currency-flags/dist/currency-flags.css'

export default function AccountBalance() {
    const token = process.env.REACT_APP_TRANSFERWISE_API_TOKEN;
    const profileId = process.env.REACT_APP_TRANSFERWISE_PROFILE_ID;

    const [balance, setBalance] = React.useState({});

    const fetchAfterTime = new Date(new Date() - 5 * 60 * 1000);
    const balanceFetchTime = Date.parse(window.localStorage.getItem('balanceFetchTime'))


    const fetchBalance = async () => {
        console.log("fetching TW balance")
        const balanceResponse = await fetch(process.env.REACT_APP_TRANSFERWISE_API_URL + `/v1/borderless-accounts?profileId=${profileId}`,
            {headers: {'Authorization': `Bearer ${token}`}});
        const balanceArray = await balanceResponse.json();
        return balanceArray[0]
    }

    useEffect(() => {

        const fetchAfterTime = new Date(new Date() - 5 * 60 * 1000);
        const balanceFetchTime = Date.parse(window.localStorage.getItem('balanceFetchTime'))

        if (isNaN(balanceFetchTime) || fetchAfterTime > balanceFetchTime) {
            fetchBalance().then(b => {
                window.localStorage.setItem('balance', JSON.stringify(b));
                window.localStorage.setItem('balanceFetchTime', new Date().toString());
                setBalance(b);
            });
        } else {
            setBalance(JSON.parse(localStorage.getItem('balance')));
        }
    }, []);

    const getFormattedValueForCurrency = (currency, value) => {
        const decimalFormattedValue = Number(value).toFixed(2);
        console.log(decimalFormattedValue)
        switch (currency) {
            case 'EUR':
                return decimalFormattedValue + " €";
            case 'GBP':
                return "£" + decimalFormattedValue;
            default:
                return decimalFormattedValue + " " + currency;
        }
    }

    const rotate = (event) => {
        const target = event.target;
        target.classList.add('spin-animation')
        fetchBalance().then(b => {
            window.localStorage.setItem('balance', JSON.stringify(b));
            window.localStorage.setItem('balanceFetchTime', new Date().toString());
            setBalance(b);
        });
        setTimeout(() => target.classList.remove('spin-animation'), 1000)
    }

    const balanceComponents = balance.balances?.map(b =>
    <div key={b.currency} className={"currency-balance"}>
            <div className={`currency-flag currency-flag-${b.currency.toLowerCase()}`}/>
            <p>{getFormattedValueForCurrency(b.currency, b.amount.value)}</p>
    </div>)
    return (
        <div className={"balance-container"}>
            <div className={"account-balance"}>
                <img src={process.env.PUBLIC_URL + "/transferwise.png"} alt={'TransferWise'} className={'refresh-icon'}/>
                <h2>
                    Current Balance
                    <button className={'refresh-button'} onClick={rotate}>
                        <img src={process.env.PUBLIC_URL + "/refresh.png"} alt={'refresh'} className={'balance-logo'}/>
                    </button>
                </h2>
                {balanceComponents}

            </div>
        </div>
    )
}