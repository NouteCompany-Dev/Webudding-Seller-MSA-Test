import { Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "./Product.entity";
import { User } from "./User.entity";

@Entity({ name: 'ProductLiked' })
export class ProductLiked {
    @ManyToOne(() => Product, { primary: true, onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    product: Product

    @ManyToOne(() => User, { primary: true, onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    user: User

    constructor(partial: Partial<ProductLiked>) {
        Object.assign(this, partial)
    }
}