import { SetMetadata } from "@nestjs/common";
import { UserRoles } from "../users/user.roles";

export const Roles = (...roles: UserRoles[]) => SetMetadata('roles', roles);