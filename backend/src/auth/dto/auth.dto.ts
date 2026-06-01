import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { Role } from '@prisma/client';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  password: string;

  @IsEnum(Role)
  @IsOptional()
  role?: Role;

  // Profile data
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsNotEmpty()
  country: string;

  @IsString()
  @IsNotEmpty()
  timezone: string;

  // Student specific
  @IsString()
  @IsOptional()
  preferredLanguage?: string;

  @IsString()
  @IsOptional()
  learningGoals?: string;

  @IsString()
  @IsOptional()
  currentTier?: string;

  // Lecturer specific
  @IsString()
  @IsOptional()
  bio?: string;

  @IsString()
  @IsOptional()
  qualifications?: string;

  @IsOptional()
  specializations?: any; // parsed as JSON / Array

  @IsOptional()
  languages?: any; // parsed as JSON / Array

  @IsString()
  @IsOptional()
  payoutMethod?: string;

  @IsString()
  @IsOptional()
  payoutDetails?: string;
}

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
