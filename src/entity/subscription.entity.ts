import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';

@Entity('Subscriptions')
export class Subscription extends BaseEntity {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column('datetime')
    createdAt?: Date;

    @Column()
    email?: string;

    @Column()
    ipAddress?: string;
}