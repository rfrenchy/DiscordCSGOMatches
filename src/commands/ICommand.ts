export interface ICommand {
	/**
	 * Text explaining what the command is and how the command is used.
	 */
	usageText: string;

	/**
	 * The keyword which invokes this command.
	 */
	keyword: string;

	/**
	 * Executes the command.
	 */
	execute(...params: any): any;
}
