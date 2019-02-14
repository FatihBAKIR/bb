import rp = require("request-promise-native")
import * as conf from "./config"
import { resolve } from "url";

export async function UpdateIp(ip : string)
{
    const config = await conf.LoadConfig();

    const options = {
        uri: resolve(await config.GetBaseUrl(), "version"),
        json: true
    };

    const res = await rp(options);
    return res.version;
}