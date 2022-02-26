export enum LocalStorageKey {
    TRANSFERWISE_PROFILE_ID = "transferwiseProfileId",
    BALANCES = "balances",
    BALANCE_FETCH_TIME = "balanceFetchTime",
    DISPLAYED_BALANCES = "displayedBalances",
}

export const getFromLocalStorage = (key: LocalStorageKey, defaultValue: string | (() => string) = ""): string => {
    let value = localStorage.getItem(key);
    if (value === null) {
        if (typeof defaultValue === "string") {
            return defaultValue;
        }
        return defaultValue();
    }
    return value;
};

export const setLocalStorage = (key: LocalStorageKey, value: string) => {
    localStorage.setItem(key, value);
};
