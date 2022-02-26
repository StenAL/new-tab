import { FunctionComponent, useCallback, useEffect, useState, MouseEvent, useReducer, useMemo } from "react";
import "currency-flags/dist/currency-flags.css";
import { ActionType, DispatchContextProvider, reducer } from "../Reducer";
import { Balance, Profile } from "../types";
import { CurrencyBalance } from "./CurrencyBalance";
import * as Modal from "react-modal";
import { SettingsModal } from "./SettingsModal";

Modal.setAppElement("#root");

export interface AppState {
    balances: Balance[];
    isModalOpen: boolean;
    displayedBalances: string[];
}

export const BalanceContainer: FunctionComponent = () => {
    const [token] = useState(process.env.REACT_APP_TRANSFERWISE_API_TOKEN);
    if (!token) {
        console.error(
            "No TransferWise API token found. Add an .env file or set REACT_APP_TRANSFERWISE_API_TOKEN if it exists"
        );
    }
    const [apiUrl] = useState(process.env.REACT_APP_TRANSFERWISE_API_URL || "https://api.transferwise.com");

    const [state, dispatch] = useReducer(reducer, {
        balances: [] as Balance[], // todo can use JSON.parse here?
        isModalOpen: false,
        displayedBalances: JSON.parse(localStorage.getItem("displayedBalances") || "[]"),
    });

    const fetchProfileId = useCallback(async () => {
        console.log("Fetching TransferWise profile ID...");
        const profileResponse = await fetch(`${apiUrl}/v2/profiles`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        const profileResponseArray: Profile[] = await profileResponse.json();
        const profileId = profileResponseArray[0].id;
        localStorage.setItem("transferwiseProfileId", profileId.toString());
        console.log(`TransferWise profile id fetched: ${profileId}`);
        return profileId;
    }, [apiUrl, token]);

    const fetchBalance = useCallback(async () => {
        const fetchData = async () => {
            let profileId = localStorage.getItem("transferwiseProfileId") || undefined;
            if (!profileId) {
                profileId = (await fetchProfileId()).toString();
            }

            console.log("Fetching balance...");
            const response = await fetch(`${apiUrl}/v3/profiles/${profileId}/balances?types=STANDARD`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const balances: Balance[] = await response.json();
            dispatch({ type: ActionType.FETCH_DATA, balances: balances });
        };
        fetchData().catch((e) => console.error(`Error while fetching data: ${e}`));
    }, [apiUrl, fetchProfileId, token]);

    const reuseExistingBalance = useCallback(() => {
        const existingBalance: Balance[] = JSON.parse(localStorage.getItem("balances") || "[]");
        if (Object.keys(existingBalance).length !== 0) {
            dispatch({ type: ActionType.FETCH_DATA, balances: existingBalance });
        } else {
            console.error("Trying to reuse existing balance but can not find any balances.");
        }
    }, []);

    useEffect(() => {
        const fetchAfterTime = new Date().getTime() - 5 * 60 * 1000; // five minutes ago
        const balanceFetchTime = Number(localStorage.getItem("balanceFetchTime"));

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

    const currencyBalances = useMemo(
        () =>
            state.balances
                .filter((b) => state.displayedBalances.includes(b.currency))
                .map((b) => <CurrencyBalance currency={b.currency} value={b.amount.value} key={b.currency} />),
        [state.balances, state.displayedBalances]
    );

    return (
        <DispatchContextProvider value={dispatch}>
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
                        <button
                            className={"balance-container-button"}
                            onClick={() => dispatch({ type: ActionType.TOGGLE_MODAL_OPEN })}
                        >
                            <img
                                src={process.env.PUBLIC_URL + "/settings.png"}
                                alt={"settings"}
                                className={"settings-icon"}
                            />
                        </button>
                    </h2>
                    <Modal
                        isOpen={state.isModalOpen}
                        shouldCloseOnOverlayClick={true}
                        shouldCloseOnEsc={true}
                        onRequestClose={() => dispatch({ type: ActionType.CLOSE_MODAL })}
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
                        <SettingsModal balances={state.balances} displayedBalances={state.displayedBalances} />
                    </Modal>
                    {currencyBalances}
                </div>
            </div>
        </DispatchContextProvider>
    );
};
