import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class UpdatePromotionDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  title?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  message?: string;

  @IsOptional()
  isActive?: boolean;
}
export class GetPromotionDto {
  title: string;
  message: string;
  isActive: boolean;
}
