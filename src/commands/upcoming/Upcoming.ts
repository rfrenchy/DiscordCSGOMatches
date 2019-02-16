import { ICommand } from "../ICommand";

export class Upcoming implements ICommand {

	public usageText: string = "";

	public keyword: string = "!upcoming";

	public execute(): any {

	}
}