import { UserRoles } from '../user.roles';

export class UserJwtPayload {
  constructor(public user_id: number, public role: UserRoles) {}
}
