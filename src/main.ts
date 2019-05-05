import Discord, { Message, RichEmbed } from "discord.js";
import FullMatch from "hltv/lib/models/FullMatch";

// import { createInfo } from "./commands/info/Info";
import { Live } from "./commands/live/Live";
import { Upcoming } from "./commands/upcoming/Upcoming";
import { Fetcher } from "./fetcher/fetcher";
import { Info } from "./commands/info/Info";

require("dotenv").config();

const discordClient = new Discord.Client();

// const port = process.env.REDIS_PORT || "";
// const host = process.env.REDIS_HOST;

// const redisClient = Redis.createClient(parseInt(port), host, {
// 	password: process.env.REDIS_PASSWORD
// });

// redisClient.on("connect", function() {
// 	console.log("Connected to Redis...");
// });

const LIVE_REGEX = /!live/im;
const INFO_REGEX = /!info/im;
const UPCOMING_REGEX = /!upcoming/im;

const fetcher = new Fetcher();

export interface ILiveMatch extends FullMatch {
	stars: number;
}

discordClient.on("ready", () => {
	console.log(`Logged in as ${discordClient.user.tag}`);
});

discordClient.on("message", async message => {
	if (message.author.bot) {
		return;
	}

	const info = new Info();

	if (message.isMentioned(discordClient.user)) {
		if (LIVE_REGEX.test(message.content)) {
			message.channel.send("Getting live matches...");

			const liveCommand = new Live();
			const liveMatches = await fetcher.matches({ live: true });

			const liveEmbeds = liveMatches.splice(0, 5).map(match => liveCommand.buildEmbed(match));

			liveEmbeds.forEach(embed => message.channel.send(embed));

			if (liveEmbeds.length === 0) {
				message.channel.send("There are currently no live matches");
			}

			return;
		} else if (UPCOMING_REGEX.test(message.content)) {
			message.channel.send("Getting upcoming matches...");

			const upcomingCommand = new Upcoming();
			const upcomingMatches = await fetcher.matches({ live: false });

			const upcomingEmbeds = upcomingMatches
				.splice(0, 5)
				.map(match => upcomingCommand.buildEmbed(match));

			upcomingEmbeds.forEach(embed => message.channel.send(embed));

			if (upcomingEmbeds.length === 0) {
				message.channel.send("There are currently no upcoming matches");
			}
		} else if (INFO_REGEX) {
			message.channel.send(info.execute());
		} else {
			message.channel.send("Unrecognised command. Type !info for a list of available commands.");
		}
	}
});

const BOT_TOKEN = process.env.DEV_MODE ? process.env.BOT_TOKEN_DEV : process.env.BOT_TOKEN;

discordClient.login(BOT_TOKEN).catch(error => console.log(error));
