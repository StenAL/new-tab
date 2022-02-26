import { createContext, useContext } from "react";
import { Balance, Profile } from "../types";
import { getFromLocalStorage, LocalStorageKey, setLocalStorage } from "./LocalStorageHelper";

export class ApiHelper {
    private readonly apiToken: string;
    private profileId: string | undefined;

    constructor(private readonly apiBaseUrl: string, apiToken: string | undefined) {
        if (!apiToken) {
            throw new Error(
                "No TransferWise API token found. Add an .env file or set REACT_APP_TRANSFERWISE_API_TOKEN if .env already exists"
            );
        }
        this.apiToken = apiToken;
    }

    public async getBalances(): Promise<Balance[]> {
        const profileId = await this.getProfileId();
        console.log(`Fetching balances for profile '${profileId}'`);
        const response = await fetch(`${this.apiBaseUrl}/v3/profiles/${profileId}/balances?types=STANDARD`, {
            headers: { Authorization: `Bearer ${this.apiToken}` },
        });
        return await response.json();
    }

    private async getProfileId(): Promise<string> {
        if (this.profileId) {
            return this.profileId;
        }
        const localStorageProfileId = getFromLocalStorage(LocalStorageKey.TRANSFERWISE_PROFILE_ID);
        if (localStorageProfileId) {
            this.profileId = localStorageProfileId;
            return localStorageProfileId;
        }

        console.log("Fetching TransferWise profile ID...");
        const profileResponse = await fetch(`${this.apiBaseUrl}/v2/profiles`, {
            headers: { Authorization: `Bearer ${this.apiToken}` },
        });
        const profileResponseArray: Profile[] = await profileResponse.json();
        const profileId = profileResponseArray[0].id.toString();

        console.log(`TransferWise profile id fetched: ${profileId}`);
        setLocalStorage(LocalStorageKey.TRANSFERWISE_PROFILE_ID, profileId);
        this.profileId = profileId;

        return profileId;
    }
}

const ApiContext = createContext<ApiHelper | undefined>(undefined);

export const useApiContext: () => ApiHelper = () => {
    const context = useContext(ApiContext);
    if (context === undefined) {
        throw new Error("useCount must be used within a CountProvider");
    }
    return context;
};

export const ApiContextProvider = ApiContext.Provider;
