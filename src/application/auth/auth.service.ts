import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
    ) {}

    async validateUser(username: string, password: string): Promise<any> {
        const user = await this.userService.findByUsername(username);
        if (user && await bcrypt.compare(password, user.password)) {
          const { password, ...result } = user.toObject();
          return result;
        }
        return null;
      }
}
