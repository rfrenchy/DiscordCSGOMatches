import UpcomingMatch from "hltv/lib/models/UpcomingMatch";
import FullMatch from "hltv/lib/models/FullMatch";

export const MOCK_DEFAULT_UPCOMING_MATCH: UpcomingMatch = {
	id: 12335,
	stars: 2,
	live: false
};

export const MOCK_DEFAULT_FULL_MATCH: FullMatch = {
	...MOCK_DEFAULT_UPCOMING_MATCH,
	additionalInfo: "",
	maps: [],
	streams: [],
	demos: [],
	hasScorebot: false,
	date: 1550408400000,
	format: "",
	event: { name: "" }
};

export const CreateMockUpcomingMatch = (options?: Partial<UpcomingMatch>): UpcomingMatch => {
	return Object.assign({}, { ...MOCK_DEFAULT_UPCOMING_MATCH, ...options });
};

export const CreateMockFullMatch = (options?: Partial<FullMatch>): FullMatch => {
	return Object.assign({}, { ...MOCK_DEFAULT_FULL_MATCH, ...options });
};
