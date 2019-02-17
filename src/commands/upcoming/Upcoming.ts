import moment from "moment";

import { ICommand } from "../ICommand";
import { getMatches } from "../../fetcher/fetcher";
import { RichEmbed } from "discord.js";
import { HLTV } from "hltv";
import FullMatch from "hltv/lib/models/FullMatch";
export class Upcoming implements ICommand {

	public usageText: string = "";

	public keyword: string = "!upcoming";

	public async execute(): Promise<RichEmbed[]> {
		const matches = await getMatches();
		const upcomingMatches = matches.filter((match) => !match.live);
		const detailedUpcomingMatches = await Promise.all(upcomingMatches.map(async (match) => await HLTV.getMatch({ id: match.id })));

		const embeds = detailedUpcomingMatches
			.filter((match) => moment(match.date).diff(moment(), "days") === 0) // Get only todays matches
			.map((match) => new RichEmbed()
				.setAuthor(this.author(match)));

		return embeds || [];
	}

	public author = (match: FullMatch): string => {
		const team1Name = (match.team1 && match.team1.name) || "Unknown";
		const team2Name = (match.team2 && match.team2.name) || "Unknown";

		// const prefix = GRAND_FINAL_REGEX.test(match.additionalInfo) ? TROPHY_EMOJI + " " : "";
		// const suffix = STAR_EMOJI.repeat(match.stars)

		return `${team1Name} vs ${team2Name}`

		// return `${prefix}${team1Name} vs ${team2Name} ${suffix}`
	}
}