import { EntityRepository, Repository } from 'typeorm';
import { User } from 'src/entity/user.entiy'

@EntityRepository(User)
export class AuthRepository extends Repository<User>{}