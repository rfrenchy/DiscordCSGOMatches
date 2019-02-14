import { ILiveMatch } from "../main";
import { HLTV } from "hltv";

const getLiveMatches = async (): Promise<ILiveMatch[]> => {
	const matches = await HLTV.getMatches();
	const liveMatches = await Promise.all(matches
		.filter((match) => match.live)
		.map(async (match) => {
			const liveMatch = await HLTV.getMatch({ id: match.id });

			return { stars: match.stars, ...liveMatch };
		}));

	return liveMatches;
}