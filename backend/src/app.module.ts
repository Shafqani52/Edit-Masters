import { Module } from '@nestjs/common';
import { PdfModule } from './pdf/pdf.module';
import { ImageModule } from './image/image.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth/auth.guard';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { RolesGuard } from './auth/roles.guard';
import { PromotionModule } from './promotion/promotion.module';
import { MailModule } from './mail/mail.module';
import { ConfigModule } from '@nestjs/config';


@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploadFiles'),
    }),
    TypeOrmModule.forRoot({
      type: "postgres",
      host: "localhost",
      port: 5432,
      username: "postgres",
      password: "1234",
      database: "fyp_backend",
      autoLoadEntities: true,
      synchronize: true,
    }),
    PdfModule, 
    ImageModule, 
    UserModule, 
    AuthModule, 
    PromotionModule,
    MailModule,
    ConfigModule.forRoot()
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
