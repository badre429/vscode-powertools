import { IBmgConfig } from "./interfaces";
import * as fs from "fs";
import * as path from 'path';
export class ConfigLoader {
    constructor(private rootPath: string) {

    }
    public Load(): IBmgConfig {
        var local_path = path.join(this.rootPath,"bmg.config.json");
        if (fs.existsSync(local_path)) {
            var json_string = fs.readFileSync(local_path).toString();
            return JSON.parse(json_string);
        }
        return {};
    }
}