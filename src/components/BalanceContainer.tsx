import { FunctionComponent, useCallback, useEffect, useState, MouseEvent } from "react";
import "currency-flags/dist/currency-flags.css";
import { AccountInfo, Profile } from "../types";
import { CurrencyBalance } from "./CurrencyBalance";
import * as Modal from "react-modal";
import { SettingsModal } from "./SettingsModal";

Modal.setAppElement("#root");

export const BalanceContainer: FunctionComponent = () => {
    const [token] = useState(process.env.REACT_APP_TRANSFERWISE_API_TOKEN);
    if (!token) {
        console.error(
            "No TransferWise API token found. Add an .env file or set REACT_APP_TRANSFERWISE_API_TOKEN if it exists"
        );
    }
    const [apiUrl] = useState(process.env.REACT_APP_TRANSFERWISE_API_URL || "https://api.transferwise.com");

    const [accountInfo, setAccountInfo] = useState<AccountInfo | undefined>();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [displayedBalances, setDisplayedBalances] = useState<string[]>(
        JSON.parse(localStorage.getItem("displayedBalances") || "[]")
    );

    const fetchProfileId = useCallback(async () => {
        console.log("Fetching TransferWise profile ID...");
        const profileResponse = await fetch(apiUrl + `/v1/profiles`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        const profileResponseArray: Profile[] = await profileResponse.json();
        const profileId = profileResponseArray[0].id;
        window.localStorage.setItem("transferwiseProfileId", profileId.toString());
        console.log(`TransferWise profile id fetched: ${profileId}`);
        return profileId;
    }, [apiUrl, token]);

    const fetchBalance = useCallback(async () => {
        let profileId = window.localStorage.getItem("transferwiseProfileId") || undefined;
        if (!profileId) {
            profileId = (await fetchProfileId()).toString();
        }

        console.log("Fetching balance...");
        const accountInfoResponse = await fetch(apiUrl + `/v1/borderless-accounts?profileId=${profileId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        const accountInfoResponseArray: AccountInfo[] = await accountInfoResponse.json();
        const accountInfo = accountInfoResponseArray[0];
        window.localStorage.setItem("accountInfo", JSON.stringify(accountInfo));
        window.localStorage.setItem("balanceFetchTime", new Date().getTime().toString());

        if (displayedBalances.length === 0) {
            const allCurrencies = accountInfo.balances.map((b) => b.currency);
            window.localStorage.setItem("displayedBalances", JSON.stringify(allCurrencies));
            setDisplayedBalances(allCurrencies);
        }
        console.log("Balance fetched successfully");
        setAccountInfo(accountInfo);
    }, [apiUrl, displayedBalances, fetchProfileId, token]);

    const reuseExistingBalance = useCallback(() => {
        const existingBalance: AccountInfo = JSON.parse(localStorage.getItem("accountInfo") || "{}");
        if (Object.keys(existingBalance).length !== 0) {
            setAccountInfo(existingBalance);
        } else {
            console.error("Trying to reuse existing balance failed but can not find any balances.");
        }
    }, []);

    useEffect(() => {
        const fetchAfterTime = new Date().getTime() - 5 * 60 * 1000; // five minutes ago
        const balanceFetchTime = Number(window.localStorage.getItem("balanceFetchTime"));

        if (isNaN(balanceFetchTime) || fetchAfterTime > balanceFetchTime) {
            fetchBalance().catch((e) => {
                console.log(e);
                reuseExistingBalance();
            });
        } else {
            reuseExistingBalance();
        }
    }, [reuseExistingBalance, fetchBalance]);

    const refreshBalance = useCallback(
        (event: MouseEvent) => {
            const target = event.currentTarget;
            target.classList.add("spin-animation");
            fetchBalance().catch((e) => {
                console.log(e);
                reuseExistingBalance();
            });
            setTimeout(() => target.classList.remove("spin-animation"), 1000);
        },
        [fetchBalance, reuseExistingBalance]
    );

    const toggleBalanceDisplayed = useCallback(
        (currency: string) => {
            let newBalances: string[];
            if (displayedBalances.includes(currency)) {
                newBalances = displayedBalances.filter((b) => b !== currency);
            } else {
                newBalances = displayedBalances.slice();
                newBalances.push(currency);
            }
            localStorage.setItem("displayedBalances", JSON.stringify(newBalances));
            setDisplayedBalances(newBalances);
        },
        [displayedBalances]
    );

    const currencyBalances = accountInfo?.balances
        .filter((b) => displayedBalances?.includes(b.currency))
        .map((b) => <CurrencyBalance currency={b.currency} value={b.amount.value} key={b.currency} />);

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
                    <button className={"balance-container-button"}>
                        <img
                            onClick={refreshBalance}
                            src={process.env.PUBLIC_URL + "/refresh.png"}
                            alt={"refresh"}
                            className={"refresh-icon"}
                        />
                    </button>
                    <button className={"balance-container-button"} onClick={() => setIsModalOpen(!isModalOpen)}>
                        <img
                            src={process.env.PUBLIC_URL + "/settings.png"}
                            alt={"settings"}
                            className={"settings-icon"}
                        />
                    </button>
                </h2>
                <Modal
                    isOpen={isModalOpen}
                    shouldCloseOnOverlayClick={true}
                    shouldCloseOnEsc={true}
                    onRequestClose={() => setIsModalOpen(false)}
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
                        balances={accountInfo?.balances || []}
                        displayedBalances={displayedBalances}
                        onCheckboxToggle={toggleBalanceDisplayed}
                    />
                </Modal>
                {currencyBalances}
            </div>
        </div>
    );
};
