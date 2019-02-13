
import Discord, { Message, RichEmbed } from "discord.js";
import HLTV from "hltv";
import FullMatch from "hltv/lib/models/FullMatch";
import Redis from "redis";

import { createInfo } from "./info";
import { Live } from "./src/live/Live";

require('dotenv').config();

const discordClient = new Discord.Client();

const port = 7519;
const host = "ec2-54-76-190-220.eu-west-1.compute.amazonaws.com"

const redisClient = Redis.createClient(port, host, { password: process.env.REDIS_PASSWORD });

redisClient.on('connect', function () {
	console.log('Connected to Redis...');
});

const LIVE_REGEX = /!live/gmi;
const INFO_REGEX = /!info/gmi;
const GET_REGEX = /!get/gmi;


export interface ILiveMatch extends FullMatch {
	stars: number;
}

discordClient.on("ready", () => console.log(`Logged in as ${discordClient.user.tag}`));

discordClient.on("message", async (message) => {

	if (message.author.bot) {
		return;
	}

	// have a bunch of commands
	// invoke each command if it thinks it should


	if (message.isMentioned(discordClient.user)) {

		if (LIVE_REGEX.test(message.content)) {
			message.channel.send("Getting live matches...");

			const liveEmbeds = await Live();

			liveEmbeds.forEach((embed) => message.channel.send(embed));

			// Redis example
			// redisClient.set(`liveMatch:${index}`, team || "Unknown");
			// redisClient.expire(`liveMatch:${index}`, 300);

			return;
		}

		else if (INFO_REGEX) {
			message.channel.send(createInfo());
		}

		else {
			message.channel.send("Unrecognised command");
			message.channel.send(createInfo());
		}
	}

})

discordClient.login(process.env.BOT_TOKEN).catch((error) => console.log(error));

const getLiveMatches = async (): Promise<ILiveMatch[]> => {
	const matches = await HLTV.getMatches();
	const liveMatches = await Promise.all(matches
		.filter((match) => match.live)
		.map(async (match) => {
			const liveMatch = await HLTV.getMatch({ id: match.id });

			return { stars: match.stars, ...liveMatch };
		}));

	return liveMatches;
}