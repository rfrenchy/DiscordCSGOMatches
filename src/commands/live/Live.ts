// import { ICommand } from "../commands/ICommand";
import { RichEmbed } from "discord.js";
import { ILiveMatch } from "../../main";

import MapResult from "hltv/lib/models/MapResult";
import Stream from "hltv/lib/models/Stream";

const STAR_EMOJI = "⭐";
const TROPHY_EMOJI = "🏆";

const GRAND_FINAL_REGEX = /Grand Final/gim;
const HLTV_URL = "https://www.hltv.org/";
const NO_MATCHES_DEFAULT_MESSAGE = "😥 No Matches are currently being played.";

export const Live = async (): Promise<RichEmbed[]> => {
	const embeds = liveMatches.map(liveMatch => {
		const embed = new RichEmbed()
			.setDescription(description(liveMatch))
			.setTimestamp(new Date(liveMatch.date))
			.setFooter("Started")
			.setAuthor(author(liveMatch), "https://avatars2.githubusercontent.com/u/9454190?s=460&v=4");

		embed.addField("Maps", maps(liveMatch.maps), true);
		embed.addField("Streams", streams(liveMatch.streams), true);
		embed.setColor("#EF6C00");

		return embed;
	});

	return embeds || [];
};

const author = (match: ILiveMatch): string => {
	const team1Name = (match.team1 && match.team1.name) || "Unknown";
	const team2Name = (match.team2 && match.team2.name) || "Unknown";

	const prefix = GRAND_FINAL_REGEX.test(match.additionalInfo) ? TROPHY_EMOJI + " " : "";
	const suffix = STAR_EMOJI.repeat(match.stars);

	return `${prefix}${team1Name} vs ${team2Name} ${suffix}`;
};

const description = (match: ILiveMatch): string => {
	const matchBracket = match.additionalInfo ? `_${match.additionalInfo.replace("*", "")}_\n\n` : "\n";

	const description = `\n\n**${match.event && match.event.name}**\n`.concat(matchBracket).concat("\n\n");

	return description;
};

const maps = (mapResult: MapResult[]): string => {
	return mapResult.reduce((text, map) => text.concat(`**${map.name}** : ${map.result}\n`), "");
};

const streams = (matchStreams: Stream[]): string => {
	const MAX_STREAM_NAME_LENGTH = 25;
	const CUT_OFF_TEXT = "...";
	const CUT_OFF_LENGTH = MAX_STREAM_NAME_LENGTH - CUT_OFF_TEXT.length;
	const NO_STREAM_DEFAULT_TEXT = "💩 no streams...";

	let streams = matchStreams;

	if (streams.length === 0) {
		return NO_STREAM_DEFAULT_TEXT;
	}

	if (streams.length > 5) {
		streams = streams.slice(0, 5);
	}

	return streams.reduce((textSegment, stream) => {
		// Have to do some extra logic in order to get the correct url for hltv.
		const link = stream.name.toUpperCase() !== "HLTV LIVE" ? stream.link : HLTV_URL.concat(stream.link);

		let streamName = stream.name;

		if (streamName.length >= MAX_STREAM_NAME_LENGTH) {
			streamName = streamName.substr(0, CUT_OFF_LENGTH).concat("...");
		}

		return textSegment.concat(`[${streamName}](${link})\n`);
	}, "");
};
