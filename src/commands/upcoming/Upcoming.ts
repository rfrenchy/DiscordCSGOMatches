import moment from "moment";
import FullMatch from "hltv/lib/models/FullMatch";
import UpcomingMatch from "hltv/lib/models/UpcomingMatch";

import { getMatches } from "../../fetcher/fetcher";
import { RichEmbed } from "discord.js";
import { HLTV } from "hltv";

const NO_MATCH_FOUND_EMBED = [new RichEmbed().setDescription("unable to find upcoming matches")];

export class Upcoming {
	public usageText: string = "";

	public keyword: string = "!upcoming";

	/**
	 * Builds an 'Upcoming Match' RichEmbed containing data pertaining to the match.
	 * @param match the match to parse and build the RichEmbed from.
	 */
	public buildEmbed(match: FullMatch): RichEmbed | undefined {
		if (!match) {
			return;
		}

		const description = this.startTime(match);
		const embed = new RichEmbed().setAuthor(this.author(match)).setDescription(description);

		return embed;
	}

	public async execute(): Promise<RichEmbed[]> {
		try {
			const matches = await getMatches();

			const upcomingMatches = matches
				.filter(match => !match.live)
				.filter(match => {
					const upcomingMatch = match as UpcomingMatch;
					const isToday =
						upcomingMatch.date &&
						moment(upcomingMatch.date).diff(moment(), "days") === 0;
					return isToday;
				});

			const detailedUpcomingMatches = await Promise.all(
				upcomingMatches.map(async match => await HLTV.getMatch({ id: match.id }))
			);

			const embeds = detailedUpcomingMatches.map(match =>
				new RichEmbed().setAuthor(this.author(match)).setDescription(this.startTime(match))
			);

			return embeds.length > 0 ? embeds : NO_MATCH_FOUND_EMBED;
		} catch (error) {
			return NO_MATCH_FOUND_EMBED;
		}
	}

	private author(match: FullMatch): string {
		const team1Name = (match.team1 && match.team1.name) || "Unknown";
		const team2Name = (match.team2 && match.team2.name) || "Unknown";

		return `${team1Name} vs ${team2Name}`;
	}

	private startTime(match: FullMatch): string {
		const startTime = moment(match.date).format("MMM Do HH:mm");
		const timeUntil = moment(match.date).fromNow();

		return `**Starts**: ${startTime} *(${timeUntil})*`;
	}
}
