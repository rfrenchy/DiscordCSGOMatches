import moment from "moment";
import FullMatch from "hltv/lib/models/FullMatch";
import MapResult from "hltv/lib/models/MapResult";
import Stream from "hltv/lib/models/Stream";

import { RichEmbed } from "discord.js";

const HLTV_URL = "https://www.hltv.org/";

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

		embed.addField("Maps", maps(match.maps), true);
		embed.addField("Streams", streams(match.streams), true);
		embed.setColor("#1976D2");

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

const maps = (mapResult: MapResult[]): string => {
	return mapResult.reduce((text, map) => text.concat(`**${map.name}** : ${map.result}\n`), "");
};
