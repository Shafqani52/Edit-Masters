import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Post,
    Request,
    UseGuards
  } from '@nestjs/common';
  import { AuthGuard } from './auth.guard';
  import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { Public } from 'src/common/public.decorator';
  
  @Controller('auth')
  export class AuthController {
    constructor(private authService: AuthService) {}
  
    @Public()
    @HttpCode(HttpStatus.OK)
    @Post('login')
    signIn(@Body() signInDto: Record<string, any>) {
      return this.authService.signIn(signInDto.email, signInDto.password);
    }

    @Public()
    @HttpCode(HttpStatus.OK)
    @Post('signup')
    async signup(@Body() signUpData: SignupDto) {
      return await this.authService.signUp(signUpData);
    }

    @Public()
    @HttpCode(HttpStatus.OK)
    @Post('forgot-pwd')
    ForgotPassword(@Body() email: string) {
      // it checks whether user  
      return this.authService.forgotPassword(email)
    }

    @Public()
    @HttpCode(HttpStatus.OK)
    @Post('reset-pwd')
    ResetPassword(@Body() userBody) {
      return this.authService.isUserExists(userBody)
    }

    @Public()
    @HttpCode(HttpStatus.OK)
    @Post('create-pwd')
    UpdatePassword(@Body() userBody) {
      this.authService.updatePassword(userBody)
    }
  
  }