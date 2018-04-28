import { Controller, OnModuleInit } from '@nestjs/common';
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
