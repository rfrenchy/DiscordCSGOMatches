import { Info } from "./Info";

describe("An info command", () => {
	const info = new Info();

	it("should have a section for the !info command", () => {
		expect(info.execute()).toContain("!info");
	});

	it("should have a section for the !live command", () => {
		expect(info.execute()).toContain("!live");
	});

	it("should have a section for the !upcoming command", () => {
		expect(info.execute()).toContain("!upcoming");
	});
});
