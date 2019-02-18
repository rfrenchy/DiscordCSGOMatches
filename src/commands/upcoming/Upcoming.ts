import moment from "moment";
import FullMatch from "hltv/lib/models/FullMatch";

import { ICommand } from "../ICommand";
import { getMatches } from "../../fetcher/fetcher";
import { RichEmbed } from "discord.js";
import { HLTV } from "hltv";
import UpcomingMatch from "hltv/lib/models/UpcomingMatch";
export class Upcoming implements ICommand {

	public usageText: string = "";

	public keyword: string = "!upcoming";

	public async execute(): Promise<RichEmbed[]> {
		try {
			const matches = await getMatches();

			const upcomingMatches = matches
				.filter((match) => !match.live)
				.filter((match) => {
					const upcomingMatch = match as UpcomingMatch;
					const isToday = upcomingMatch.date && moment(upcomingMatch.date).diff(moment(), "days") === 0;
					return isToday;
				})
				.slice(0, 5)

			const detailedUpcomingMatches = await Promise.all(upcomingMatches.map(async (match) => await HLTV.getMatch({ id: match.id })));

			const embeds = detailedUpcomingMatches
				.map((match) => new RichEmbed()
					.setAuthor(this.author(match))
					.setDescription(this.startTime(match))
				);

			return embeds || [];
		}
		catch (error) {
			return [new RichEmbed().setDescription("unable to find upcoming matches")];
		}

	}

	private author = (match: FullMatch): string => {
		const team1Name = (match.team1 && match.team1.name) || "Unknown";
		const team2Name = (match.team2 && match.team2.name) || "Unknown";

		return `${team1Name} vs ${team2Name}`
	}

	private startTime(match: FullMatch): string {
		const startTime = moment(match.date).format("LTS");
		const timeUntil = moment(match.date).fromNow();

		return `**Starts**: ${startTime} *(${timeUntil})*`;
	}
}