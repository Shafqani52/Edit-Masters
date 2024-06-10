import { User } from '../../user/entities/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('pdfs')
export class PDF {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  path: string;

  @Column()
  filename: string;

  @Column()
  originalname: string;

  @Column()
  mimetype: string;

  @Column()
  size: number;

  @Column()
  destination: string;

  @Column()
  fieldname: string;

  @Column()
  encoding: string;

  @ManyToOne(() => User, (user) => user.pdfs)
  user: User

  @CreateDateColumn()
  created_at: Date; // Creation date

  @UpdateDateColumn()
  updated_at: Date; // Last updated date
}