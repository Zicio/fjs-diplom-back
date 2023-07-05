import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'mail@mail.ru', description: 'Электронная почта' })
  email: string;

  @ApiProperty({ example: '12345678', description: 'Пароль' })
  password: string;
}
