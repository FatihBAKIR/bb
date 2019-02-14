import minimist = require("minimist");
import * as bb from "../lib/bb"

export async function main(cl: bb.Client, args : minimist.ParsedArgs)
{
    if (args["info"])
    {
        const name = args["name"];

        if (!name)
        {
            throw new Error("Missing Org Name!");
        }

        const org_info = (await bb.GetOrgId(cl, name));
        console.log(org_info);
    }

    if (args["gws"])
    {
        const name = args["name"];

        if (!name)
        {
            throw new Error("Missing Org Name!");
        }

        const res = (await bb.GetOrgGateways(cl, name));
        console.log(res);
    }

    if (args["add-user"])
    {
        const name = args["org-name"];
        const username = args["user-name"];

        if (!name || !username)
        {
            throw new Error("Missing User or Org Name!");
        }

        const res = (await bb.OrgAddUser(cl, name, username));
        console.log(res);
    }
}