// import { Extension } from 'decova-vscode';

import { VSCode, QuickOption } from 'decova-vscode';
import { commands, ExtensionContext } from 'vscode';
import { DB } from './DB';

import { List } from 'decova-dotnet-developer';

enum SpecialCommands
{
	EditCommands = 'EditCommands',
	ReloadCommands = 'ReloadCommands',
}

const dbOnlineUrl = 'https://cloud.mongodb.com/v2/6027652f52563e2c207313ca#metrics/replicaSet/6027667f50dca2446f8fbf4c/explorer/CommandSheet/Poyka/find';

let allOptions: List<QuickOption> = new List<QuickOption>();
async function LoadOptions(): Promise<void>
{
	const allCommands = await DB.GetAllCommands();
	allOptions = allCommands.Select(c=> new QuickOption(c.Description,/*label*/
														c.CliCommand, /*description*/));
	allOptions.Add(new QuickOption('Poyka >> Edit Commands on Mongo', SpecialCommands.EditCommands))
	allOptions.Add(new QuickOption('Poyka >> Reload Commands', SpecialCommands.ReloadCommands ));
	allOptions = allOptions.Sort(o=>o.label!);

	VSCode.ShowMessage_Info('Poyka: Options loaded successfuly!')

}

async function runCommand()
{
	VSCode.ShowQuickPick(allOptions.Items, (option: QuickOption) =>
	{
		switch(option.description)
		{
			case SpecialCommands.EditCommands:
				VSCode.SendToTerminal(`start ${dbOnlineUrl}`)
				break;

			case SpecialCommands.ReloadCommands:
				LoadOptions();
				break;

			default:
				VSCode.SendToTerminal(option.description!);
				break;
		}
	})
}

export function activate(context: ExtensionContext)
{
	LoadOptions();
	commands.registerCommand('launch-poyka', async () =>
	{
		await runCommand();
	});
}