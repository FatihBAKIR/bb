import rp = require("request-promise-native")
import * as conf from "./config"
import { resolve } from "url";
import request = require("request");
import fs = require('fs');
import errors = require("request-promise-native/errors");

class BadSignature extends Error
{
    constructor()
    {
        super ("capability signature mismatch");
    }
}

class MissingToken extends Error
{
    constructor()
    {
        super ("missing capability");
    }
}

export class Client
{
    private readonly _token : string | null;
    private readonly _config : conf.IConfig;

    constructor(cap : string | null, c : conf.IConfig)
    {
        this._token = cap;
        this._config = c;
    }

    HaveToken() : boolean
    {
        return this._token != null;
    }

    private async req(opts : request.CoreOptions & request.UriOptions)
    {
        if (!opts.headers)
        {
            opts.headers = {};
        }
        if (this._token)
        {
            opts.headers!["x-access-token"] = this._token;
        }
        opts.json = true;
        opts.uri = resolve(await this._config.GetBaseUrl(), opts.uri.toString());        
        try
        {
            return await rp(opts);
        }
        catch (err)
        {
            const e : errors.StatusCodeError = err;
            if (e.statusCode == 401 && e.error.reason == "bad signature")
            {
                throw new BadSignature;
            }
            throw err;
        }
    }

    async get(opts : request.CoreOptions & request.UriOptions)
    {
        return this.req(opts);
    }

    async post(opts : request.CoreOptions & request.UriOptions, body : any)
    {
        opts.method = "POST";
        opts.body = body;
        return this.req(opts);
    }
}

export async function LoadToken(path : string) : Promise<string>
{
    return fs.readFileSync(path, "utf8").trim();
}

export async function GetClient(cap : string | null, conf: conf.IConfig)
{
    return new Client(cap, conf);
}

export async function DescribeCapability(cl : Client)
{
    if (!cl.HaveToken())
    {
        throw new MissingToken;
    }
    return await cl.get({
        uri: "auth/token-info"
    });
}

export async function LogIn(cl : Client, username: string, password: string) : Promise<string>
{
    return await cl.post({
        uri: "auth"
    }, {
        username,
        password
    });
}

interface OrgInfo
{
    id: number;
}

export async function GetOrgId(cl: Client, orgname: string) : Promise<OrgInfo>
{
    return await cl.get({
        uri: `org/${orgname}/info`
    });
}

export async function GetOrgGateways(cl: Client, orgname: string) : Promise<OrgInfo>
{
    return await cl.get({
        uri: `org/${orgname}/gws`
    });
}

export async function OrgAddUser(cl: Client, orgname: string, username: string) : Promise<void>
{
    return await cl.post({
        uri: `org/${orgname}/add_user`
    }, {
        username
    });
}

export async function GetServerVersion(cl : Client)
{
    const options = {
        uri: "version",
        json: true
    };

    const res = await cl.get(options);
    return res.version;
}