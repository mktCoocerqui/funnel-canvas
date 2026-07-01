import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateConnectionDto {
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
