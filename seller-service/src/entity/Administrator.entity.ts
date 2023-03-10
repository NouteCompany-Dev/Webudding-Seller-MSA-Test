import { Column, CreateDateColumn, JoinTable, ManyToMany, UpdateDateColumn } from 'typeorm';
import { Entity, PrimaryGeneratedColumn } from 'typeorm';
import { AdministratorGroup } from './AdministratorGroup.entity';
import { Department, MasterAuth } from './enum/enum';

@Entity({ name: 'Administrators' })
export class Administrator {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ unique: true, nullable: false })
    email: string

    @Column({ length: 255 })
    password: string

    @Column({ length: 10 })
    name: string

    @Column({ length: 255 })
    phone: string

    @Column({ type: 'enum', enum: Department })
    department: string

    @Column({ length: 2000, nullable: true })
    memo: string

    @Column()
    enabled: boolean

    @Column({ type: 'enum', enum: MasterAuth, default: MasterAuth.manager })
    auth: MasterAuth

    @Column({ type: 'int' })
    validCount: number

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date

    @ManyToMany(() => AdministratorGroup, (group) => group.id)
    @JoinTable({
        name: 'Administrators-AdministratorGroups',
        joinColumn: { name: 'adminId' },
        inverseJoinColumn: { name: 'groupId' }
    })
    group: AdministratorGroup[]

    constructor(partial: Partial<Administrator>) {
        Object.assign(this, partial);
    }
}