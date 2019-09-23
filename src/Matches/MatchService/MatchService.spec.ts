import { MatchService } from "./MatchService";
import { HLTV } from "hltv";

import UpcomingMatch from "hltv/lib/models/UpcomingMatch";
import FullMatch from "hltv/lib/models/FullMatch";
import MapSlug from "hltv/lib/enums/MapSlug";

const MOCK_DEFAULT_UPCOMING_MATCH: UpcomingMatch = {
	id: 12335,
	stars: 2,
	live: false
};

const TEAM_NAMES = {
	1: "Cloud9",
	2: "Faze",
	3: "NRG",
	4: "Complexity",
	5: "Astralis",
	6: "Liquid",
	7: "NaVi",
	8: "Avangar",
	9: "NiP",
	10: "Tyloo",
	11: "Fnatic",
	12: "Ghost",
	13: "Renegades",
	14: "Envyus",
	15: "G2",
	16: "Vitality",
	17: "Mibr",
	18: "ENCE",
	19: "BIG",
	20: "Virtus Pro"
};

const CreateMockUpcomingMatch = (options?: Partial<UpcomingMatch>): UpcomingMatch => {
	return Object.assign(
		{},
		{
			...{
				id: 12335,
				stars: 2,
				live: false
			},
			...options
		}
	);
};

const CreateMockFullMatch = (options?: Partial<FullMatch>): FullMatch => {
	return Object.assign(
		{},
		{
			...{
				...MOCK_DEFAULT_UPCOMING_MATCH,
				additionalInfo: "",
				maps: [{ name: MapSlug.Mirage, result: "win for Faze" }],
				streams: [],
				demos: [],
				hasScorebot: false,
				date: 1550408400000,
				format: "",
				event: { name: "" }
			},
			...options
		}
	);
};

describe("The MatchService", () => {
	const matchService = new MatchService();

	describe("has a matches method that", () => {
		const getMatchesSpy = jest.spyOn(HLTV, "getMatches");
		const getMatchSpy = jest.spyOn(HLTV, "getMatch");

		it("returns an empty array if there are no matches", async () => {
			getMatchesSpy.mockResolvedValueOnce([]);
			expect((await matchService.matches()).length).toBe(0);
		});

		it("returns an empty array if the request errors", async () => {
			getMatchSpy.mockRejectedValueOnce("borked");
			expect((await matchService.matches()).length).toBe(0);
		});

		describe("when matches are retrieved", () => {
			const setupRequestSpies = (numberOfMatches: number) => {
				const teams = Object.values(TEAM_NAMES).slice(0, numberOfMatches);
				getMatchesSpy.mockResolvedValueOnce(
					teams.map(name => CreateMockUpcomingMatch({ team1: { name: name } }))
				);
				teams.forEach(name =>
					getMatchSpy.mockResolvedValueOnce(CreateMockFullMatch({ team1: { name } }))
				);
			};

			it.each([[1, 1], [2, 2], [3, 3], [5, 5], [10, 10], [20, 20]])(
				"should return all matches available",
				async (matches, result) => {
					setupRequestSpies(matches);
					expect((await matchService.matches()).length).toBe(result);
				}
			);
		});
	});
});
