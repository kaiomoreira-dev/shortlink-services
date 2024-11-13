import { ApiProperty } from '@nestjs/swagger'

export class RegisterUserDto {
  @ApiProperty({ example: 'John Doe', description: 'Nome completo do usuário' })
  name: string

  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'Email do usuário',
  })
  email: string

  @ApiProperty({
    example: 'password123',
    description: 'Senha do usuário',
    minLength: 6,
  })
  password: string
}
