import {
  Get,
  Controller,
  ParseIntPipe,
  OnModuleInit,
  Param,
} from '@nestjs/common';
import { Client, ClientGrpc } from '@nestjs/microservices';
import { grpcClientOptions } from '../grpc-client.options';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/from';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toArray';
import 'rxjs/add/operator/count';
import 'rxjs/add/operator/single';
import { AppService } from './app.service';

interface User {
  id: number;
  name: string;
}

const users: User[] = [
  { id: 1, name: 'Hung Le' },
  { id: 2, name: 'Le Manh Hung' },
];

interface FindRequest {}
interface FindOneRequest {
  id: number;
}

interface UserService {
  findOne(data: FindOneRequest): Observable<any>;
  find(data: FindRequest): Observable<any>;
}

@Controller()
export class AppController implements OnModuleInit {
  // prettier-ignore
  @Client(grpcClientOptions)
  private readonly client: ClientGrpc;
  private userService: UserService;

  constructor(private readonly appService: AppService) {}

  onModuleInit(): any {
    this.userService = this.client.getService<UserService>('UserService');
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

  @Get('/')
  root() {
    return this.appService.root();
  }
}
