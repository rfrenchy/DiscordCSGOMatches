import { MatchStorage } from "./MatchStorage";
import { CreateMockFullMatch } from "../../commands/live/MockLiveData";
import { Status } from "./Status";

import redis from "redis-mock";

describe("A MatchStorage class", () => {
	const storage = new MatchStorage();
	const redisClient = redis.createClient();

	describe("has a store method that", () => {
		beforeAll(() => {});

		// it("should return OK if it does not error", () => {
		// 	const matches = [CreateMockFullMatch()];

		// 	expect(storage.store(matches)).toBe(Status.OK);
		// });

		// it("should return ERROR if it encounters any issues", () => {
		// 	const matches = [CreateMockFullMatch()];

		// 	// jest.spyOn(redisClient, "echo").mockRejectedValueOnce()

		// 	expect(storage.store(matches)).toBe(Status.ERROR);
		// });
	});
});
