import { ApiProperty } from '@nestjs/swagger';

export class LoginResponseDto {
  @ApiProperty({ example: 'mail@mail.ru', description: 'Электронная почта' })
  readonly email: string;

  @ApiProperty({ example: 'Иван', description: 'Имя пользователя' })
  readonly name: string;

  @ApiProperty({ example: '89271111111', description: 'Телефон пользователя' })
  readonly contactPhone: string;
}
