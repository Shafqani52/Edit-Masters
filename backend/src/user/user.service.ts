import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto, getUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { PdfService } from 'src/pdf/pdf.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly pdfService: PdfService
  ) {}
  async create(createUserDto: CreateUserDto) {
    const user = createUserDto;
    if(!createUserDto.role) {
      user.role = 'user'
    }
    return await this.userRepository.save(user); 
  }

  async findAll() {
    return await this.userRepository.find();
  }

   // forgot password

  async findUserByEmail(email: string): Promise<getUserDto> {
    return await this.userRepository.findOne({
      where: {email: email['email']}
    })
  }

  async findUserByEmailReset(email: string): Promise<getUserDto> {
    return await this.userRepository.findOne({
      where: {email: email}
    })
  }
  async updateUser(email: string, updateUserDto: getUserDto) {
    const user = await this.findOneByEmail(email);
    Object.assign(user, updateUserDto)
    return await this.userRepository.save(user);
  }

  async findOneByEmail(email: string): Promise<SignInDto> {
    return await this.userRepository.findOne({
      where: { email }
    });
  } 

  async findOneById(id: number): Promise<getUserDto> {
    try {
      return await this.userRepository.findOne({
        where: { id }
      });
    } catch (err) {
      new NotFoundException("This user is not found")
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.findOneById(id);
    Object.assign(user, updateUserDto)
    return await this.userRepository.save(user);
  }

  async remove(id: number) {
    return await this.userRepository.delete(id);
  }

  async activate(id: number, updateUserDto) {
    const user = await this.findOneById(id);

    if(updateUserDto.active == 'true' || updateUserDto.active == true) {
      user.active = true
    } else {
      user.active = false
    }

    return await this.userRepository.save(user);
  }


  async uploadFile(id: number, updateUserDto, file) {
    let user = await this.findOneById(id);

    // const pdf = await this.pdfService.create(file)

    const pdfs = user.pdfs;
    const images = user.images;
    if(file.mimetype.includes('pdf')) {
      Object.assign(user, updateUserDto, { pdfs: [...pdfs, { ...file }]})
    } else {
      Object.assign(user, updateUserDto, { images: [...images, { ...file }]})
    }
     
    return await this.userRepository.save(user);
  }

}
