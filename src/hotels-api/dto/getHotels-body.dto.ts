import { ApiProperty } from '@nestjs/swagger';

export class GetHotelsBodyDto {
  @ApiProperty({ example: 'Киев', description: 'Название гостиницы' })
  title: string;

  @ApiProperty({ example: '4 звезды', description: 'Описание гостиницы' })
  description: string;
}
