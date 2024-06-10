import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePdfDto } from './dto/create-pdf.dto';
import { UpdatePdfDto } from './dto/update-pdf.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PDF } from './entities/pdf.entity';
import { Repository } from 'typeorm';
import { NotFoundError } from 'rxjs';

@Injectable()
export class PdfService {
  userRepository: any;
  constructor(
    @InjectRepository(PDF)
    private readonly pdfRepository: Repository<PDF>
  ) {

  }

  async create(createPdfDto: CreatePdfDto) {
    const pdf = createPdfDto;
    return await this.pdfRepository.save(pdf); 
  }

  findAll() {
    return `This action returns all pdf`;
  }

  async findOne(id: number) {
    try {
      const pdf = await this.pdfRepository.findOne({
        where: { id }
      });
      if(!pdf) {
         return new NotFoundException('this pdf file is not found')
      }
      return pdf;
    } catch (err) {
      new NotFoundException('this pdf file is not found');
    }
  }

  async update(id: number, updatePdfDto: UpdatePdfDto) {
    // await this.findOne(id);
    // return this.pdfRepository.update(id);
    const pdf = await this.findOne(id);
    if (!pdf) {
      throw new NotFoundException('This PDF file is not found');
    }
    Object.assign(pdf, updatePdfDto);
    // return await this.pdfRepository.save(pdf);
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.pdfRepository.delete(id);
  }

  async getPDF(filename: string, res) {
    return res.sendFile(filename, { root: 'uploads' });
  }
}
