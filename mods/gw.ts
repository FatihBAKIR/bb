import minimist = require("minimist");
import * as bb from "../lib/bb"
import * as gw from "../lib/gw"

export async function main(cl: bb.Client, args : minimist.ParsedArgs)
{
    if (args["get-ip"])
    {
        const ip = await gw.GetIP(cl, parseInt(args["get-ip"]));
        console.log(ip);
        return;
    }
}