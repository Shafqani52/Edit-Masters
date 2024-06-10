import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateImageDto } from './dto/create-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';
import { Repository } from 'typeorm';
import { Image } from './entities/image.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ImageService {
  constructor(
    @InjectRepository(Image)
    private readonly imageRepository: Repository<Image>
  ){}
  create(createImageDto: CreateImageDto) {
    return 'This action adds a new image';
  }

  findAll() {
    return `This action returns all image`;
  }

  async findOne(id: number) {
    try {
      const image = await this.imageRepository.findOne({
        where: { id }
      });
      if(!image) {
        return new NotFoundException('this image file is not found')
      }
      return image;
    } catch (err) {
      new NotFoundException('this image file is not found');
    }
  }

  async update(id: number, updateImageDto: UpdateImageDto) {
    const image = await this.findOne(id);
    return this.imageRepository.save({ ...image, ...updateImageDto });
  }

  async remove(id: number) {
      await this.findOne(id);
      return this.imageRepository.delete(id);
  }

  async getImage(filename: string, res) {
      return res.sendFile(filename, { root: 'uploads' });
  }
    
}
