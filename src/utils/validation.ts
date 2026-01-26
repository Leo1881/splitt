import { z } from "zod";

// Payee validation
export const payeeSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Name is required").max(50, "Name is too long"),
});

// Receipt item validation
export const receiptItemSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Item name is required"),
  price: z.number().min(0, "Price must be positive"),
  quantity: z.number().int().min(1, "Quantity must be at least 1"),
});

// Currency validation
export const currencySchema = z.object({
  code: z.string().length(3, "Currency code must be 3 characters"),
  symbol: z.string().min(1, "Symbol is required"),
  name: z.string().min(1, "Name is required"),
  country: z.string().min(1, "Country is required"),
});

// Restaurant name validation
export const restaurantNameSchema = z
  .string()
  .min(1, "Restaurant name is required")
  .max(100, "Restaurant name is too long");

// Tip validation
export const tipSchema = z.object({
  amount: z.number().min(0, "Tip cannot be negative"),
  percentage: z.number().min(0).max(100, "Tip percentage cannot exceed 100%"),
});

// Extracted receipt data validation
export const extractedReceiptDataSchema = z.object({
  restaurantName: z.string(),
  items: z.array(
    z.object({
      name: z.string(),
      price: z.number(),
      quantity: z.number(),
    })
  ),
  subtotal: z.number(),
  tax: z.number(),
  total: z.number(),
  date: z.string(),
  rawText: z.string(),
});

// Helper function to validate and parse
export function validateAndParse<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; error: string } {
  try {
    const parsed = schema.parse(data);
    return { success: true, data: parsed };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.errors.map((e) => e.message).join(", "),
      };
    }
    return { success: false, error: "Validation failed" };
  }
}
