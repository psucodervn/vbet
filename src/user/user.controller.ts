import { Controller } from '@nestjs/common';
import { GrpcRoute } from '@nestjs/microservices';
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

@Controller('/users')
export class UserController {
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
