export enum LocalStorageKey {
    TRANSFERWISE_PROFILE_ID = "transferwiseProfileId",
    BALANCES = "balances",
    BALANCE_FETCH_TIME = "balanceFetchTime",
    DISPLAYED_BALANCES = "displayedBalances",
}

export function getFromLocalStorage(key: LocalStorageKey): string | undefined;
export function getFromLocalStorage(key: LocalStorageKey, defaultValue: string): string;
export function getFromLocalStorage(key: LocalStorageKey, defaultValue?: string): string | undefined {
    let value = localStorage.getItem(key);
    if (value) {
        return value;
    }

    if (typeof defaultValue === "string") {
        return defaultValue;
    }

    return undefined;
}

export const setLocalStorage = (key: LocalStorageKey, value: string) => {
    localStorage.setItem(key, value);
};
