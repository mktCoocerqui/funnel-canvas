import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateConnectionDto {
  @IsOptional()
  @IsString()
  id?: string;

  @IsString()
  @IsNotEmpty()
  projectId: string;

  @IsString()
  @IsNotEmpty()
  sourceId: string;

  @IsString()
  @IsNotEmpty()
  targetId: string;

  @IsOptional()
  @IsString()
  label?: string;
}
