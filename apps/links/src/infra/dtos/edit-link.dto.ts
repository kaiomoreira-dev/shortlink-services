// src/infra/dtos/edit-link.dto.ts
import { ApiProperty } from '@nestjs/swagger'
import { IsUrl, IsNotEmpty } from 'class-validator'

export class EditLinkDto {
  @ApiProperty({
    description: 'The new original URL for the link',
    example: 'https://newexample.com',
  })
  @IsUrl()
  @IsNotEmpty()
  newOriginalUrl: string
}
