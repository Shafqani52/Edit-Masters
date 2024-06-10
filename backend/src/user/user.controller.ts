import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, ParseFilePipeBuilder, HttpStatus, UploadedFile } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Roles } from 'src/common/roles.decorator';
import { Role } from 'src/common/role.enum';

const MAX_PROFILE_PICTURE_SIZE_IN_BYTES = 2 * 1024 * 1024;

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // @Post()
  // create(@Body() createUserDto: CreateUserDto) {
  //   return this.userService.create(createUserDto);
  // }

  @Get()
  @Roles(Role.Admin)
  async findAll() {
    return await this.userService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return await this.userService.findOneById(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return await this.userService.update(+id, updateUserDto);
  }

  @Patch('activate/:id')
  async activate(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return await this.userService.activate(+id, updateUserDto); 
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.userService.remove(+id); 
  }

  @Patch('upload/:id')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, callback) => {
        const name = file.originalname.split('.')[0];
        const fileExtName = '.'+file.originalname.split('.')[1];
        const randomName = Array(4)
          .fill(null)
          .map(() => Math.round(Math.random() * 16).toString(16))
          .join('');
        callback(null, `${name}-${randomName}${fileExtName}`);
      },
    }) 
  }))
  async uploadFPdf(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto, @UploadedFile(
    new ParseFilePipeBuilder()
      .addFileTypeValidator({ fileType: '.(png|jpeg|jpg|pdf)' })
      .addMaxSizeValidator({ maxSize: MAX_PROFILE_PICTURE_SIZE_IN_BYTES })
      .build({ errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY }),
  )
  file,) {
    return await this.userService.uploadFile(+id, updateUserDto, file);
  }

}
