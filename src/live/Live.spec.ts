import { Live } from "./Live";
import { HLTV } from "hltv";
import LiveMatch from "hltv/lib/models/LiveMatch";
import MapSlug from "hltv/lib/enums/MapSlug";
import FullMatch from "hltv/lib/models/FullMatch";
import { ILiveMatch } from "../main";


describe("A 'live' function", () => {
	describe("returns a RichEmbed", () => {
		it("for each live match", async () => {
			const matchAmount = 3;
			const mockMatches = [];

			for (let i = 0; i < matchAmount; i++) {
				mockMatches.push(CreateMockLiveMatch());
			}

			jest.spyOn(HLTV, "getMatches").mockResolvedValue(mockMatches);
			jest.spyOn(HLTV, "getMatch").mockResolvedValue(CreateMockFullMatch());

			const embeds = await Live();

			expect(embeds.length).toBe(3);
		});

		describe("with a title containing", () => {
			it("'team1' vs 'team2'", async () => {
				const mockLiveOptions: Partial<LiveMatch> = {
					team1: { name: "Cloud9" }, team2: { name: "Faze" }
				}

				jest.spyOn(HLTV, "getMatches").mockResolvedValue([CreateMockLiveMatch(mockLiveOptions)]);
				jest.spyOn(HLTV, "getMatch").mockResolvedValue(CreateMockFullMatch(mockLiveOptions as Partial<FullMatch>));

				const embeds = await Live();
				const title = embeds[0].author && embeds[0].author.name;

				expect(title).toContain("Cloud9 vs Faze")
			});

			it("the star rating of the match", async () => {
				const mockLiveOptions: Partial<ILiveMatch> = {
					team1: { name: "Cloud9" }, team2: { name: "Faze" }, stars: 5
				}

				jest.spyOn(HLTV, "getMatches").mockResolvedValue([MOCK_LIVE_MATCH]);
				jest.spyOn(HLTV, "getMatch").mockResolvedValue(CreateMockFullMatch(mockLiveOptions));

				const embeds = await Live();
				const title = embeds[0].author && embeds[0].author.name;

				expect(title).toContain("⭐⭐⭐⭐⭐")
			});

		})

		it("with a maps field displaying the maps", async () => {
			const mockData: Partial<FullMatch> = {
				maps: [
					{ name: MapSlug.Cache, result: "4:6" },
					{ name: MapSlug.Cobblestone, result: "" },
					{ name: MapSlug.Train, result: "" }
				]
			}

			jest.spyOn(HLTV, "getMatch").mockResolvedValue(CreateMockFullMatch(mockData));

			const embeds = await Live();
			const mapField = embeds[0].fields && embeds[0].fields.find((field) => field.name.toLowerCase() === "maps");

			if (mapField) {
				expect(mapField.name).toBe("Maps");
				expect(mapField.value).toContain(`**${MapSlug.Cache}** : `);
				expect(mapField.value).toContain(`**${MapSlug.Cobblestone}** : `);
				expect(mapField.value).toContain(`**${MapSlug.Train}** : `);
			}
		});
	})
});


const CreateMockLiveMatch = (liveMatchOptions?: Partial<LiveMatch>): LiveMatch => {
	return { ...MOCK_LIVE_MATCH, ...liveMatchOptions };
}

const CreateMockFullMatch = (fullMatchOptions?: Partial<FullMatch>): FullMatch => {
	return { ...MOCK_FULL_MATCH, ...fullMatchOptions };
}

const MOCK_LIVE_MATCH: LiveMatch = {
	id: 12345,
	team1: { name: "Cloud9" },
	team2: { name: "Faze" },
	format: "bo1",
	event: { name: "Boston Major 2018" },
	maps: [MapSlug.Mirage, MapSlug.Overpass, MapSlug.Inferno],
	stars: 5,
	live: true
}

const MOCK_FULL_MATCH: FullMatch = {
	...MOCK_LIVE_MATCH,
	maps: [{ name: MapSlug.Mirage, result: "win for Faze" }],
	date: 1512312314,
	additionalInfo: "Major Grand Final",
	streams: [],
	demos: [],
	hasScorebot: true
}