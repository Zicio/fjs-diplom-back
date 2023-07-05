import { ApiProperty } from '@nestjs/swagger';

export class GetHotelsQueryDto {
  @ApiProperty({ example: '1', description: 'Количество' })
  readonly limit?: number;

  @ApiProperty({ example: '1', description: 'Смещение' })
  readonly offset?: number;

  @ApiProperty({ example: 'Киев', description: 'Название гостиницы' })
  title: string;
}
