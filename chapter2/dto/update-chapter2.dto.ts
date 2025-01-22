import { PartialType } from '@nestjs/mapped-types';
import { CreateChapter2Dto } from './create-chapter2.dto';

export class UpdateChapter2Dto extends PartialType(CreateChapter2Dto) {}
