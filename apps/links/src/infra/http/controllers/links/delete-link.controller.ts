import {
  BadRequestException,
  Controller,
  Delete,
  HttpCode,
  Param,
} from '@nestjs/common'
import { DeleteLinksUseCase } from '@/domain/links/usecases/links/delete-link'
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger'

@Controller('/links/:id')
export class DeleteLinksController {
  constructor(private deleteLinkUseCase: DeleteLinksUseCase) {}

  @Delete()
  @HttpCode(204)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Delete a link',
    description:
      'Deletes a link by its ID if it belongs to the authenticated user.',
  })
  @ApiResponse({ status: 204, description: 'Link successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Link not found.' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden. The link does not belong to the user.',
  })
  async handle(@Param('id') linkId: string) {
    const result = await this.deleteLinkUseCase.execute({
      linkId,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
