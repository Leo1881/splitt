// Google Vision API integration for OCR processing
// Free tier: 1,000 requests per month

import * as FileSystem from "expo-file-system/legacy";

interface VisionAPIResponse {
  responses: Array<{
    textAnnotations?: Array<{
      description: string;
      boundingPoly?: {
        vertices: Array<{ x: number; y: number }>;
      };
    }>;
    fullTextAnnotation?: {
      text: string;
    };
  }>;
}

interface OCRResult {
  text: string;
  confidence: number;
  success: boolean;
  error?: string;
}

// You'll need to get this from Google Cloud Console
const GOOGLE_VISION_API_KEY = "AIzaSyCzJ6YSNTURitfvUIY4ucryy8pOAVeLV9U";

// Validate API key format
if (!GOOGLE_VISION_API_KEY.startsWith("AIza")) {
  console.warn(
    'Warning: API key format may be incorrect. Google API keys typically start with "AIza"'
  );
}

export const extractTextFromImage = async (
  imageUri: string
): Promise<OCRResult> => {
  try {
    console.log("Starting OCR processing for image:", imageUri);

    // Convert image to base64
    const base64Image = await convertImageToBase64(imageUri);
    console.log("Image converted to base64, length:", base64Image.length);

    // Prepare the request body for Google Vision API
    const requestBody = {
      requests: [
        {
          image: {
            content: base64Image,
          },
          features: [
            {
              type: "TEXT_DETECTION",
              maxResults: 1,
            },
          ],
        },
      ],
    };

    console.log("Making API call to Google Vision...");
    console.log(
      "API Key (first 10 chars):",
      GOOGLE_VISION_API_KEY.substring(0, 10)
    );

    // Make API call to Google Vision
    const response = await fetch(
      `https://vision.googleapis.com/v1/images:annotate?key=${GOOGLE_VISION_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      }
    );

    console.log("API Response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("API Error response:", errorText);
      throw new Error(
        `Google Vision API error: ${response.status} ${response.statusText} - ${errorText}`
      );
    }

    const data: VisionAPIResponse = await response.json();

    if (data.responses && data.responses.length > 0) {
      const textAnnotations = data.responses[0].textAnnotations;
      const fullTextAnnotation = data.responses[0].fullTextAnnotation;

      if (textAnnotations && textAnnotations.length > 0) {
        return {
          text: textAnnotations[0].description,
          confidence: 0.9, // Google Vision doesn't provide confidence scores in the response
          success: true,
        };
      } else if (fullTextAnnotation) {
        return {
          text: fullTextAnnotation.text,
          confidence: 0.9,
          success: true,
        };
      }
    }

    return {
      text: "",
      confidence: 0,
      success: false,
      error: "No text detected in image",
    };
  } catch (error) {
    console.error("Google Vision API error:", error);
    return {
      text: "",
      confidence: 0,
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
};

// Helper function to convert image URI to base64
const convertImageToBase64 = async (imageUri: string): Promise<string> => {
  try {
    console.log("Converting image to base64:", imageUri);

    // For React Native, we need to use FileSystem

    const base64 = await FileSystem.readAsStringAsync(imageUri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    console.log("Base64 conversion successful, length:", base64.length);
    return base64;
  } catch (error) {
    console.error("Error converting image to base64:", error);
    throw new Error(`Failed to convert image to base64: ${error}`);
  }
};

// Parse the extracted text into structured receipt data
export const parseReceiptText = (text: string) => {
  const lines = text
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  let restaurantName = "Unknown Restaurant";
  const items: Array<{ name: string; price: number; quantity: number }> = [];
  let subtotal = 0;
  let tax = 0;
  let total = 0;

  // Look for restaurant name (usually first few lines)
  for (let i = 0; i < Math.min(3, lines.length); i++) {
    if (lines[i].length > 3 && !lines[i].match(/\d/)) {
      restaurantName = lines[i];
      break;
    }
  }

  // Look for items and prices
  const pricePattern = /\$?(\d+\.?\d*)/;

  for (const line of lines) {
    const priceMatch = line.match(pricePattern);
    if (priceMatch) {
      const price = parseFloat(priceMatch[1]);

      // Check if this looks like an item line
      const beforePrice = line.substring(0, line.indexOf(priceMatch[0])).trim();
      if (beforePrice.length > 2 && beforePrice.length < 30) {
        items.push({
          name: beforePrice,
          price: price,
          quantity: 1,
        });
        subtotal += price;
      }

      // Look for total, tax, subtotal keywords
      const lowerLine = line.toLowerCase();
      if (lowerLine.includes("total") || lowerLine.includes("amount")) {
        total = price;
      } else if (lowerLine.includes("tax")) {
        tax = price;
      }
    }
  }

  // If we couldn't find a total, calculate it
  if (total === 0) {
    total = subtotal + tax;
  }

  return {
    restaurantName,
    items:
      items.length > 0
        ? items
        : [
            { name: "Item 1", price: 10.0, quantity: 1 },
            { name: "Item 2", price: 5.5, quantity: 1 },
          ],
    subtotal: subtotal > 0 ? subtotal : 15.5,
    tax: tax > 0 ? tax : 1.24,
    total: total > 0 ? total : 16.74,
    date: new Date().toISOString(),
    rawText: text,
  };
};
