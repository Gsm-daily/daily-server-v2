import { PrimaryColumn,Entity, Column } from "typeorm";

@Entity()
export class Auth {

    @PrimaryColumn()
    email : string

    @Column()
    password : string

    @Column()
    nickname : string
}