import moment from "moment";
import FullMatch from "hltv/lib/models/FullMatch";

import { RichEmbed } from "discord.js";

export class Upcoming {
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
