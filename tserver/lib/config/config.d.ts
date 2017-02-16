import { Site } from './models';
export declare class Config {
    site: Site;
    static instance(): Promise<Config>;
}
