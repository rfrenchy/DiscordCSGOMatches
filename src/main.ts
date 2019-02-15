
import Discord, { Message, RichEmbed } from "discord.js";
import FullMatch from "hltv/lib/models/FullMatch";
import Redis from "redis";

import { createInfo } from "./info/Info";
import { Live } from "./live/Live";

require('dotenv').config();

const discordClient = new Discord.Client();

const port = process.env.REDIS_PORT || "";
const host = process.env.REDIS_HOST;

const redisClient = Redis.createClient(parseInt(port), host, { password: process.env.REDIS_PASSWORD });

redisClient.on('connect', function () {
	console.log('Connected to Redis...');
});

const LIVE_REGEX = /!live/gmi;
const INFO_REGEX = /!info/gmi;

export interface ILiveMatch extends FullMatch {
	stars: number;
}

discordClient.on("ready", () => console.log(`Logged in as ${discordClient.user.tag}`));

discordClient.on("message", async (message) => {

	if (message.author.bot) {
		return;
	}

	if (message.isMentioned(discordClient.user)) {

		if (LIVE_REGEX.test(message.content)) {
			message.channel.send("Getting live matches...");

			const liveEmbeds = await Live();

			liveEmbeds.forEach((embed) => message.channel.send(embed));

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
