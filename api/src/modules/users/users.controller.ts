import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Roles } from 'src/common/role/roles.decorator';
import { RolesGuard } from 'src/common/role/roles.guard';
import { JwtAuthGuard } from './guards/jwt-auth-guards'; // Use your new custom guard
import { Public } from './decotators/public.decorator';
import { LoginUserDto } from './dto/login-user.dto';

@UseGuards(JwtAuthGuard, RolesGuard) // Global protection for this controller
@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Public()
  @Post('register')
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Public()
  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto) {
    return this.usersService.login(loginUserDto);
  }

  @Get('me')
  async getMe(@Request() req) {
    return this.usersService.findOne(req.user.id);
  }

  @Get()
  @Roles('ADMIN')
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @Roles('ADMIN')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  @Roles('ADMIN') // Added roles so only admins can update users
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @Roles('ADMIN') // Added roles so only admins can delete
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
