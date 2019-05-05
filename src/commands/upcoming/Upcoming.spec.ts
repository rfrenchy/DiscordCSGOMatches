import mockdate from "mockdate";

import { CreateMockFullMatch } from "./MockUpcomingData";
import { MOCK_DATES } from "../../../test/MockDates";
import { RichEmbed } from "discord.js";
import { Upcoming } from "./Upcoming";
import moment = require("moment");

describe("An 'Upcoming' command", () => {
	const upcoming = new Upcoming();

	describe("has a buildEmbed method that", () => {
		it("should return undefined if not supplied with a match", () => {
			expect(upcoming.buildEmbed(undefined as any)).toBe(undefined);
		});

		it("should return a RichEmbed if supplied with match", () => {
			expect(upcoming.buildEmbed(CreateMockFullMatch())).toBeInstanceOf(RichEmbed);
		});

		describe("returns a RichEmbed that", () => {
			describe("has an 'author' section that", () => {
				const createEmbedWithTeamNames = (name1: string, name2: string) => {
					const match = CreateMockFullMatch({
						team1: { name: name1 },
						team2: { name: name2 }
					});
					const embed = upcoming.buildEmbed(match);

					return embed && embed.author && embed.author.name;
				};

				it.each([
					["Cloud9", "Faze", "Cloud9 vs Faze"],
					["", "Faze", "Unknown vs Faze"],
					["Cloud9", "", "Cloud9 vs Unknown"],
					["", "", "Unknown vs Unknown"]
				])("should have $result when teams are: $team1 and $team2", (team1, team2, result) => {
					expect(createEmbedWithTeamNames(team1, team2)).toContain(result);
				});
			});

			describe("has a 'description' section", () => {
				const createEmbedWithDate = (date: number) => {
					const match = CreateMockFullMatch({ date });
					const embed = upcoming.buildEmbed(match);
					return embed && embed.description;
				};

				const MOCK_CURRENT_DATE = "2019-02-17T12:55:10.985";
				const FORMATTED_CURRENT_DATE = moment(MOCK_CURRENT_DATE);

				beforeEach(() => {
					// Mock the current date to be fixed so the tests don't fail in the future.
					mockdate.set(MOCK_CURRENT_DATE);
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

				it.each([
					[MOCK_DATES["Feb17:1300"], "*(in 5 minutes)*"],
					[MOCK_DATES["Feb17:1500"], "*(in 2 hours)*"],
					[MOCK_DATES["Feb20"], "*(in 3 days)*"]
				])(
					`when the match starts $startTime and the current date is ${FORMATTED_CURRENT_DATE} the time until should display $timeUntil`,
					(startTime, timeUntil) => {
						expect(createEmbedWithDate(startTime)).toContain(timeUntil);
					}
				);
			});
		});
	});
});
