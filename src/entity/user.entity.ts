import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToMany } from 'typeorm';
import { Cron } from './cron.entity';

@Entity('Users')
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column('datetime')
    createdAt?: Date;

    @Column()
    email?: string;

    @Column()
    username?: string;

    @Column({ nullable: true})
    firstName?: string;

    @Column({ nullable: true })
    lastName?: string;

    @Column()
    password?: string;

    @Column('text', { nullable: true })
    bio?: string;

    @Column({ default: false })
    removed?: boolean;

    @Column({ nullable: true })
    image?: string;

    @Column({ nullable: true })
    backgroundImage?: string;

    @OneToMany(() => Cron, (cron) => cron.user)
    crons?: Cron[]
}