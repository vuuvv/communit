import { Site } from './models';
import { Table } from '../db';

let config: Config = null;

export class Config {
  site: Site;

  static async instance(): Promise<Config> {
    if (!config) {
      await load();
    }
    return config;
  }

  hostUrl(url: string): string {
    return `${config.site.host}${url}`;
  }

  clientUrl(url: string): string {
    return `${config.site.client}/#/${url}`;
  }
}

async function load() {
  const configs = await Table.Config.select();
  try {
    config = new Config();
    configs.forEach((data) => {
      config[data.key] = JSON.parse(data.value);
    });
  } catch (err) {
    config = null;
    throw err;
  }
}
