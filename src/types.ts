export interface Amount {
    value: number;
    currency: string;
}

/**
 * Returned by TransferWise API (GET /v2/profiles)
 */
export interface Profile {
    id: number;
    userId: number;
    type: string;
    firstName: string;
    lastName: string;
}

/**
 * Returned by TransferWise API (GET /v3/profiles/{profile-id}/balances?types=STANDARD)
 */
export interface Balance {
    id: number;
    type: string;
    currency: string;
    amount: Amount;
    reservedAmount: Amount;
}
