import { ApiProperty } from '@nestjs/swagger';
import { ID } from '../../globalType';

export class GetRoomsQueryDto {
  @ApiProperty({ example: '1', description: 'Количество' })
  limit?: number;

  @ApiProperty({ example: '1', description: 'Смещение' })
  offset?: number;

  @ApiProperty({ example: '1', description: 'Идентификатор гостиницы' })
  hotel: ID;
}
