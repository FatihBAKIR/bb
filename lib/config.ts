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
        return "http://core1.bakir.io:3000/";
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