import { type SchemaTypeDefinition } from 'sanity'
import { promotionCodes } from './schemas/promotion-codes'
import { promotionCampaign } from './schemas/promotion-campaign'
import { productCategory } from './schemas/product-category'
import { product } from './schemas/product'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    promotionCodes,
    promotionCampaign,
    productCategory,
    product
  ],
}
