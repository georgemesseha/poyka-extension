// import { Extension } from 'decova-vscode';

import { VSCode, QuickOption } from 'decova-vscode';
import { commands, ExtensionContext } from 'vscode';
import { DB } from './DB';

import { List } from 'decova-dotnet-developer';

const dbOnlineUrl = 'https://cloud.mongodb.com/v2/6027652f52563e2c207313ca#metrics/replicaSet/6027667f50dca2446f8fbf4c/explorer/CommandSheet/Poyka/find';

let allOptions: List<QuickOption> = new List<QuickOption>();
async function LoadOptions(): Promise<void>
{
	const allCommands = await DB.GetAllCommands();
	allOptions = allCommands.Select(c=> new QuickOption(c.CliCommand, undefined, c.SearchString));
	allOptions.Add(new QuickOption('Edit Commands on Mongo', 'EditCommands', 'Go to Mongo online to edit commands'))
}

async function runCommand()
{
	VSCode.ShowQuickPick(allOptions.Items, (option: QuickOption) =>
	{
		if(option.Tag == 'EditCommands')
		{
			VSCode.SendToTerminal(`start ${dbOnlineUrl}`)
		}
		else
		{
			VSCode.SendToTerminal(option.label);
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