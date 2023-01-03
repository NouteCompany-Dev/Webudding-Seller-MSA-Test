import { Product } from 'src/entity/Product.entity';
import { Entity, JoinColumn, ManyToOne } from "typeorm";
import { ProductGroup } from './ProductGroup.entity';



@Entity({ name: 'ProductGroups-Products' })
export class ProductGroupProduct {
    @ManyToOne(() => Product, (product) => product.productGroupProduct, { primary: true, onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    @JoinColumn()
    product: Product

    @ManyToOne(() => ProductGroup, (group) => group.productGroupProduct, { primary: true, onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    @JoinColumn()
    productGroup: ProductGroup


    constructor(partial: Partial<ProductGroupProduct>) {
        Object.assign(this, partial);
    }
}