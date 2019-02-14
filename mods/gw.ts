import minimist = require("minimist");
import * as bb from "../lib/bb"
import * as gw from "../lib/gateway"

export async function main(cl: bb.Client, args : minimist.ParsedArgs)
{
    if (args["get-ip"])
    {
        const ip = await gw.GetIP(cl, parseInt(args["id"]));
        console.log(ip);
        return;
    }

    if (args["new"])
    {
        const name = args["name"];
        const org = args["org"];

        if (!name || !org)
        {
            throw new Error("Missing Argument!");
        }

        const org_id = (await bb.GetOrgId(cl, org)).id;

        const res = await gw.New(cl, name, org_id);
        console.log(res);
    }
}