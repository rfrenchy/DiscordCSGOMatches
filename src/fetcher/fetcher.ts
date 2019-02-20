import { ILiveMatch } from "../main";
import { HLTV } from "hltv";
import UpcomingMatch from "hltv/lib/models/UpcomingMatch";
import LiveMatch from "hltv/lib/models/LiveMatch";

export const getLiveMatches = async (): Promise<ILiveMatch[]> => {
	const matches = await getMatches();
	const liveMatches = await Promise.all(
		matches
			.filter(match => match.live)
			.map(async match => {
				const liveMatch = await HLTV.getMatch({ id: match.id });

				return { stars: match.stars, ...liveMatch };
			})
	);

	return liveMatches;
};

export const getMatches = async (): Promise<(UpcomingMatch | LiveMatch)[]> => {
	return await HLTV.getMatches();
};
