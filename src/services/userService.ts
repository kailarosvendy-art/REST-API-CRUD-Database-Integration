import { randomBytes, scryptSync } from 'node:crypto';
import type { UserResponseDto } from '../dtos/userDto.ts';
import { UserRepository } from '../repositories/userRepository.ts';

export interface CreateUserInput {
  name: string;
  email: string;
  password: string;
}

type UserRow = NonNullable<Awaited<ReturnType<UserRepository['create']>>>;

export class UserService {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository = new UserRepository()) {
    this.userRepository = userRepository;
  }

  async getAllUsers(): Promise<UserResponseDto[]> {
    return this.userRepository.findAll();
  }

  private toDto(row: UserRow): UserResponseDto {
    return {
      id: row.id,
      name: row.name,
      email: row.email,
      role: row.role,
      createdAt: row.createdAt,
    };
  }

  async createUser(input: CreateUserInput): Promise<UserResponseDto> {
    const salt = randomBytes(16).toString('hex');
    const passwordHash = `scrypt$${salt}$${scryptSync(input.password, salt, 64).toString('hex')}`;
    const row = await this.userRepository.create({
      name: input.name,
      email: input.email,
      passwordHash,
    });
    if (!row) throw new Error('USER_CREATE_FAILED');
    return this.toDto(row);
  }
}