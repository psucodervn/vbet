import * as fs from 'fs';
import * as yaml from 'js-yaml';

export class ConfigService {
  private readonly envConfig;

  constructor(filePath: string) {
    this.envConfig = yaml.safeLoad(fs.readFileSync(filePath));
    console.log(this.envConfig);
  }

  get(key: string): string {
    return this.envConfig[key];
  }
}
