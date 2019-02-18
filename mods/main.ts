import minimist = require("minimist");
import { resolve } from "url";
import fs = require('fs');
import os = require('os');
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
        if(tok){
            await fs.mkdir(resolve(os.homedir() + "/", ".bb"),(err) => {
                if (err) throw err;
            })
            fs.writeFile(resolve(os.homedir() + "/", ".bb/token.cap"),tok, (err) => {
                if (err) throw err;
            })
        }
        console.log(tok);
        return;
    }

    if (args["_"][0] == "signup")
    {
        const ret = await bb.CreateAccount(cl, args["username"], args["password"], args["email"]);
        console.log(`Signup successful, please check ${args["email"]} for confirmation`);
        return;
    }

    if (args["_"][0] == "keys")
    {
        if (args["_"][1] == "get")
        {
            
        }
        if (args["_"][1] == "get" && args["text"] && args["username"])
        {
            const ret = await bb.GetKeyText(cl, args["username"]);
            console.log(ret);
        }
        if (args["_"][1] == "add" && args["username"])
        {
            const ret = await bb.PostKey(cl, "oguz", "hedeasdf");
            console.log(args["username"]);
            console.log(ret);
        }
        console.log(args);
        return;
    }
}