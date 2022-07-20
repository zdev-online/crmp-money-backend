import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'tokens' })
export class TokensEntity {
  @Column({ type: 'bigint' })
  @PrimaryGeneratedColumn('increment')
  public id: number;

  @Column({ type: 'varchar' })
  public uuid: string;

  @Column({ type: 'bigint' })
  public user_id: number;

  @Column({ type: 'text' })
  public value: string;

  @Column({ type: 'bigint' })
  public expires_at: number;
}
