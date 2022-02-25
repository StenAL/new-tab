import { FunctionComponent } from "react";

interface CurrencyBalanceProps {
    currency: string;
    value: number;
}
export const CurrencyBalance: FunctionComponent<CurrencyBalanceProps> = ({
    currency,
    value,
}) => {
    const getFormattedValueForCurrency = (currency, value) => {
        const decimalFormattedValue = Number(value).toFixed(2);
        switch (currency) {
            case "EUR":
                return decimalFormattedValue + " €";
            case "GBP":
                return "£" + decimalFormattedValue;
            case "USD":
                return "$" + decimalFormattedValue;
            default:
                return decimalFormattedValue + " " + currency;
        }
    };

    return (
        <div key={currency} className={"currency-balance"}>
            <div
                className={`currency-flag balance-flag currency-flag-${currency.toLowerCase()}`}
            />
            <p>{getFormattedValueForCurrency(currency, value)}</p>
        </div>
    );
};
