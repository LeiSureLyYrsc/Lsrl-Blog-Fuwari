import donateData from "./donate.json";

export interface DonateItem {
	name: string;
	avatar?: string;
	number: string;
}

export const donateList: DonateItem[] = donateData;
