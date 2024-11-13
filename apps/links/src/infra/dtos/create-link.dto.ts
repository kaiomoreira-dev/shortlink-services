// create-link.dto.ts
import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsUrl } from 'class-validator'

export class CreateLinkDto {
  @ApiProperty({
    description: 'The original URL to be shortened',
    example: 'https://teddy360.com.br/',
  })
  @IsString()
  @IsUrl({}, { message: 'The original URL must be a valid URL' })
  originalUrl: string
}
