import minimist = require("minimist");
import { resolve } from "url";
import fs = require('fs');
import os = require('os');
import * as bb from "../lib/bb"

export async function main(cl: bb.Client, args : minimist.ParsedArgs)
{
    if (args["_"][1] == "get" && args["name"])
    {
        const ret = await bb.GetKeys(cl, args["name"]);
        if (args["text"])
        {
            for (var key of ret)
            {
                console.log(key.key);
            }
            return;
        }
        console.log(ret);
    }

    if (args["_"][1] == "add" && args["name"])
    {
        if (args["key"])
        {
            const ret = await bb.PostKey(cl, args["name"], args["key"]);
            console.log(ret);
        }
        
    }
}