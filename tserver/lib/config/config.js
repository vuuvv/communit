"use strict";
const db_1 = require("../db");
let config = null;
class Config {
    static async instance() {
        if (!config) {
            await load();
        }
        return config;
    }
    hostUrl(url) {
        return `${config.site.host}${url}`;
    }
    clientUrl(url) {
        return `${config.site.client}/#/${url}`;
    }
}
exports.Config = Config;
async function load() {
    const configs = await db_1.Table.Config.select();
    try {
        config = new Config();
        configs.forEach((data) => {
            config[data.key] = JSON.parse(data.value);
        });
    }
    catch (err) {
        config = null;
        throw err;
    }
}
