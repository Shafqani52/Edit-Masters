// src/promotions/promotions.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Promotion } from './entities/promotion.entity';
import { GetPromotionDto } from './dto/update-promotion.dto';

@Injectable()
export class PromotionsService {
  activate: any;
  constructor(
    @InjectRepository(Promotion)
    private promotionsRepository: Repository<Promotion>,
  ) {}

  findAll(): Promise<Promotion[]> {
    return this.promotionsRepository.find({
        order: {
          title: 'ASC',
        },
    });
  }

  async getActivePromotion(): Promise<Promotion | null> {
    return this.promotionsRepository.findOne({
      where: {
        isActive: true,
      },
    });
  }

//   findOne(id: number): Promise<Promotion> {
//     return this.promotionsRepository.findOne(id);
//   }

    async findOneById(id: number): Promise<GetPromotionDto> {
        try {
        return await this.promotionsRepository.findOne({
            where: { id }
        });
        } catch (err) {
        new NotFoundException("This promotion is not found")
        }
    }

  async create(promotion: Promotion): Promise<Promotion> {
    // Deactivate any active promotion before creating a new one
    await this.promotionsRepository.update({ isActive: true }, { isActive: false });
    promotion.isActive = true;
    return this.promotionsRepository.save(promotion);
  }

  async update(id: number, promotion: Promotion): Promise<void> {
    await this.promotionsRepository.update(id, promotion);
  }

  async delete(id: number): Promise<void> {
    await this.promotionsRepository.delete(id);
  }

  async activatePromotion(id: number): Promise<void> {
    // Deactivate any active promotion
    const promotion = await this.findOneById(id);
    await this.promotionsRepository.update({ isActive: true }, { isActive: false });
    // Activate the selected promotion
    if (promotion) {
        promotion.isActive = !promotion.isActive;
        await this.promotionsRepository.save(promotion);
    }
  }
}