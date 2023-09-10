import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';

import { SearchService } from '../../services/search/search.service';
import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { use } from 'passport';

@Controller('search')
@UseGuards(AuthGuard('authGuard'))
export class SearchController {
  constructor(private searchService: SearchService) {}

  @Get(':query')
  search(@Param('query') query: string, @Req() { user }: Request) {
    return this.searchService.search(query, user['id']);
  }
}
