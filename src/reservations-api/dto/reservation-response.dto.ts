import { ApiProperty } from '@nestjs/swagger';

class hotelRoom {
  @ApiProperty({ example: '1', description: 'Описание номера' })
  description: string;

  @ApiProperty({ example: 'adadad', description: 'Фотографии номера' })
  images: string[];
}

class Hotel {
  @ApiProperty({ example: 'Киев', description: 'Название гостиницы' })
  title: string;

  @ApiProperty({ example: '4 звезды', description: 'Описание гостиницы' })
  description: string;
}

export class ReservationResponseDto {
  @ApiProperty({ example: '2023-06-28T19:08:53Z', description: 'Дата заезда' })
  startDate: string;

  @ApiProperty({ example: '2023-07-05T19:50:24Z', description: 'Дата выезда' })
  endDate: string;

  @ApiProperty({ description: 'Информация об отеле' })
  hotelRoom: hotelRoom;

  @ApiProperty({ description: 'Информация об гостинице' })
  hotel: Hotel;
}
