import { CreateMockUpcomingMatch, CreateMockFullMatch } from "../../src/commands/upcoming/MockUpcomingData";
import { Fetcher } from "./Fetcher";
import { HLTV } from "hltv";
import { TEAM_NAMES } from "../../test/MockTeamNames";

describe("a fetcher", () => {
	const fetcher = new Fetcher();

	describe("has a matches function that", () => {
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

			it("should return one match if one match is found", async () => {
				setupRequestSpies(1);
				expect((await fetcher.matches()).length).toBe(1);
			});

			it("should return three matches if three matches are found", async () => {
				setupRequestSpies(3);
				expect((await fetcher.matches()).length).toBe(3);
			});

			it("should return ten matches if ten matches are found", async () => {
				setupRequestSpies(10);
				expect((await fetcher.matches()).length).toBe(10);
			});

			it("should return twenty matches if twenty matches are found", async () => {
				setupRequestSpies(20);
				expect((await fetcher.matches()).length).toBe(20);
			});
		});
	});
});
