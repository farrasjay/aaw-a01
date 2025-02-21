import { db } from "@src/db";
import { NewCart } from "@db/schema/orders/cart";
import * as schema from '@db/schema/orders/cart';

export const addItemToCart = async (data: NewCart) => {
    const result = await db
        .insert(schema.cart)
        .values(data)
        .returning({
            id: schema.cart.id,
            product_id: schema.cart.product_id,
            quantity: schema.cart.quantity,
        })
    return result?.[0];
}