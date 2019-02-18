import moment from "moment";
import mockdate from "mockdate";

import { Upcoming } from "./Upcoming";
import { HLTV } from "hltv";
import { CreateMockUpcomingMatch, CreateMockFullMatch } from "../../../__test__/MockUpcomingData";

const MOCK_DATES = [
	1550408400000, // 17 FEB 2019
	1550415600000, // 17 FEB 2019
	1550653200000, // 20 FEB 2019
	1552579200000  // 14 FEB 2019
]

const MOCK_CURRENT_DATE = "2019-02-17T12:55:10.985" // 17 FEB 2019

describe("An 'Upcoming' command", () => {

	const upcoming = new Upcoming();

	beforeEach(() => {
		// Mock the current date to be fixed so the tests don't fail in the future.
		mockdate.set(MOCK_CURRENT_DATE);
	})

	describe("returns a RichEmbed", () => {
		it("of all upcoming matches for the current day", async () => {

			jest.spyOn(HLTV, "getMatches").mockResolvedValue(MOCK_DATES.map((date) => CreateMockUpcomingMatch({ date })));

			const getMatchSpy = jest.spyOn(HLTV, "getMatch");

			MOCK_DATES.forEach((date) => getMatchSpy.mockResolvedValueOnce(CreateMockFullMatch({ date })))

			const embeds = await upcoming.execute();

			expect(embeds.length).toBe(2);
		});

		it("limited to a return a maximum of 5 matches at once", () => {

		});

		it("with a title containing the teams playing", async () => {
			jest.spyOn(HLTV, "getMatches").mockResolvedValue([CreateMockUpcomingMatch({ date: MOCK_DATES[0] })]);

			const fullMatch = CreateMockFullMatch({
				team1: { name: "NiP" },
				team2: { name: "ViCi" },
				date: MOCK_DATES[0]
			});

			jest.spyOn(HLTV, "getMatch").mockResolvedValue(fullMatch);

			const embeds = await upcoming.execute();
			const title = embeds[0].author && embeds[0].author.name;

			expect(title).toContain("NiP vs ViCi");
		});

		it("showing the start time of the match", async () => {
			jest.spyOn(HLTV, "getMatches").mockResolvedValue([CreateMockUpcomingMatch({ date: MOCK_DATES[0] })]);
			jest.spyOn(HLTV, "getMatch").mockResolvedValue(CreateMockFullMatch({ date: MOCK_DATES[0] }));

			const embeds = await upcoming.execute();
			const description = embeds[0].description;

			const expectedTimeMessage = `**Starts**: 1:00:00 PM *(in 5 minutes)*`

			expect(description).toContain(expectedTimeMessage);
		});
	});
})

