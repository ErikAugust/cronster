import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { CronPost } from './cron-post.entity';

@Entity('Crons')
export class Cron extends BaseEntity {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column('datetime')
    createdAt?: Date;

    @Column()
    datetime?: string;

    @Column()
    title?: string;

    @Column()
    image?: string;

    @Column('text', { nullable: true })
    description?: string;

    @Column({ default: true })
    active?: boolean;

    @Column({ default: false })
    deleted?: boolean;

    @Column({ default: true })
    public?: boolean;

    @Column()
    slug?: string;

    @Column({ default: false })
    confetti?: boolean;

    @ManyToOne(() => User, (user) => user.crons)
    user?: User

    @OneToMany(() => CronPost, (post) => post.cron)
    posts?: CronPost[]

    date?: string;

    sharedImage?: string;




}