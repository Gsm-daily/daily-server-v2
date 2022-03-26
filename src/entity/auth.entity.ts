import { PrimaryColumn,Entity, Column, Exclusion } from "typeorm";
import { Exclude } from 'class-transformer';
@Entity()
export class Auth {

    @PrimaryColumn()
    email : string

    @Column()
    password : string

    @Column()
    nickname : string

    @Column({ nullable : true })
    @Exclude()
    currentHashedRefreshToken? : string
}