import LiveMatch from "hltv/lib/models/LiveMatch";
import MapSlug from "hltv/lib/enums/MapSlug";

export const MOCK_LIVE_MATCH: LiveMatch = {
	id: 12345,
	team1: { name: "Cloud9" },
	team2: { name: "Faze" },
	format: "bo1",
	event: { name: "Boston Major 2018" },
	maps: [MapSlug.Mirage, MapSlug.Overpass, MapSlug.Inferno],
	stars: 5,
	live: true
};

export const MOCK_FULL_MATCH: any = {
	...MOCK_LIVE_MATCH,
	maps: [{ name: MapSlug.Mirage, result: "win for Faze" }],
	date: 1512312314,
	additionalInfo: "Major Grand Final",
	streams: [],
	demos: [],
	hasScorebot: true
};

export const CreateMockLiveMatch = (liveMatchOptions?: Partial<LiveMatch>): LiveMatch => {
	return { ...MOCK_LIVE_MATCH, ...liveMatchOptions };
};

export const CreateMockFullMatch = (fullMatchOptions?: Partial<any>): any => {
	return { ...MOCK_FULL_MATCH, ...fullMatchOptions };
};
