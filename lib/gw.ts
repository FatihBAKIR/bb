import { Client } from "./bb";
import errors = require("request-promise-native/errors");

class GatewayNotFound extends Error
{
    constructor(gw_id : number)
    {
        super(`Gateway ${gw_id} does not exist!`);
    }
}

export function GetIP(cl: Client, gw_id: number)
{
    try {
        return cl.get({
            uri: `gw/${gw_id}/ip`
        });
    } catch (err)
    {
        const e : errors.StatusCodeError = err;
        if (e.statusCode == 404)
        {
            throw new GatewayNotFound(gw_id);
        }
        throw err;
    }
}