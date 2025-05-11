import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}
  
    @Post('signup')
    async signup(@Body() signupDto: CreateUserDto) {
      return this.userService.create(signupDto);
    }
  }