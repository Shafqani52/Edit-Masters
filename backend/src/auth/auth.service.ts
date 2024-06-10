import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { SignupDto } from './dto/signup.dto';
import * as bcrypt from 'bcrypt'
import { MailService } from 'src/mail/mail.service';
import { randomBytes } from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private readonly mailService: MailService,

  ) {}

  async signIn(
    email: string,
    pass: string,
  ): Promise<{ access_token: string }> {
    const user = await this.userService.findOneByEmail(email);

    if(user.active === false) {
      throw new UnauthorizedException('This Account is Deactivated');
    }

    const isMatch = await bcrypt.compare(pass, user.password);

    if (!isMatch) {
      throw new UnauthorizedException();
    }
    const payload = { user_id: user.id, email: user.email, role: user.role, active: user.active };
    const data = {
      user_id: user.id,
      role: user.role,
      access_token: await this.jwtService.signAsync(payload),
    };

    return data;
  }

  async signUp(user: SignupDto) {
    const saltOrRounds = 10;
    const hashPassword = await bcrypt.hash(user.password, saltOrRounds);

    user.password = hashPassword;

    return await this.userService.create(user);
  }

  async forgotPassword(
    email: string,
  ) {
    const user = await this.userService.findUserByEmail(email);
   
    // this.userService.update(user.id, {email: "xyz@test.com"})
    if(user) {
      const token = randomBytes(64).toString('hex');
      // const finalToken = await bcrypt.hash(token, Number(123))
      user.resetPasswordToken = token
      this.userService.updateUser(user.email, user)
      const mailDTO = { email : "shafiqkharkovi52@gmail.com", subject: "test"}
      const user_ = await this.userService.findUserByEmail(email);
      

      await this.mailService.sendMail({
        ...mailDTO,
        template:`Please go to this link to reset your password: 
        http://localhost:5173/reset-password/?token=${user.resetPasswordToken}&user_id=${user.email}`
      })  
    } else {
      throw new Error("User not exists")
    }


    // this.userService.update(user.id, user)
    // if(!user || user.active === false ) {
    //   throw new Error('Email Not Found, Email must be registered to reset password');
    // }

  }

  async isUserExists(userBody) {
    const user = await this.userService.findUserByEmailReset(userBody.email);

    if(user) {
      return {
        success: true
      }
    } else {
      throw new UnauthorizedException('User doesnt\'t exist.. ');
    }

  }

  async updatePassword(userBody) {
    const user = await this.userService.findOneByEmail(userBody.email);


    const saltOrRounds = 10;
    const hashPassword = await bcrypt.hash(userBody.password, saltOrRounds);

    user.password = hashPassword;
    const user_ = await this.userService.findUserByEmailReset(userBody.email);
    user_.resetPasswordToken = '0';


    this.userService.update(user.id, user)
    this.userService.update(user.id, user_)
    
  }
}