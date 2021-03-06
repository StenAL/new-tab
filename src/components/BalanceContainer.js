import React, { useEffect } from "react";
import "currency-flags/dist/currency-flags.css";
import CurrencyBalance from "./CurrencyBalance";
import Modal from "react-modal";
import SettingsModal from "./SettingsModal";

Modal.setAppElement("#root");

export default function BalanceContainer() {
    const token = process.env.REACT_APP_TRANSFERWISE_API_TOKEN;
    if (!token) {
        console.error(
            "No TransferWise API token found. Add an .env file or set REACT_APP_TRANSFERWISE_API_TOKEN if it exists"
        );
    }
    const apiUrl =
        process.env.REACT_APP_TRANSFERWISE_API_URL ||
        "https://api.transferwise.com";

    const [balance, setBalance] = React.useState({ balances: [] });
    const [modalOpen, setModalOpen] = React.useState(false);
    const [displayedBalances, setDisplayedBalances] = React.useState(
        JSON.parse(window.localStorage.getItem("displayedBalances"))
    );

    const fetchProfileId = async () => {
        console.log("Fetching TW profile ID...");
        const profileIdResponse = await fetch(apiUrl + `/v1/profiles`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        const profileArray = await profileIdResponse.json();
        const profileId = profileArray[0].id;
        window.localStorage.setItem("transferwiseProfileId", profileId);
        console.log(`TW profile ID fetched: ${profileId}`);
        return profileId;
    };

    const fetchBalance = async () => {
        let profileId = window.localStorage.getItem("transferwiseProfileId");
        if (!profileId) {
            profileId = await fetchProfileId();
        }

        console.log("Fetching balance...");
        const balanceResponse = await fetch(
            apiUrl + `/v1/borderless-accounts?profileId=${profileId}`,
            { headers: { Authorization: `Bearer ${token}` } }
        );
        const balanceArray = await balanceResponse.json();
        const b = balanceArray[0];
        window.localStorage.setItem("balance", JSON.stringify(b));
        window.localStorage.setItem("balanceFetchTime", new Date().toString());

        if (displayedBalances === null) {
            const allCurrencies = b.balances.map((b) => b.currency);
            window.localStorage.setItem(
                "displayedBalances",
                JSON.stringify(allCurrencies)
            );
            setDisplayedBalances(allCurrencies);
        }
        console.log("Balance fetched successfully");
        setBalance(b);
    };

    const reuseExistingBalance = () => {
        const existingBalance = JSON.parse(localStorage.getItem("balance"));
        if (existingBalance !== null) {
            setBalance(existingBalance);
        } else {
            console.error(
                "Trying to reuse existing balance failed, balance not found."
            );
        }
    };

    useEffect(() => {
        const fetchAfterTime = new Date(new Date() - 5 * 60 * 1000); // five minutes ago
        const balanceFetchTime = Date.parse(
            window.localStorage.getItem("balanceFetchTime")
        );

        if (isNaN(balanceFetchTime) || fetchAfterTime > balanceFetchTime) {
            fetchBalance().catch((e) => {
                console.log(e);
                reuseExistingBalance();
            });
        } else {
            // balance has not been initialized yet
            reuseExistingBalance();
        }
    }, []);

    const refreshBalance = (event) => {
        const target = event.target;
        target.classList.add("spin-animation");
        fetchBalance().catch((e) => {
            console.log(e);
            reuseExistingBalance();
        });
        setTimeout(() => target.classList.remove("spin-animation"), 1000);
    };

    const toggleBalanceDisplayed = (balance) => {
        let newBalances;
        if (displayedBalances.includes(balance)) {
            newBalances = displayedBalances.filter((b) => b !== balance);
        } else {
            newBalances = displayedBalances.slice();
            newBalances.push(balance);
        }
        localStorage.setItem("displayedBalances", JSON.stringify(newBalances));
        setDisplayedBalances(newBalances);
    };

    const currencyBalances = balance.balances
        .filter((b) => displayedBalances?.includes(b.currency))
        .map((b) => (
            <CurrencyBalance
                currency={b.currency}
                value={b.amount.value}
                key={b.currency}
            />
        ));

    return (
        <div className={"balance-container"}>
            <div className={"balance"}>
                <img
                    src={process.env.PUBLIC_URL + "/transferwise.png"}
                    alt={"TransferWise"}
                    className={"transferwise-icon"}
                />
                <h2>
                    Current Balance
                    <button
                        className={"balance-container-button"}
                        onClick={refreshBalance}
                    >
                        <img
                            src={process.env.PUBLIC_URL + "/refresh.png"}
                            alt={"refresh"}
                            className={"refresh-icon"}
                        />
                    </button>
                    <button
                        className={"balance-container-button"}
                        onClick={() => setModalOpen(!modalOpen)}
                    >
                        <img
                            src={process.env.PUBLIC_URL + "/settings.png"}
                            alt={"settings"}
                            className={"settings-icon"}
                        />
                    </button>
                </h2>
                <Modal
                    isOpen={modalOpen}
                    shouldCloseOnOverlayClick={true}
                    shouldCloseOnEsc={true}
                    onRequestClose={() => setModalOpen(false)}
                    style={{
                        overlay: {
                            backgroundColor: "rgba(255, 255, 255, 0)",
                        },
                        content: {
                            position: "fixed",
                            top: "49vh",
                            left: "16vw",
                            right: "73vw",
                            bottom: "20vh",
                            borderRadius: "5px",
                            backgroundColor: "rgba(255, 255, 255, 0.7)",
                            padding: "20px",
                        },
                    }}
                >
                    <SettingsModal
                        balances={balance.balances}
                        displayedBalances={displayedBalances}
                        onCheckboxToggle={toggleBalanceDisplayed}
                    />
                </Modal>
                {currencyBalances}
            </div>
        </div>
    );
}
