import { CreateMockUpcomingMatch, CreateMockFullMatch } from "../../Commands/upcoming/MockUpcomingData";
import { MatchService } from "./MatchService";
import { HLTV } from "hltv";
import { TEAM_NAMES } from "../../../test/Common/MockTeamNames";

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
