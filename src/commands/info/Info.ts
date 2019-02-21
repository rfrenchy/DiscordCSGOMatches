export class Info {
	public execute(): string {
		const info = `Available commands:

		**!live**     : displays live CSGO matches
		**!upcoming** : displays upcoming CSGO matches
		**!info**     : displays available commands

		`;

		return info;
	}
}
