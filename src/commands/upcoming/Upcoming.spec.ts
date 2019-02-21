import mockdate from "mockdate";

import { Upcoming } from "./Upcoming";
import { CreateMockFullMatch } from "./MockUpcomingData";
import { MOCK_DATES } from "../../../test/MockDates";
import { RichEmbed } from "discord.js";

describe("An 'Upcoming' command", () => {
	const upcoming = new Upcoming();

	describe("has a buildEmbed methods that", () => {
		it("should return undefined if not supplied with a match", () => {
			expect(upcoming.buildEmbed(undefined as any)).toEqual(undefined);
		});

		it("should return a RichEmbed if supplied with a Full Match", () => {
			expect(upcoming.buildEmbed(CreateMockFullMatch())).toBeInstanceOf(RichEmbed);
		});

		describe("returns a RichEmbed that", () => {
			describe("has an 'author' section that", () => {
				const createUpcomingEmbedWithTeamNames = (name1: string, name2: string) => {
					const match = CreateMockFullMatch({
						team1: { name: name1 },
						team2: { name: name2 }
					});
					const embed = upcoming.buildEmbed(match);

					return embed && embed.author && embed.author.name;
				};

				it("should show 'team1' vs 'team2' if both team names are provided", () => {
					expect(createUpcomingEmbedWithTeamNames("Cloud9", "Faze")).toBe(
						"Cloud9 vs Faze"
					);
				});

				it("should show unknown vs 'team2' if the first team name is not provided", () => {
					expect(createUpcomingEmbedWithTeamNames("", "Faze")).toBe("Unknown vs Faze");
				});

				it("should 'team1' vs unknown if the second team name is not provided", () => {
					expect(createUpcomingEmbedWithTeamNames("Cloud9", "")).toBe(
						"Cloud9 vs Unknown"
					);
				});

				it("unknown vs unknown if no team names are provided", () => {
					expect(createUpcomingEmbedWithTeamNames("", "")).toBe("Unknown vs Unknown");
				});
			});

			describe("has a 'description' section", () => {
				const createEmbedWithDate = (date: number) => {
					const match = CreateMockFullMatch({ date });
					const embed = upcoming.buildEmbed(match);
					return embed && embed.description;
				};

				beforeEach(() => {
					// Mock the current date to be fixed so the tests don't fail in the future.
					mockdate.set("2019-02-17T12:55:10.985");
				});

				it("should contain a 'Start' label", () => {
					expect(createEmbedWithDate(MOCK_DATES["Feb17:1300"])).toContain("**Starts**");
				});

				it("should show the month the match starts", () => {
					expect(createEmbedWithDate(MOCK_DATES["Feb17:1300"])).toContain("Feb");
				});

				it("should show the day the match starts", () => {
					expect(createEmbedWithDate(MOCK_DATES["Feb17:1300"])).toContain("17th");
				});

				it("should show what time the match starts", () => {
					expect(createEmbedWithDate(MOCK_DATES["Feb17:1300"])).toContain("13:00");
				});

				it("when the match starts within the hour should show how long until the match starts in minutes", () => {
					expect(createEmbedWithDate(MOCK_DATES["Feb17:1300"])).toContain(
						"*(in 5 minutes)*"
					);
				});

				it("when the match starts within a day should show how long the match stars in hours", () => {
					expect(createEmbedWithDate(MOCK_DATES["Feb17:1500"])).toContain(
						"*(in 2 hours)*"
					);
				});

				it("when the match starts within a week should show how long the match starts in days", () => {
					expect(createEmbedWithDate(MOCK_DATES["Feb20"])).toContain("*(in 3 days)*");
				});
			});
		});
	});
});
