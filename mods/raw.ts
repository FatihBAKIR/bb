import minimist = require("minimist");
import * as bb from "../lib/bb"

export async function main(cl: bb.Client, args : minimist.ParsedArgs)
{
    if (args["get"])
    {
        const x = await cl.get({
            uri: args["uri"] || args["url"]
        });
        
        console.log(x);
    }
}