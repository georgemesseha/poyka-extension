// Find db online at
// https://cloud.mongodb.com/v2/6027652f52563e2c207313ca#metrics/replicaSet/6027667f50dca2446f8fbf4c/explorer/CommandSheet/Poyka/find
import { List } from "decova-dotnet-developer";
import * as mongoose from "mongoose";

const uri = `mongodb+srv://aipianist:poykaIsGreat@poykacommandsheet.yw0ri.mongodb.net/CommandSheet?retryWrites=true&w=majority`;
export interface ICommand
{
    SearchString: string,
    CliCommand: string,
}

export class DB
{
    public static async GetAllCommands(): Promise<List<ICommand>>
    {
         await  mongoose.connect(uri, 
                {
                    useUnifiedTopology: true,
                    useNewUrlParser: true,
                
                });
        const query = mongoose.connection.db.collection('Poyka').find({});
        return new List<ICommand>(await query.toArray());
    }
}