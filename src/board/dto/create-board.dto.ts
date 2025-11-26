import { IsNotEmpty, IsString, MinLength, MaxLength } from 'class-validator';

export class CreateBoardDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  title: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(5000)
  content: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  author: string;
}
