import minimist = require("minimist");
import * as bb from "../lib/bb"

export async function main(cl: bb.Client, args : minimist.ParsedArgs)
{
    if (args["server-version"] || args["sv"])
    {
        const v = await bb.GetServerVersion(cl);
        console.log(`Cloud version: ${v}`);
        return;
    }
    
    if (args["token-info"])
    {
        const i = await bb.DescribeCapability(cl);
        console.log(i);
        return;
    }

    if (args["_"][0] == "login")
    {
        const tok = await bb.LogIn(cl, args["username"], args["password"]);
        console.log(tok);
        return;
    }

    if (args["_"][0] == "signup")
    {
        
        const ret = await bb.CreateAccount(cl, args["username"], args["password"], args["email"]);
        const retJson = JSON.parse(JSON.stringify(ret));
        if(retJson.result){
            const tok = await bb.LogIn(cl, args["username"], args["password"])
            console.log(tok);
        }
        
        
        return;
    }
}