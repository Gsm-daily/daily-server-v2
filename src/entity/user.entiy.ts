import { cp } from 'fs';
import {
    Entity, PrimaryColumn, Column
} from 'typeorm';

@Entity('user')
export class User{

    @PrimaryColumn()
    email : string

    @Column()
    password : string

    @Column()
    nickname : string
}