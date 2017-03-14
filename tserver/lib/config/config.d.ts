import { Site } from './models';
export declare class Config {
    site: Site;
    static instance(): Promise<Config>;
    hostUrl(url: string): string;
    clientUrl(url: string): string;
}
