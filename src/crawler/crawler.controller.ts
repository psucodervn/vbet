import { Controller, Get, OnModuleInit } from '@nestjs/common';
import { GrpcRoute } from '@nestjs/microservices';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

interface FindRequest {}

@Controller('/crawler')
export class CrawlerController implements OnModuleInit {
  onModuleInit(): any {}

  @Get()
  root(): any {
    return {
      status: true,
    };
  }

  // noinspection JSUnusedLocalSymbols
  @GrpcRoute('CrawlerService', 'Find')
  find(data: FindRequest): Observable<any> {
    return Observable.of({
      status: true,
    });
  }
}
