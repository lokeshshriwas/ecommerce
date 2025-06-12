import { type SchemaTypeDefinition } from 'sanity'
import { promotionCodes } from './schemas/promotion-codes'
import { promotionCampaign } from './schemas/promotion-campaign'
import { productCategory } from './schemas/product-category'
import { product } from './schemas/product'
import { order, orderItem, shippingAddress } from './schemas/order'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    promotionCodes,
    promotionCampaign,
    productCategory,
    product,
    shippingAddress,
    orderItem,
    order
  ],
}
