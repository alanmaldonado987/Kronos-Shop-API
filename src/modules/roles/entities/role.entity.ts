import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Auth } from 'src/modules/auth/entities/auth.entity';

@Entity()
export class Role {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  role: string;

  @OneToMany(() => Auth, (auth) => auth.role)
  @JoinColumn({ name: 'user_id' })
  auth: Auth[];
}
