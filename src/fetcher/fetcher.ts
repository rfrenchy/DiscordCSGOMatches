import { ILiveMatch } from "../main";
import { HLTV } from "hltv";
import UpcomingMatch from "hltv/lib/models/UpcomingMatch";
import LiveMatch from "hltv/lib/models/LiveMatch";

interface IFetchOptions {
	live?: boolean;
}

// Poll every minute.
const POLL_RATE = 60000;

export class Fetcher {
	public async matches(options: IFetchOptions = {}): Promise<(ILiveMatch)[]> {
		try {
			const matches = await getMatches();
			const detailedMatches = await this.fullMatchDetails(matches);

			return detailedMatches;
		} catch {
			return [];
		}
	}

	private async fullMatchDetails(matches: (UpcomingMatch | LiveMatch)[]): Promise<ILiveMatch[]> {
		// Change return type to not ILIVEMATCH, isn't necessarily live
		const fullMatches = await Promise.all(
			matches.map(async match => {
				return { stars: match.stars, ...(await HLTV.getMatch({ id: match.id })) };
			})
		);

		return fullMatches;
	}
}

export const getLiveMatches = async (): Promise<ILiveMatch[]> => {
	const matches = await getMatches();

	const liveMatches = await Promise.all(
		matches
			.filter(match => match.live)
			.map(async match => {
				return { stars: match.stars, ...(await HLTV.getMatch({ id: match.id })) };
			})
	);

	return liveMatches;
};

export const getMatches = async (): Promise<(UpcomingMatch | LiveMatch)[]> => {
	return await HLTV.getMatches();
};
