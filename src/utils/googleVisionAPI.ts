// OCR processing via secure backend proxy
// API key stays on server - never exposed to client

import * as FileSystem from "expo-file-system/legacy";

interface OCRResult {
  text: string;
  success: boolean;
  error?: string;
  confidence?: number;
}

// Backend proxy URL (deploy the ocr-proxy-server and set this)
// For local testing: "http://localhost:3000"
// For production: "https://your-app.vercel.app" (or your deployment URL)
const OCR_PROXY_URL =
  process.env.EXPO_PUBLIC_OCR_PROXY_URL || "http://localhost:3000";

// Fallback: Direct Google Vision API (less secure - only use if proxy unavailable)
const USE_DIRECT_API = true; // Set to true for now - we'll secure it later
const GOOGLE_VISION_API_KEY =
  process.env.EXPO_PUBLIC_GOOGLE_VISION_API_KEY || "";
const GOOGLE_VISION_API_URL = `https://vision.googleapis.com/v1/images:annotate?key=${GOOGLE_VISION_API_KEY}`;

/**
 * Convert image URI to base64 string
 */
const convertImageToBase64 = async (imageUri: string): Promise<string> => {
  try {
    console.log("Converting image to base64:", imageUri);
    
    // Handle different URI formats
    let fileUri = imageUri;
    if (!fileUri.startsWith("file://") && !fileUri.startsWith("http")) {
      fileUri = `file://${fileUri}`;
    }
    
    const base64 = await FileSystem.readAsStringAsync(fileUri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    
    console.log("Base64 conversion successful, length:", base64.length);
    return base64;
  } catch (error) {
    console.error("Error converting image to base64:", error);
    throw new Error(`Failed to convert image to base64: ${error}`);
  }
};

/**
 * Extract text from an image using secure backend proxy
 * API key stays on server - never exposed to client
 */
export const extractTextFromImage = async (
  imageUri: string
): Promise<OCRResult> => {
  try {
    console.log("Starting OCR for image:", imageUri);

    // Convert image to base64
    const base64Image = await convertImageToBase64(imageUri);
    console.log("Image converted to base64, length:", base64Image.length);

    // Use backend proxy (secure) or direct API (less secure)
    if (USE_DIRECT_API && GOOGLE_VISION_API_KEY) {
      return await extractTextDirectAPI(base64Image);
    }

    // Use secure backend proxy
    return await extractTextViaProxy(imageUri, base64Image);
  } catch (error) {
    console.error("OCR error:", error);
    return {
      text: "",
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
};

/**
 * Extract text via secure backend proxy
 */
const extractTextViaProxy = async (
  imageUri: string,
  base64Image: string
): Promise<OCRResult> => {
  try {
    // Send base64 image as JSON (simpler for React Native)
    const response = await fetch(`${OCR_PROXY_URL}/ocr`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        image: base64Image,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        text: "",
        success: false,
        error:
          errorData.error ||
          `Proxy server error: ${response.status} ${response.statusText}`,
      };
    }

    const result = await response.json();

    if (!result.success) {
      return {
        text: "",
        success: false,
        error: result.error || "OCR processing failed",
      };
    }

    console.log("OCR via proxy completed");
    console.log("Extracted text length:", result.text.length);

    return {
      text: result.text,
      success: true,
    };
  } catch (error) {
    console.error("Proxy OCR error:", error);
    return {
      text: "",
      success: false,
      error: error instanceof Error ? error.message : "Proxy request failed",
    };
  }
};

/**
 * Extract text directly from Google Vision API (fallback - less secure)
 */
const extractTextDirectAPI = async (
  base64Image: string
): Promise<OCRResult> => {
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

  const response = await fetch(GOOGLE_VISION_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = `API error: ${response.status} ${response.statusText}`;
      
      // Parse error details for better messages
      try {
        const errorJson = JSON.parse(errorText);
        if (errorJson.error) {
          errorMessage = errorJson.error.message || errorMessage;
        }
      } catch (e) {
        // If parsing fails, use the raw error text
        if (errorText) {
          errorMessage = errorText;
        }
      }
      
      // Provide helpful error messages for common issues
      if (response.status === 403) {
        errorMessage = `403 Forbidden: ${errorMessage}. This usually means:\n1. Vision API is not enabled\n2. Billing is not set up\n3. API key restrictions are blocking the request\n\nCheck: https://console.cloud.google.com/apis/api/vision.googleapis.com/overview`;
      } else if (response.status === 400) {
        errorMessage = `400 Bad Request: ${errorMessage}. Check your API key format.`;
      } else if (response.status === 401) {
        errorMessage = `401 Unauthorized: ${errorMessage}. Your API key may be invalid.`;
      }
      
    console.error("Google Vision API Error Details:", errorText);
    return {
      text: "",
      success: false,
      error: errorMessage,
    };
  }

  const result = await response.json();
  let extractedText = "";

  if (
    result.responses &&
    result.responses[0] &&
    result.responses[0].fullTextAnnotation
  ) {
    extractedText = result.responses[0].fullTextAnnotation.text;
  } else if (
    result.responses &&
    result.responses[0] &&
    result.responses[0].textAnnotations &&
    result.responses[0].textAnnotations.length > 0
  ) {
    extractedText = result.responses[0].textAnnotations[0].description;
  }

  if (!extractedText) {
    return {
      text: "",
      success: false,
      error: "No text detected in image",
    };
  }

  return {
    text: extractedText,
    success: true,
  };
};

/**
 * Parse receipt text into structured data
 * Enhanced parser for receipt-specific formats
 */
export const parseReceiptText = (text: string) => {
  console.log("Parsing receipt text, length:", text.length);

  const lines = text
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  console.log("Parsed lines:", lines.length);
  console.log("First 10 lines:", lines.slice(0, 10));

  // Extract restaurant name (usually first non-empty line that looks like a name)
  let restaurantName = "Unknown Restaurant";
  for (const line of lines.slice(0, 8)) {
    if (
      line.length > 3 &&
      line.length < 60 &&
      !line.match(/^\d+/) &&
      !line.includes("$") &&
      !line.toLowerCase().includes("date") &&
      !line.toLowerCase().includes("time") &&
      !line.toLowerCase().includes("receipt") &&
      !line.toLowerCase().includes("invoice")
    ) {
      restaurantName = line;
      break;
    }
  }

  // Extract items (lines with prices)
  const items: Array<{ name: string; price: number; quantity: number }> = [];
  // More flexible price patterns
  const pricePatterns = [
    /\$(\d+\.\d{2})/,           // $10.50
    /\$(\d+\.\d{1})/,           // $10.5
    /\$(\d+)/,                  // $10
    /(\d+\.\d{2})\s*\$/,       // 10.50$
    /(\d+\.\d{1})\s*\$/,       // 10.5$
    /(\d+)\s*\$/,               // 10$
    /(\d+\.\d{2})/,             // 10.50
    /(\d+\.\d{1})/,             // 10.5
  ];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    let priceMatch = null;
    let price = 0;
    
    // Try each price pattern
    for (const pattern of pricePatterns) {
      const match = line.match(pattern);
      if (match) {
        const extractedPrice = parseFloat(match[1].replace(/,/g, ""));
        if (extractedPrice > 0 && extractedPrice < 1000) {
          priceMatch = match;
          price = extractedPrice;
          break;
        }
      }
    }
    
    if (!priceMatch) continue;

    // Skip if it's a total/subtotal/tax line
    const lowerLine = line.toLowerCase();
    if (
      lowerLine.includes("total") ||
      lowerLine.includes("subtotal") ||
      lowerLine.includes("tax") ||
      lowerLine.includes("tip") ||
      lowerLine.includes("amount due") ||
      lowerLine.includes("change") ||
      lowerLine.includes("balance") ||
      lowerLine.includes("paid")
    ) {
      continue;
    }

    // Extract item name (text before the price)
    const priceIndex = line.indexOf(priceMatch[0]);
    let itemName = line.substring(0, priceIndex).trim();
    
    // If no text before price, check previous line
    if (!itemName || itemName.length < 2) {
      if (i > 0) {
        const prevLine = lines[i - 1].trim();
        // Check if previous line looks like an item name
        if (
          prevLine.length > 1 &&
          prevLine.length < 60 &&
          !prevLine.match(/^\$?\d+\.?\d*$/) && // Not just a price
          !prevLine.toLowerCase().includes("total") &&
          !prevLine.toLowerCase().includes("subtotal") &&
          !prevLine.toLowerCase().includes("tax")
        ) {
          itemName = prevLine;
        }
      }
    }

    // Clean up item name
    itemName = itemName
      .replace(/^\d+\s*x?\s*/i, "") // Remove leading quantity
      .replace(/\s+/g, " ") // Normalize spaces
      .trim();

    if (itemName.length > 1 && price > 0 && price < 1000) {
      // Try to extract quantity
      let quantity = 1;
      const quantityMatch = line.match(/^(\d+)\s*x?\s*/i);
      if (quantityMatch) {
        quantity = parseInt(quantityMatch[1], 10);
      }

      items.push({
        name: itemName,
        price,
        quantity,
      });
    }
  }

  // Extract financial information
  let subtotal = 0;
  let tax = 0;
  let total = 0;

  for (const line of lines) {
    const lowerLine = line.toLowerCase();
    const priceMatch = line.match(/\$?(\d+\.\d{2})/);

    if (priceMatch) {
      const amount = parseFloat(priceMatch[1]);

      if (lowerLine.includes("subtotal")) {
        subtotal = amount;
      } else if (
        lowerLine.includes("tax") &&
        !lowerLine.includes("subtotal")
      ) {
        tax = amount;
      } else if (
        lowerLine.includes("total") &&
        !lowerLine.includes("subtotal")
      ) {
        total = amount;
      }
    }
  }

  // Calculate subtotal from items if not found
  if (subtotal === 0 && items.length > 0) {
    subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  // Calculate total if not found
  if (total === 0) {
    total = subtotal + tax;
  }

  console.log(
    `Parsed: ${items.length} items, subtotal: $${subtotal.toFixed(2)}, tax: $${tax.toFixed(2)}, total: $${total.toFixed(2)}`
  );
  
  // Log all lines with prices for debugging
  if (items.length === 0) {
    console.log("⚠️ No items found. Lines with potential prices:");
    lines.forEach((line, idx) => {
      if (/\$?\d+\.?\d*/.test(line)) {
        console.log(`  Line ${idx}: "${line}"`);
      }
    });
  }

  return {
    restaurantName,
    items:
      items.length > 0
        ? items
        : [{ name: "No items detected - check raw text", price: 0, quantity: 1 }],
    subtotal: subtotal > 0 ? subtotal : 0,
    tax: tax > 0 ? tax : 0,
    total: total > 0 ? total : 0,
    date: new Date().toISOString(),
    rawText: text,
  };
};
