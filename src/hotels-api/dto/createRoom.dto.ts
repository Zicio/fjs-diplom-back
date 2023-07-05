import { ApiProperty } from '@nestjs/swagger';
import { ID } from '../../globalType';

export class CreateRoomDto {
  @ApiProperty({ example: 'люкс', description: 'Описание номера' })
  readonly description: string;

  @ApiProperty({ example: '1', description: 'Идентификатор гостиницы' })
  readonly hotel: ID;

  @ApiProperty({
    type: 'array',
    items: { type: 'string', format: 'binary' },
    description: 'Фотографии номера (файлы)',
  })
  images: Express.Multer.File[];
}
