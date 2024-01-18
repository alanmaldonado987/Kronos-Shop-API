import { Controller, Post, Body, Get, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { LoginAuthDto } from './dto/login-auth.to';
import { UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { Role } from './enum/role.enum';
import { AuthGuard } from './guards/auth.guard';
import { Roles } from './decoratos/role.decorator';
import { RolesGuard } from './guards/role.guard';

interface RequestWithUser extends Request {
  searchUser: {
    email: string;
    token: string;
  };
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  create(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.create(createAuthDto);
  }

  @Post('login')
  login(@Body() loginAuthDto: LoginAuthDto) {
    return this.authService.login(loginAuthDto);
  }

  @Get('prueba')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('user')
  prueba(@Req() req: RequestWithUser) {
    console.log('pasó');
  }
}
