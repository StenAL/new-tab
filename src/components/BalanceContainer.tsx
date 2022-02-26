import { FunctionComponent, MouseEvent, useCallback, useMemo, useState } from "react";
import * as Modal from "react-modal";
import { ActionType, useDispatchContext } from "../Reducer";
import { Balance } from "../types";
import { useApiContext } from "../util/ApiHelper";
import { CurrencyBalance } from "./CurrencyBalance";
import { SettingsModal } from "./SettingsModal";

Modal.setAppElement("#root");

interface BalanceContainerProps {
    balances: Balance[];
    displayedBalances: string[];
}

export const BalanceContainer: FunctionComponent<BalanceContainerProps> = ({ balances, displayedBalances }) => {
    const dispatch = useDispatchContext();
    const api = useApiContext();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const refreshBalance = useCallback(
        (event: MouseEvent) => {
            const target = event.currentTarget;
            target.classList.add("spin-animation");
            api.getBalances()
                .then((balances) => dispatch({ type: ActionType.FETCH_DATA, balances: balances }))
                .catch((e) => {
                    console.log(`Failed to refresh balances, reusing existing data: ${e}`);
                    dispatch({ type: ActionType.REUSE_EXISTING_DATA });
                });
            setTimeout(() => target.classList.remove("spin-animation"), 1000);
        },
        [api, dispatch]
    );

    const currencyBalances = useMemo(
        () =>
            balances
                .filter((b) => displayedBalances.includes(b.currency))
                .map((b) => <CurrencyBalance currency={b.currency} value={b.amount.value} key={b.currency} />),
        [balances, displayedBalances]
    );

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
                    <SettingsModal balances={balances} displayedBalances={displayedBalances} />
                </Modal>
                {currencyBalances}
            </div>
        </div>
    );
};
