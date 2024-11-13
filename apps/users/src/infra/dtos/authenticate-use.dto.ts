import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsString, MinLength } from 'class-validator'

export class AuthenticateUserDto {
  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'Email do usuário',
  })
  @IsEmail({}, { message: 'Invalid email format' })
  email: string

  @ApiProperty({
    example: 'password123',
    description: 'Senha do usuário',
    minLength: 6,
  })
  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string
}
