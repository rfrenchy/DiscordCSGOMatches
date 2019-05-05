import { CreateMockUpcomingMatch, CreateMockFullMatch } from "../../src/commands/upcoming/MockUpcomingData";
import { Fetcher } from "./Fetcher";
import { HLTV } from "hltv";
import { TEAM_NAMES } from "../../test/MockTeamNames";

describe("a fetcher", () => {
	const fetcher = new Fetcher();

	describe("has a matches method that", () => {
		// Spy on network requests as we don't want api calls to outside locations during testing.
		const getMatchesSpy = jest.spyOn(HLTV, "getMatches");
		const getMatchSpy = jest.spyOn(HLTV, "getMatch");

		it("returns an empty array if there are no matches", async () => {
			getMatchesSpy.mockResolvedValueOnce([]);
			expect((await fetcher.matches()).length).toBe(0);
		});

		it("returns an empty array if the request errors", async () => {
			getMatchSpy.mockRejectedValueOnce("borked");
			expect((await fetcher.matches()).length).toBe(0);
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
					expect((await fetcher.matches()).length).toBe(result);
				}
			);
		});
	});
});
