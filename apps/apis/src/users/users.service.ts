import { CreateUserDto } from './dto/createUser.dto';
import { InviteUserDto, inviteUserPayload } from './dto/inviteUser.dto';
import { UserDto } from './dto/user.dto';
import { JWTService } from '@/common/jwt.service';
import { TeamEntity, UserEntity } from '@/databases/entities';
import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { InjectQueue } from '@nestjs/bull';
import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Queue } from 'bull';
import * as uuid from 'uuid';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepo: EntityRepository<UserEntity>,
    @InjectRepository(TeamEntity)
    private teamRepo: EntityRepository<TeamEntity>,
    @InjectQueue('email') private emailQueue: Queue,
    private common: JWTService,
  ) {}

  async login(userDto: Required<UserDto>) {
    const user = await this.getByEmail(userDto.email);
    if (!user) throw new NotFoundException("User's email does not exist");

    await this.verifyPassword(userDto.password, user.password);
    const token = this.common.genToken({
      user_id: user.id,
      team_id: user.team_id ?? '',
    });

    return token;
  }

  async checkRefreshToken(refresh_token: string) {
    return this.common.veryfyReFreshToken(refresh_token);
  }

  async googleAuth(user: CreateUserDto) {
    const existedUser = await this.getByEmail(user.email);
    if (!existedUser) return this.register(user);

    const token = this.common.genToken({
      user_id: existedUser.id,
      team_id: existedUser.team_id ?? '',
    });

    return token;
  }

  async register(userDto: CreateUserDto) {
    const saltRounds = 10;
    let team_id = userDto.team_id ?? '';

    const existedUser = await this.getByEmail(userDto.email);
    if (existedUser)
      throw new BadRequestException("email's user already existed");

    const hash = await bcrypt.hash(userDto.password, saltRounds);

    if (!userDto?.team_id) {
      team_id = await this.createTeam({ name: userDto.name });
    }

    const user = await this.create({
      ...userDto,
      team_id,
      password: hash,
    });

    const token = this.common.genToken({
      user_id: user.id,
      team_id: user.team_id ?? '',
    });
    return token;
  }

  async confirmInvite(token: string) {
    const { email, team_id, password } = await this.common.verifyInviteToken(
      token,
    );
    const existedUser = await this.getByEmail(email);
    if (!existedUser)
      return this.register({
        team_id,
        email,
        password,
        name: email.split('@')[0],
      });

    return this.common.genToken({
      user_id: existedUser.id,
      team_id: existedUser.team_id ?? team_id,
    });
  }

  private async verifyPassword(
    plainTextPassword: string,
    hashedPassword: string,
  ) {
    const isPasswordMatching = await bcrypt.compare(
      plainTextPassword,
      hashedPassword,
    );
    if (!isPasswordMatching) {
      throw new HttpException(
        'Wrong credentials provided',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async getByEmail(email: string) {
    return this.usersRepo.findOne({ email });
  }

  async getById(id: string) {
    const user = await this.usersRepo.findOne(
      { id },
      { fields: ['name', 'email', 'avatar', 'created_at', 'updated_at'] },
    );
    if (!user) throw new NotFoundException("User's id does not exist");
    return user;
  }

  async create(user: CreateUserDto & { team_id: string }) {
    const userSchema = this.usersRepo.create({
      ...user,
      role: 'Owner',
    });
    await this.usersRepo.persistAndFlush(userSchema);
    return userSchema;
  }

  async inviteUser({ team_id, users }: inviteUserPayload) {
    users.emails.forEach((email) => {
      const password = uuid.v4();
      const token = this.common.inviteToken({
        team_id,
        email,
        password,
      });
      this.emailQueue.add({ email, token, password });
    });
  }

  async createTeam({ name }: { name: string }) {
    const team = this.teamRepo.create({ name, vip_plan: 'Free' });
    await this.teamRepo.persistAndFlush(team);
    return team.id;
  }

  async getTeamMember(team_id: string) {
    return this.usersRepo.find(
      { team_id },
      { fields: ['avatar', 'name', 'created_at', 'role', 'updated_at'] },
    );
  }
}
