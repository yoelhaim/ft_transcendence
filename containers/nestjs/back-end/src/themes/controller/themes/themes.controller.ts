import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common';

import { ThemesService } from '../../service/themes/themes.service';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Controller('themes')
export class ThemesController {

    constructor(private themesService: ThemesService) {}

    @Get()
    @UseGuards(AuthGuard('authGuard'))
    async getThemes(@Req() req: Request) {
        return await this.themesService.getThemes(req.user['id']);
    }

    @Post()
    @UseGuards(AuthGuard('authGuard'))
    selectedTheme(@Req () req: Request) {
        return this.themesService.selectedTheme(req.user['id'], req.body.id);
    }

}
