import {
  Controller,
  Get,
  OnModuleInit,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { Client, ClientGrpc } from '@nestjs/microservices';
import { grpcOptions } from '../shared/grpc.options';
import { Observable } from 'rxjs/Observable';

interface User {
  id: number;
  name: string;
}

interface FindRequest {}
interface FindOneRequest {
  id: number;
}

interface UserService {
  findOne(data: FindOneRequest): Observable<any>;
  find(data: FindRequest): Observable<any>;
}

interface CrawlerService {
  find(data: FindRequest): Observable<any>;
}

@Controller()
export class UserController implements OnModuleInit {
  // prettier-ignore
  @Client(grpcOptions('user'))
  private readonly client: ClientGrpc;
  private userService: UserService;
  // prettier-ignore
  @Client(grpcOptions('crawler'))
  private readonly crawlerClient: ClientGrpc;
  private crawlerService: CrawlerService;

  onModuleInit(): any {
    this.userService = this.client.getService<UserService>('UserService');
    this.crawlerService = this.crawlerClient.getService<CrawlerService>(
      'CrawlerService',
    );
  }

  @Get('/users')
  async getUsers(): Promise<User[]> {
    const results = this.userService.find({});
    return await results.map(v => (v.users ? v.users : [])).toPromise();
  }

  // prettier-ignore
  @Get('/users/:id')
  async getUserById(@Param('id', new ParseIntPipe()) id): Promise<User> {
    return await this.userService
      .findOne({ id: parseInt(id, 10) })
      .map(v => v.user ? v.user : {})
      .toPromise();
  }

  @Get('/crawler')
  async getCrawler() {
    return await this.crawlerService.find({}).toPromise();
  }
}
