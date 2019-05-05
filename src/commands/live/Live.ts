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

export class Live {
	public buildEmbed(match: ILiveMatch): RichEmbed | undefined {
		if (!match) {
			return;
		}

		const embed = new RichEmbed().setAuthor(author(match));

		return embed;
	}
}

const author = (match: ILiveMatch): string => {
	const team1Name = (match.team1 && match.team1.name) || "Unknown";
	const team2Name = (match.team2 && match.team2.name) || "Unknown";

	const prefix = GRAND_FINAL_REGEX.test(match.additionalInfo) ? TROPHY_EMOJI + " " : "";
	const suffix = STAR_EMOJI.repeat(match.stars);

	return `${prefix}${team1Name} vs ${team2Name} ${suffix}`.trimRight();
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
