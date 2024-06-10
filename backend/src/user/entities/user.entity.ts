import { Image } from '../../image/entities/image.entity';
import { PDF } from '../../pdf/entities/pdf.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 500 })
  username: string;

  @Column({
    nullable: true,
  })
  role: string;

  @Column({
    unique: true,
    nullable: true,
  })
  email: string;

  @Column()
  password: string;

  @Column({
    default: true,
  })
  active: boolean;

  @OneToMany(() => PDF, (pdf) => pdf.user, { cascade: true, eager: true })
  pdfs: PDF[]

  @OneToMany(() => Image, (image) => image.user, { cascade: true, eager: true })
  images: Image[]

  @CreateDateColumn()
  created_at: Date; // Creation date

  @UpdateDateColumn()
  updated_at: Date; // Last updated date

  @Column({
    default: 0,
    nullable: true,
  })
  resetPasswordToken?: string;


 
}