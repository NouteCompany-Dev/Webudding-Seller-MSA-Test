import { CreateDateColumn, Entity, ManyToOne } from "typeorm";
import { Product } from "./Product.entity";
import { User } from "./User.entity";

@Entity({ name: 'ProductViewed' })
export class ProductViewed {
    @ManyToOne(() => Product, { primary: true, onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    product: Product

    @ManyToOne(() => User, { primary: true, onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    user: User

    constructor(partial: Partial<ProductViewed>) {
        Object.assign(this, partial)
    }
}