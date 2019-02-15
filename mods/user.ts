import minimist = require("minimist");
import * as bb from "../lib/bb"
export async function main(cl: bb.Client, args : minimist.ParsedArgs)
{
    if (args["info"])
    {
        const res = await cl.get({
            uri: `user/${parseInt(args["id"])}/info`
        });
        console.log(res);
        return;
    }
}