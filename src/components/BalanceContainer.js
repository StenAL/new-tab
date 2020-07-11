import React from "react";
import 'currency-flags/dist/currency-flags.css'
import CurrencyBalance from "./CurrencyBalance";
import Modal from 'react-modal';
import SettingsModal from "./SettingsModal";

Modal.setAppElement('#root');

export default function BalanceContainer() {
    const token = process.env.REACT_APP_TRANSFERWISE_API_TOKEN;
    const apiUrl = process.env.REACT_APP_TRANSFERWISE_API_URL || "https://api.transferwise.com";

    const [balance, setBalance] = React.useState({balances: []});
    const [modalOpen, setModalOpen] = React.useState(false);
    const [displayedBalances, setDisplayedBalances] = React.useState(undefined);

    if (!displayedBalances) {
        let displayedBalancesLocalStorage = JSON.parse(window.localStorage.getItem("displayedBalances"));
        if (displayedBalancesLocalStorage) {
            setDisplayedBalances(displayedBalancesLocalStorage);
        }
    }

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
        const b = balanceArray[0];
        window.localStorage.setItem('balance', JSON.stringify(b));
        window.localStorage.setItem('balanceFetchTime', new Date().toString());

        if (!displayedBalances) {
            const allCurrencies = b.balances.map(b => b.currency)
            window.localStorage.setItem("displayedBalances", JSON.stringify(allCurrencies))
        }

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
    const balanceFetchTime = Date.parse(window.localStorage.getItem('balanceFetchTime'));

    if (isNaN(balanceFetchTime) || fetchAfterTime > balanceFetchTime) {
        fetchBalance()
            .catch(e => {
                console.log(e);
                reuseExistingBalance();
            });
    } else if (Object.keys(balance).length === 1) { // balance has not been initialized yet
        reuseExistingBalance();
    }

    const refreshBalance = (event) => {
        const target = event.target;
        target.classList.add('spin-animation')
        fetchBalance()
            .catch(e => {
                console.log(e);
                reuseExistingBalance();
            });
        setTimeout(() => target.classList.remove('spin-animation'), 1000);
    }

    const toggleSettingsModal = (event) => {
        setModalOpen(!modalOpen);
    }

    const toggleBalanceDisplayed = (balance) => {
        let newBalances;
        if (displayedBalances.includes(balance)) {
            newBalances = displayedBalances.filter(b => b !== balance);
        } else {
            newBalances = displayedBalances.slice();
            newBalances.push(balance);
        }
        localStorage.setItem("displayedBalances", JSON.stringify(newBalances))
        setDisplayedBalances(newBalances);
    }

    const currencyBalances = balance.balances
        .filter(b => displayedBalances?.includes(b.currency))
        .map(b => <CurrencyBalance currency={b.currency} value={b.amount.value} key={b.currency}/>)

    return (
        <div className={"balance-container"}>
            <div className={"balance"}>
                <img src={process.env.PUBLIC_URL + "/transferwise.png"} alt={'TransferWise'} className={'transferwise-icon'}/>
                <h2>
                    Current Balance
                    <button className={'balance-container-button'} onClick={refreshBalance}>
                        <img src={process.env.PUBLIC_URL + "/refresh.png"} alt={'refresh'} className={'refresh-icon'}/>
                    </button>
                    <button className={'balance-container-button'} onClick={toggleSettingsModal}>
                        <img src={process.env.PUBLIC_URL + "/settings.png"} alt={'settings'} className={'settings-icon'}/>
                    </button>
                </h2>
                <Modal isOpen={modalOpen} style={{
                    overlay: {
                        position: 'fixed',
                        top: '49vh',
                        left: '16vw',
                        right: '73vw',
                        bottom: '20vh',
                        borderRadius: '4px',
                    },
                    content: {
                        position: 'absolute',
                        top: '0',
                        left: '0',
                        right: '0',
                        bottom: '0',
                        backgroundColor: 'rgba(255, 255, 255, 0.5)',
                        padding: '20px'
                    }
                }}>
                    <SettingsModal balances={balance.balances} displayedBalances={displayedBalances} onCheckboxToggle={toggleBalanceDisplayed}/>
                </Modal>
                {currencyBalances}
            </div>
        </div>
    )
}