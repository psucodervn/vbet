import * as fs from 'fs';
import * as yaml from 'js-yaml';
import { Logger } from '@nestjs/common';

export class ConfigService {
  private readonly config;
  private readonly logger: Logger = new Logger(ConfigService.name);

  constructor(filePath: string) {
    try {
      this.config = yaml.safeLoad(fs.readFileSync(filePath));
    } catch (e) {
      this.logger.error(e);
    }
  }

  get(key: string): string {
    return this.config[key];
  }
}
