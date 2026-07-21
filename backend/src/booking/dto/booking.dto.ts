import { IsDateString, IsNotEmpty, IsString } from 'class-validator';

export class CreateBookingDto {
  @IsString()
  @IsNotEmpty()
  lecturerId: string;

  @IsDateString()
  @IsNotEmpty()
  startsAt: string;
}
