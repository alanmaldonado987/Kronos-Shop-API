import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { LoginAuthDto } from './dto/login-auth.to';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Auth } from './entities/auth.entity';
import { Role } from '../roles/entities/role.entity';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Auth) private readonly authRepository: Repository<Auth>,
    @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
    private jwtService: JwtService,
  ) {}

  async create(createAuthDto: CreateAuthDto) {
    const { role_name, ...createAuthDtoData } = createAuthDto;

    const searchRole = await this.roleRepository.findOne({
      where: { role: 'user' },
    });

    if (!searchRole) throw new NotFoundException('Rol no encontrado...');

    const searchUser = await this.authRepository.findOne({
      where: { email: createAuthDto.email },
    });

    if (searchUser) throw new ConflictException('El usuario ya existe..');

    const newUser = this.authRepository.create({
      ...createAuthDtoData,
      role: searchRole,
    });

    if (!newUser)
      throw new InternalServerErrorException('El usuario no ha sido creado...');

    await this.authRepository.save(newUser);

    return newUser;
  }

  async login(loginAuthDto: LoginAuthDto) {
    const { email } = loginAuthDto;

    const searchUser = await this.authRepository.findOne({
      where: { email: email },
      relations: ['role'],
    });

    if (!searchUser) throw new NotFoundException('Credenciales Incorrectas...');

    const payload = {
      email: searchUser.email,
      role: searchUser.role.role,
    };

    const token = await this.jwtService.signAsync(payload);

    const { role } = searchUser;

    return {
      token,
      email,
      role,
    };
  }
}
