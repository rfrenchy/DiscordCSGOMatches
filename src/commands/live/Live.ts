import { RichEmbed } from "discord.js";
import { ILiveMatch } from "../../Main";
import MapResult from "hltv/lib/models/MapResult";
import Stream from "hltv/lib/models/Stream";

const GRAND_FINAL_REGEX = /Grand Final/gim;
const HLTV_URL = "https://www.hltv.org/";

const StreamOptions = {
	maxNameLength: 25,
	maxShown: 5
};

export class Live {
	public buildEmbed(match: ILiveMatch): RichEmbed | undefined {
		if (!match) {
			return;
		}

		const embed = new RichEmbed()
			.setAuthor(CreateMatchHeading(match))
			.setDescription(CreateMatchDescription(match))
			.setTimestamp(new Date(match.date))
			.setFooter("Started");

		embed.addField("Maps", maps(match.maps), true);
		embed.addField("Streams", streams(match.streams), true);
		embed.setColor("#EF6C00");

		return embed;
	}
}

const CreateMatchHeading = (match: ILiveMatch): string => {
	const team1Name = (match.team1 && match.team1.name) || "Unknown";
	const team2Name = (match.team2 && match.team2.name) || "Unknown";

	const prefix = GRAND_FINAL_REGEX.test(match.additionalInfo) ? "🏆 " : "";
	const suffix = "⭐".repeat(match.stars);

	return `${prefix} ${team1Name} vs ${team2Name} ${suffix}`.trimRight();
};

const CreateMatchDescription = (match: ILiveMatch): string => {
	const matchBracket = match.additionalInfo ? `_${match.additionalInfo.replace("*", "")}_\n\n` : "\n";

	const description = `\n\n**${match.event && match.event.name}**\n`.concat(matchBracket).concat("\n\n");

	return description;
};

const maps = (mapResult: MapResult[]): string => {
	return mapResult.reduce((text, map) => text.concat(`**${map.name}** : ${map.result}\n`), "");
};

const streams = (matchStreams: Stream[]): string => {
	let streams = matchStreams;

	if (streams.length === 0) {
		return "💩 no streams...";
	}

	if (streams.length > StreamOptions.maxShown) {
		return ConvertStreamInfoToText(streams.slice(0, StreamOptions.maxShown));
	}

	return ConvertStreamInfoToText(streams);
};

const ConvertStreamInfoToText = (streams: Stream[]): string =>
	streams.reduce((textSegment, stream) => {
		// Have to do some extra logic in order to get the correct URL for HLTV.
		const link = stream.name.toUpperCase() !== "HLTV LIVE" ? stream.link : HLTV_URL.concat(stream.link);

		let streamName = stream.name;

		if (streamName.length >= StreamOptions.maxNameLength) {
			streamName = streamName.substr(0, StreamOptions.maxNameLength - "...".length).concat("...");
		}

		return textSegment.concat(`[${streamName}](${link})\n`);
	}, "");
