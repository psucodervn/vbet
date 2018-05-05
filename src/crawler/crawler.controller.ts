import { Controller, Get, OnModuleInit } from '@nestjs/common';

@Controller('/crawler')
export class CrawlerController implements OnModuleInit {
  onModuleInit(): any {}

  @Get()
  root(): any {
    return {
      status: true,
    };
  }
}
