import { Entity, ManyToOne } from "typeorm";
import { Seller } from "./Seller.entity";
import { User } from "./User.entity";

@Entity({ name: 'SellerLiked' })
export class SellerLiked {
    @ManyToOne(() => Seller, { primary: true, onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    seller: Seller

    @ManyToOne(() => User, { primary: true, onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    user: User

    constructor(partial: Partial<SellerLiked>) {
        Object.assign(this, partial)
    }
}