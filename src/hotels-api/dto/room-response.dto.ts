import { ApiProperty } from '@nestjs/swagger';
import { ID } from '../../globalType';

class Hotel {
  @ApiProperty({ example: '1', description: 'Идентификатор гостиницы' })
  id: ID;

  @ApiProperty({ example: 'Киев', description: 'Название гостиницы' })
  title: string;

  @ApiProperty({ example: '4 звезды', description: 'Описание гостиницы' })
  description?: string;
}

export class RoomResponseDto {
  @ApiProperty({ example: '1', description: 'Идентификатор номера' })
  id: ID;

  @ApiProperty({ example: 'люкс', description: 'Описание номера' })
  description: string;

  @ApiProperty({ example: 'adadad', description: 'Фотографии номера' })
  images: string[];

  @ApiProperty({
    example: 'true',
    description: 'Статус номера',
    required: false,
  })
  isEnabled?: boolean;

  @ApiProperty({ description: 'Информация о гостинице' })
  hotel: Hotel;
}
