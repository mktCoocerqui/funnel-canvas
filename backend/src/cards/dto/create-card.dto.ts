import { CardPriority, CardStatus, CardType } from '../../generated/prisma/enums';
import {
  IsArray,
  IsEnum,
  IsISO8601,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateCardDto {
  @IsOptional()
  @IsString()
  id?: string;

  @IsString()
  @IsNotEmpty()
  projectId: string;

  @IsEnum(CardType)
  type: CardType;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  color?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  responsavel?: string;

  @IsOptional()
  @IsEnum(CardStatus)
  status?: CardStatus;

  @IsOptional()
  @IsEnum(CardPriority)
  priority?: CardPriority;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsISO8601()
  dueDate?: string;

  @IsOptional()
  @IsString()
  expectedValue?: string;

  @IsOptional()
  @IsString()
  roi?: string;

  @IsOptional()
  @IsString()
  investimento?: string;

  @IsOptional()
  @IsString()
  ticketMedio?: string;

  @IsOptional()
  @IsString()
  conversao?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsNumber()
  positionX?: number;

  @IsOptional()
  @IsNumber()
  positionY?: number;
}
