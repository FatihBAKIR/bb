import * as bb from "./lib/bb"
import minimist = require("minimist");
import * as common from "./mods/main"
import * as gw from "./mods/gw"

interface Modules {
    [key: string]: (_: bb.Client, __: minimist.ParsedArgs) => Promise<void>;
}

const modules : Modules = {
    "common" : common.main,
    "login" : common.main,
    "gw" : gw.main
};

(async() => {
    const args = minimist(process.argv.slice(2));

    let cap : string | null = null;

    if (args["cap"])
    {
        cap = await bb.LoadToken(args["cap"]);
    }
    else if (args["cap-file"])
    {
        cap = await bb.LoadToken(args["cap-file"]);
    }

    const module_name = process.argv[2];

    const cl = await bb.GetClient(cap);
    try
    {
        await modules[module_name](cl, args);
    }
    catch (err)
    {
        const e : Error = err;
        console.log(`error: ${e.message}`);
    }
})();