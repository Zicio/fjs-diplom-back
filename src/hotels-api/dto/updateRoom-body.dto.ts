import { ApiProperty } from '@nestjs/swagger';
import { ID } from '../../globalType';

export class UpdateRoomBodyDto {
  @ApiProperty({ example: 'люкс', description: 'Описание номера' })
  description: string;

  @ApiProperty({ example: '1', description: 'Идентификатор гостиницы' })
  hotel: ID;

  @ApiProperty({ example: 'true', description: 'Статус номера' })
  isEnabled: boolean;

  @ApiProperty({
    type: 'array',
    items: {
      oneOf: [{ type: 'string' }, { type: 'string', format: 'binary' }],
    },
    description: 'Фотографии номера (новые и/или ссылки на уже загруженные)',
  })
  images: Array<Express.Multer.File | string>;
}
