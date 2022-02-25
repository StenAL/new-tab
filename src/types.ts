export interface BankDetails {
    id: number;
    currency: string;
    bankCode: string;
}
export interface Amount {
    value: number;
    currency: string;
}

/**
 * Returned by TransferWise API
 */
export interface AccountInfo {
    id: number;
    profileId: number;
    active: boolean;
    balances: Balance[];
}

export interface Balance {
    id: number;
    balanceType: string;
    currency: string;
    amount: Amount;
    reservedAmount: Amount;
    bankDetails: BankDetails;
}
