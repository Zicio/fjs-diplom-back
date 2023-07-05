import { ApiProperty } from '@nestjs/swagger';
import { ID } from '../../globalType';

export class HotelResponseDto {
  @ApiProperty({ example: '1', description: 'Идентификатор гостиницы' })
  id: ID;
  @ApiProperty({ example: 'Киев', description: 'Название гостиницы' })
  title: string;
  @ApiProperty({ example: '4 звезды', description: 'Описание гостиницы' })
  description: string;
}
