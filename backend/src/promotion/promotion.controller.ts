// src/promotions/promotions.controller.ts
import { Controller, Get, Post, Put, Delete, Param, Body, Patch } from '@nestjs/common';
import { PromotionsService } from './promotion.service';
import { Promotion } from './entities/promotion.entity';

@Controller('promotions')
export class PromotionsController {
  constructor(private readonly promotionsService: PromotionsService) {}

  @Get('all')
  findAll(): Promise<Promotion[]> {
    return this.promotionsService.findAll();
  }

  @Get('active')
  findActivePromotion(): Promise<Promotion | null> {
    return this.promotionsService.getActivePromotion();
  }

  // @Get(':id')
  // findOne(@Param('id') id: string): Promise<Promotion> {
  //   return this.promotionsService.findOne(+id);
  // }

  @Post('create')
  create(@Body() promotion: Promotion): Promise<Promotion> {
    return this.promotionsService.create(promotion);
  }

  @Patch('update/:id')
  update(@Param('id') id: string, @Body() promotion: Promotion): Promise<void> {
    return this.promotionsService.update(+id, promotion);
  }

  @Delete('delete/:id')
  delete(@Param('id') id: string): Promise<void> {
    return this.promotionsService.delete(+id);
  }

  @Patch('activate/:id')
  activatePromotion(@Param('id') id: string): Promise<void> {
    return this.promotionsService.activatePromotion(+id);
  }
}