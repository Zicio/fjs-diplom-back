import { ApiProperty } from '@nestjs/swagger';

export class AddReservationBodyDto {
  @ApiProperty({ example: '1', description: 'Идентификатор номера' })
  readonly room: string;

  @ApiProperty({ example: '2023-06-28T19:08:53Z', description: 'Дата заезда' })
  readonly startDate: string;

  @ApiProperty({ example: '2023-07-05T19:50:24Z', description: 'Дата выезда' })
  readonly endDate: string;
}
