import { ILiveMatch } from "src/main";
import { Status } from "./Status";
import Redis from "redis";

const port = process.env.REDIS_PORT || "";
const host = process.env.REDIS_HOST;

const redisClient = Redis.createClient(parseInt(port), host, {
	password: process.env.REDIS_PASSWORD
});

redisClient.on("connect", function() {
	console.log("Connected to Redis...");
});

export class MatchStorage {
	public store(matches: ILiveMatch[]): void {
		redisClient.set("ryan:test", "hello", (error, result) => {
			if (error) {
				return Status.ERROR;
			}

			return Status.OK;
		});

		// ensure there is a connection to the redis server
	}
}
