import { UserGroup } from 'src/entity/UserGroup.entity';
import { User } from 'src/entity/User.entity';
import { Entity, JoinColumn, ManyToOne } from "typeorm";



@Entity({ name: 'UserGroups-Users' })
export class UserGroupUser {
    @ManyToOne(() => User, (user) => user.userGroupUser, { primary: true, onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    @JoinColumn()
    user: User

    @ManyToOne(() => UserGroup, (group) => group.userGroupUser, { primary: true, onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    @JoinColumn()
    userGroup: UserGroup


    constructor(partial: Partial<UserGroupUser>) {
        Object.assign(this, partial);
    }
}