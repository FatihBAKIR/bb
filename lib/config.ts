export interface IConfig
{
    GetBaseUrl() : Promise<string>;
}

class LocalConfig 
    implements IConfig
{
    async GetBaseUrl() {
        return "http://localhost:3000/";
    }
}

class SimpleConfig 
    implements IConfig
{
    async GetBaseUrl() {
        return "https://api.bakir.io/";
    }
}

export async function LoadConfig(name: string)
{
    if (name == "local")
    {
        return new LocalConfig;
    }
    return new SimpleConfig;
}