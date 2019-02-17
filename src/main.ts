
import Discord, { Message, RichEmbed } from "discord.js";
import FullMatch from "hltv/lib/models/FullMatch";
import Redis from "redis";

import { createInfo } from "./commands/info/Info";
import { Live } from "./commands/live/Live";
import { Upcoming } from "./commands/upcoming/Upcoming";

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
const UPCOMING_REGEX = /!upcoming/gmi;


export interface ILiveMatch extends FullMatch {
	stars: number;
}

discordClient.on("ready", () => {
	console.log(`Logged in as ${discordClient.user.tag}`)
});

discordClient.on("message", async (message) => {

	if (message.author.bot) {
		return;
	}

	if (message.isMentioned(discordClient.user)) {

		if (LIVE_REGEX.test(message.content)) {
			message.channel.send("Getting live matches...");

			const liveEmbeds = await Live();

			liveEmbeds.forEach((embed) => message.channel.send(embed));

			if (liveEmbeds.length === 0) {
				message.channel.send("There are currently no live matches")
			}

			return;
		}

		else if (UPCOMING_REGEX.test(message.content)) {
			message.channel.send("Getting upcoming matches...");

			const upcomingEmbeds = await new Upcoming().execute();

			upcomingEmbeds.forEach((embed) => message.channel.send(embed));
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

const BOT_TOKEN = process.env.DEV_MODE ? process.env.BOT_TOKEN_DEV : process.env.BOT_TOKEN;

discordClient.login(BOT_TOKEN).catch((error) => console.log(error));
