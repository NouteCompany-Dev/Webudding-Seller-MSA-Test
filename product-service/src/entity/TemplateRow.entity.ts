import {
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Category } from './Category.entity';
import { TemplateColumn } from './TemplateColumn.entity';

@Entity({ name: 'TemplateRows' })
export class TemplateRow {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    englishName: string;

    @Column({ default: false })
    multiple: boolean;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;

    @OneToMany(() => Category, (category) => category.row, { cascade: true })
    category: Category;

    @OneToMany(() => TemplateColumn, (column) => column.row, { cascade: true })
    column: TemplateColumn[];

    constructor(partial: Partial<TemplateRow>) {
        Object.assign(this, partial);
    }
}
