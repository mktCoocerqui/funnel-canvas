import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateProjectDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  workspaceId: string;

  // Set when this project is a card's dedicated drill-down "page" rather
  // than a top-level project.
  @IsOptional()
  @IsString()
  parentCardId?: string;
}
