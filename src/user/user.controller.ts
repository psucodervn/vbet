import {
  Controller,
  Get,
  OnModuleInit,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { Client, ClientGrpc, GrpcRoute } from '@nestjs/microservices';
import { grpcClientOptions } from '../grpc-client.options';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/from';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toArray';

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

@Controller('/users')
export class UserController implements OnModuleInit {
  @Client(grpcClientOptions) private readonly client: ClientGrpc;
  private userService: UserService;

  onModuleInit(): any {
    this.userService = this.client.getService<UserService>('UserService');
  }

  @Get()
  getUsers(): Observable<any[]> {
    const results = this.userService.find({});
    return results.toArray();
  }

  @Get(':id')
  getUserById(
    @Param('id', new ParseIntPipe())
    id,
  ): Observable<any> {
    return this.userService.findOne({ id: parseInt(id, 10) });
  }

  // noinspection JSUnusedLocalSymbols
  @GrpcRoute('UserService', 'Find')
  find(data: FindRequest): Observable<User> {
    return Observable.of(...users);
  }

  @GrpcRoute('UserService', 'FindOne')
  findOne(data: FindOneRequest): Observable<User> {
    return Observable.of(users.find(value => value.id === data.id));
  }
}
