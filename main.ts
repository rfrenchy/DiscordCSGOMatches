
import Discord, { Message, RichEmbed } from "discord.js";
import fs from "fs";
import HLTV from "hltv";

require('dotenv').config();

const client = new Discord.Client();

const HLTV_URL = "https://www.hltv.org/";

// TODO: npm install sharp?

client.on("ready", () => console.log(`Logged in as ${client.user.tag}`));

client.on("message", async (message) => {

	if (message.isMentioned(client.user)) {

		const matches = await HLTV.getMatches();
		const liveMatches = await Promise.all(matches
			.filter((match) => match.live)
			.map((liveMatch) => HLTV.getMatch({ id: liveMatch.id })));

		liveMatches
			.map((liveMatch) => {

				const team1Name = (liveMatch.team1 && liveMatch.team1.name) || "Unknown";
				const team2Name = (liveMatch.team2 && liveMatch.team2.name) || "Unknown";
				const title = `${team1Name} vs ${team2Name}`;

				const embed = new RichEmbed()
					.setDescription(liveMatch.event && liveMatch.event.name)
					.setTimestamp(new Date(liveMatch.date))
					.setFooter("Started")
					.setAuthor(title, "https://avatars2.githubusercontent.com/u/9454190?s=460&v=4")

				const imageUrl = `./img/csgo/${team2Name.toLowerCase()}/${team2Name.toLowerCase()}-128.png`;

				if (fs.existsSync(imageUrl)) {
					const attachment = new Discord.Attachment(imageUrl, "test.png");
					embed.attachFile(attachment).setImage(`attachment://test.png`);
				}

				const streamText = liveMatch.streams
					.reduce((textSegment, stream) => {
						const link = stream.name.toUpperCase() !== "HLTV LIVE" ? stream.link : HLTV_URL.concat(stream.link);
						return textSegment.concat(`[${stream.name}](${link}) | `)
					}, "")
					.replace(/ \| $/gm, ""); // Remove the trailing pipe and spaces

				if (streamText) {
					embed.addField("Streams", streamText);
				}

				return embed;
			})
			.forEach((embed) => message.channel.send(embed));
	}
})

client.login(process.env.BOT_TOKEN).catch((error) => console.log(error));