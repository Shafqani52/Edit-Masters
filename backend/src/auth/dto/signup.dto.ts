import { CreateImageDto } from "src/image/dto/create-image.dto";
import { CreatePdfDto } from "src/pdf/dto/create-pdf.dto";

export class SignupDto {
    username: string;
    password: string;
    email: string;
    pdfs: CreatePdfDto[];
    images: CreateImageDto[];
    role: string; 
}