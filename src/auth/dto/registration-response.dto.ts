import { ApiProperty } from '@nestjs/swagger';

export class RegistrationResponseDto {
  @ApiProperty({ example: '1', description: 'Id пользователя' })
  id: string;

  @ApiProperty({ example: 'mail@mail.ru', description: 'Электронная почта' })
  email: string;

  @ApiProperty({ example: 'Vasya', description: 'Имя пользователя' })
  name: string;
}
