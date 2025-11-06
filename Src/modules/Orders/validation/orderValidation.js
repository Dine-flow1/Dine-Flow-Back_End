import Joi from 'joi';

export const createOrderSchema = Joi.object({
  customerId: Joi.string()
    .required()
    .regex(/^[0-9a-fA-F]{24}$/)
    .message('Invalid customer ID'),

  restorentId: Joi.string()
    .required()
    .regex(/^[0-9a-fA-F]{24}$/)
    .message('Invalid restaurant ID'),

  items: Joi.array()
    .items(
      Joi.object({
        itemId: Joi.string()
          .required()
          .regex(/^[0-9a-fA-F]{24}$/)
          .message('Invalid item ID'),
        quantity: Joi.number()
          .required()
          .min(1)
          .message('Quantity must be at least 1')
      })
    )
    .min(1)
    .required()
    .messages({
      'array.base': 'Items must be an array',
      'array.min': 'At least one item is required'
    }),

  // Optional: extra fields
  deliveryInstructions: Joi.string().optional()
});
 