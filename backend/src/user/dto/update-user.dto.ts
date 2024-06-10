import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { CreatePdfDto } from 'src/pdf/dto/create-pdf.dto';
import { CreateImageDto } from 'src/image/dto/create-image.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {}
export class getUserDto {
    email: string;
    username: string;
    pdfs: CreatePdfDto[];
    images: CreateImageDto[];
    role: string;
    active: boolean;
    resetPasswordToken?: string;
}
