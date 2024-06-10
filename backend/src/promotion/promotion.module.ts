import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PromotionsController } from './promotion.controller';
import { Promotion } from './entities/promotion.entity'
import { PromotionsService } from './promotion.service';

@Module({
  imports: [TypeOrmModule.forFeature([Promotion])],
  providers: [PromotionsService],
  controllers: [PromotionsController],
})
export class PromotionModule {}