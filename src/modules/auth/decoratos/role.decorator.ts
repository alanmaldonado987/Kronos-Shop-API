import { SetMetadata } from '@nestjs/common';
import { Role } from '../enum/role.enum';

export const ROLES_KEY = 'roles';
export const Roles = (roles) => SetMetadata(ROLES_KEY, roles);
