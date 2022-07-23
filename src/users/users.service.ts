import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { compare, genSalt, hash } from 'bcrypt';
import { plainToClass, plainToInstance } from 'class-transformer';
import { TokensService } from 'src/tokens/tokens.service';
import { Repository } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { CheckDuplicateResultDto } from './dto/check-duplicate-result.dto';
import { CreateUserDto } from './dto/create-user-dto';
import { UsersEntity } from './users.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersEntity)
    public usersRepository: Repository<UsersEntity>,
    public tokenService: TokensService,
  ) {}

  public async create(dto: CreateUserDto): Promise<UsersEntity> {
    return this.usersRepository.save(dto);
  }

  public async findByUserId(user_id: number): Promise<UsersEntity | null> {
    return this.usersRepository.findOneBy({ user_id });
  }

  public async findByVkId(vk_id: number): Promise<UsersEntity | null> {
    return this.usersRepository.findOneBy({ vk_id });
  }

  public async findByLogin(login: string): Promise<UsersEntity | null> {
    return this.usersRepository.findOneBy({ login });
  }

  public async findByEmail(email: string): Promise<UsersEntity | null> {
    return this.usersRepository.findOneBy({ email });
  }

  public async findByEmailOrLogin(email: string, login: string) {
    return this.usersRepository.findOneBy([{ email }, { login }]);
  }

  public async checkDuplicateCredentials(
    properties: Partial<Pick<UsersEntity, 'vk_id' | 'email' | 'login'>>,
  ): Promise<CheckDuplicateResultDto> {
    const where = Object.keys(properties).map((key) => ({
      [key]: properties[key],
    }));
    const user = await this.usersRepository.findOneBy(where);
    if (
      user?.email == properties.email &&
      typeof properties.email != 'undefined'
    ) {
      return plainToInstance(CheckDuplicateResultDto, {
        duplicate_key: 'email',
        message: 'Пользователь с такой почтой уже существует',
      });
    }
    if (
      user?.vk_id == properties.vk_id &&
      typeof properties.vk_id != 'undefined'
    ) {
      return plainToInstance(CheckDuplicateResultDto, {
        duplicate_key: 'vk_id',
        message: 'Этот профиль уже привязан к другому аккаунту',
      });
    }
    if (
      user?.login == properties.login &&
      typeof properties.login != 'undefined'
    ) {
      return plainToInstance(CheckDuplicateResultDto, {
        duplicate_key: 'login',
        message: 'Пользователь с таким логином уже существует',
      });
    }
    return null;
  }

  public async hashPassword(password: string): Promise<string> {
    const salt = await genSalt(15);
    return hash(password, salt);
  }

  public async isValidPassword(
    candidate: string,
    user_password: string,
  ): Promise<boolean> {
    return compare(candidate, user_password);
  }

  public async update(
    user_id: number,
    update: QueryDeepPartialEntity<UsersEntity>,
  ) {
    return this.usersRepository.update({ user_id }, update);
  }
}
