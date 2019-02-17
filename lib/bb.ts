import * as conf from "./config"
import { resolve } from "url";
import fs = require('fs');
import chardet = require("chardet");

import { default as axios, AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";

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

interface ReqArgs
{
    uri: string;

    method?: "GET" | "POST";

    headers?: any;
    data?: any;
    json?: boolean;
}

export class Client
{
    private readonly _token : string | null;
    private readonly _config : conf.IConfig;
    private readonly _verbose: boolean;

    constructor(cap : string | null, c : conf.IConfig, verbose: boolean)
    {
        this._token = cap;
        this._config = c;
        this._verbose = verbose;
    }

    HaveToken() : boolean
    {
        return this._token != null;
    }

    private async req(opts : ReqArgs)
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

        if (this._verbose) {
            console.info(`[${opts.method}]\t${opts.uri}`);
        }

        const axiosOpts: AxiosRequestConfig = opts;
        axiosOpts.url = opts.uri;

        try
        {
            return (await axios(axiosOpts)).data;
        }
        catch (err)
        {
            const e: AxiosResponse = err.response;
            if (e.status == 401 && e.data.reason == "bad signature")
            {
                throw new BadSignature;
            }
            throw e;
        }
    }

    async get(opts : ReqArgs)
    {
        opts.method = "GET";
        return this.req(opts);
    }

    async post(opts : ReqArgs, body : any)
    {
        opts.method = "POST";
        opts.data = body;
        return this.req(opts);
    }
}

export async function LoadToken(path : string) : Promise<string>
{
    const buf = fs.readFileSync(path);
    const enc = <string | undefined>chardet.detect(buf);
    
    if (!enc) {
        throw new Error("Can't determine encoding");
    }

    const str = buf.toString(enc);
    return str.trim();
}

export async function GetClient(cap : string | null, conf: conf.IConfig, verbose: boolean)
{
    return new Client(cap, conf, verbose);
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

export async function CreateAccount(cl : Client, username: string, password: string, email: string) : Promise<string>
{
    return await cl.post({
        uri: "user/new"
    }, {
        username,
        password,
        email
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
    const res = await cl.get({
        uri: "version"
    });
    return res.version;
}