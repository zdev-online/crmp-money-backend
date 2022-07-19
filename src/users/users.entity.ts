import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'users' })
export class UsersEntity {
  @Column({ type: 'bigint' })
  @PrimaryGeneratedColumn('increment')
  public user_id: number;

  @Index('email')
  @Column({ type: 'varchar', nullable: true, default: null, unique: true })
  public email?: string;

  @Column({ type: 'bool', default: false })
  public email_confirmed: boolean;

  @Index('login')
  @Column({ type: 'varchar', unique: true })
  public login: string;

  @Column({ type: 'varchar' })
  public password: string;

  @Index('vk_id')
  @Column({ type: 'bigint', nullable: true, default: null, unique: true })
  public vk_id?: number;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  public created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  public updated_at: Date;
}
