import { Get, Controller } from '@nestjs/common';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/from';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toArray';
import 'rxjs/add/operator/count';
import 'rxjs/add/operator/single';
import { ApiService } from './api.service';
import { ApiUseTags } from '@nestjs/swagger';

@Controller('api')
@ApiUseTags('football')
export class ApiController {
  constructor(private readonly apiService: ApiService) {}

  @Get('/leagues')
  async getLeagues() {
    return await this.apiService.getLeagues();
  }
}
