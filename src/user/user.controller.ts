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
import 'rxjs/add/operator/count';
import 'rxjs/add/operator/single';

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
  async getUsers(): Promise<User[]> {
    const results = this.userService.find({});
    return await results.map(v => v.users).toPromise();
  }

  @Get(':id')
  async getUserById(
    @Param('id', new ParseIntPipe())
    id,
  ): Promise<User> {
    return await this.userService
      .findOne({ id: parseInt(id, 10) })
      .map(v => v.user)
      .toPromise();
  }

  // noinspection JSUnusedLocalSymbols
  @GrpcRoute('UserService', 'Find')
  find(data: FindRequest): Observable<any> {
    return Observable.of({
      users,
    });
  }

  @GrpcRoute('UserService', 'FindOne')
  findOne(data: FindOneRequest): { user: User } {
    return {
      user: users.find(value => value.id === data.id),
    };
  }
}
