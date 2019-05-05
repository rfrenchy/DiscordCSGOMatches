import { CreateMockFullMatch } from "./MockLiveData";
import { Live } from "./Live";
import { RichEmbed } from "discord.js";

describe("A 'Live' command", () => {
	const live = new Live();

	describe("has a buildEmbed method that", () => {
		it("should return undefined if not supplied with a match", () => {
			expect(live.buildEmbed(null as any)).toBe(undefined);
		});

		describe("when supplied with a match", () => {
			it("should return a RichEmbed", () => {
				expect(live.buildEmbed(CreateMockFullMatch())).toBeInstanceOf(RichEmbed);
			});

			describe("the returned RichEmbed", () => {
				describe("has an author section", () => {
					describe("with a main title that", () => {
						const createEmbedWithTeamNames = (name1: string, name2: string) => {
							const match = CreateMockFullMatch({
								team1: { name: name1 },
								team2: { name: name2 }
							});
							const embed = live.buildEmbed(match);

							return embed && embed.author && embed.author.name;
						};

						it.each`
							team1       | team2     | result
							${"Cloud9"} | ${"Faze"} | ${"Cloud9 vs Faze"}
							${""}       | ${"Faze"} | ${"Unknown vs Faze"}
							${"Cloud9"} | ${""}     | ${"Cloud9 vs Unknown"}
							${""}       | ${""}     | ${"Unknown vs Unknown"}
						`(
							"should have $result when teams are: $team1 and $team2",
							({ team1, team2, result }) => {
								expect(
									createEmbedWithTeamNames(team1, team2)
								).toContain(result);
							}
						);

						it("should show 'team1' vs 'team2' if both team names are provided", () => {
							expect(createEmbedWithTeamNames("Cloud9", "Faze")).toContain(
								"Cloud9 vs Faze"
							);
						});

						it("should show unknown vs 'team2' if the first team name is not provided", () => {
							expect(createEmbedWithTeamNames("", "Faze")).toContain(
								"Unknown vs Faze"
							);
						});

						it("should 'team1' vs unknown if the second team name is not provided", () => {
							expect(createEmbedWithTeamNames("Cloud9", "")).toContain(
								"Cloud9 vs Unknown"
							);
						});

						it("unknown vs unknown if no team names are provided", () => {
							expect(createEmbedWithTeamNames("", "")).toContain(
								"Unknown vs Unknown"
							);
						});
					});

					describe("with a stars suffix that", () => {
						const createEmbedWithStars = (stars: number) => {
							const match = CreateMockFullMatch({ stars });
							const embed = live.buildEmbed(match);
							const name = embed && embed.author && embed.author.name;

							return name || "";
						};

						it("should have 0 stars if the match has no stars", () => {
							expect(createEmbedWithStars(0)).not.toContain("⭐");
						});

						it("should have 1 stars if the match has 1 star", () => {
							expect(createEmbedWithStars(1)).toContain("⭐");
						});

						it("should have 2 stars if the match has 2 star", () => {
							expect(createEmbedWithStars(2)).toContain("⭐⭐");
						});

						it("should have 5 stars if the match has 5 star", () => {
							expect(createEmbedWithStars(5)).toContain("⭐⭐⭐⭐⭐");
						});
					});

					describe("with a prefix that", () => {
						const createEmbedWithAdditionalInfo = (additionalInfo: string) => {
							const match = CreateMockFullMatch({ additionalInfo });
							const embed = live.buildEmbed(match);
							const name = embed && embed.author && embed.author.name;

							return name || "";
						};

						it("should be a trophy emoji if the additionalInfo contains 'grand final'", () => {
							expect(createEmbedWithAdditionalInfo("Grand Final")).toContain(
								"🏆"
							);
						});
					});
				});
			});
		});
	});
});
