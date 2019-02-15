import * as bb from "./lib/bb"
import minimist = require("minimist");
import * as common from "./mods/main"
import * as gw from "./mods/gw"
import * as raw from "./mods/raw"
import * as org from "./mods/org"
import * as user from "./mods/user"
import fs = require("fs");
import os = require("os");
import { resolve } from "url";
import * as conf from "./lib/config"

interface Modules {
    [key: string]: (_: bb.Client, __: minimist.ParsedArgs) => Promise<void>;
}

const modules : Modules = {
    "common" : common.main,
    "login" : common.main,
    "signup" : common.main,
    "gw" : gw.main,
    "raw": raw.main,
    "user": user.main,
    "org": org.main
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
    else if (!args["nocap"])
    {
        const tok_path = resolve(os.homedir() + "/", ".bb/token.cap");
        if (fs.existsSync(tok_path))
        {
            cap = await bb.LoadToken(tok_path);
        }
    }

    const module_name = process.argv[2];

    const profile_name = args["profile"] || "default";

    const config = await conf.LoadConfig(profile_name);
    const cl = await bb.GetClient(cap, config);
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