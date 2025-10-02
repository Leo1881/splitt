import * as Print from "expo-print";
import * as Sharing from "expo-sharing";

// Types for the PDF generation
export interface BillData {
  restaurantName: string;
  currency: {
    symbol: string;
    code: string;
  };
  subtotal: number;
  tipAmount: number;
  tipPercentage: number;
  total: number;
  payees: Array<{
    id: string;
    name: string;
  }>;
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
  }>;
  assignments: Array<{
    itemId: string;
    payees: Array<{
      id: string;
      name: string;
    }>;
    isSplit: boolean;
    quantities?: { [payeeId: string]: number };
  }>;
}

// Function to generate the HTML content for the PDF
const generateHTML = (data: BillData): string => {
  const currentDate = new Date().toLocaleDateString();
  const currentTime = new Date().toLocaleTimeString();

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Bill Split Summary</title>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
          margin: 0;
          padding: 0;
          color: #333;
          background-color: #f8f8f8;
        }
        .container {
          width: 100%;
          max-width: 500px;
          margin: 0 auto;
          padding: 20px;
          background-color: #fff;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .header {
          text-align: center;
          margin-bottom: 20px;
        }
        .header h1 {
          color: #6a0dad; /* Purple */
          font-size: 28px;
          margin: 0;
        }
        .header h2 {
          color: #555;
          font-size: 18px;
          margin: 5px 0;
        }
        .header p {
          color: #777;
          font-size: 14px;
          margin: 2px 0;
        }
        .section-title {
          font-size: 20px;
          color: #6a0dad; /* Purple */
          border-bottom: 1px solid #eee;
          padding-bottom: 8px;
          margin-top: 20px;
          margin-bottom: 15px;
          font-weight: bold;
        }
        .summary-row {
          display: flex;
          justify-content: space-between;
          padding: 5px 0;
          font-size: 16px;
        }
        .summary-row.total {
          font-weight: bold;
          border-top: 1px dashed #ccc;
          padding-top: 10px;
          margin-top: 10px;
          font-size: 18px;
          color: #6a0dad; /* Purple */
        }
        .payee-list .payee-item {
          display: flex;
          justify-content: space-between;
          padding: 5px 0;
          font-size: 16px;
        }
        .payee-list .payee-name {
          font-weight: 600;
        }
        .footer {
          text-align: center;
          margin-top: 30px;
          font-size: 12px;
          color: #aaa;
        }
        .currency {
          font-weight: bold;
        }
        .payee-breakdown {
          margin-bottom: 20px;
        }
        .payee-section {
          margin-bottom: 20px;
          border: 1px solid #eee;
          border-radius: 8px;
          padding: 15px;
          background-color: #fafafa;
        }
        .payee-header {
          display: flex;
          justify-content: space-between;
          font-weight: bold;
          margin-bottom: 12px;
          padding-bottom: 8px;
          border-bottom: 2px solid #6a0dad;
        }
        .payee-header .payee-name {
          color: #6a0dad;
          font-size: 18px;
        }
        .payee-header .payee-total {
          color: #6a0dad;
          font-size: 18px;
        }
        .payee-items {
          margin-left: 10px;
        }
        .payee-item-row {
          display: flex;
          justify-content: space-between;
          padding: 5px 0;
          font-size: 14px;
          border-bottom: 1px solid #eee;
        }
        .payee-item-row:last-child {
          border-bottom: none;
        }
        .payee-item-row .item-name {
          color: #333;
        }
        .payee-item-row .item-price {
          color: #6a0dad;
          font-weight: 600;
        }
        .payee-subtotal {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          font-weight: 600;
          color: #555;
          border-top: 1px solid #ddd;
          margin-top: 8px;
        }
        .payee-tip {
          display: flex;
          justify-content: space-between;
          padding: 5px 0;
          font-weight: 600;
          color: #6a0dad;
          border-top: 1px solid #ddd;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🍕 ${data.restaurantName}</h1>
          <h2>Bill Summary</h2>
          <p>${currentDate} ${currentTime}</p>
        </div>

        <div class="section-title">Bill Breakdown</div>
        <div class="bill-summary">
          <div class="summary-row">
            <span>Subtotal:</span>
            <span class="currency">${
              data.currency.symbol
            }${data.subtotal.toFixed(2)}</span>
          </div>
          <div class="summary-row">
            <span>Tip (${data.tipPercentage}%):</span>
            <span class="currency">${
              data.currency.symbol
            }${data.tipAmount.toFixed(2)}</span>
          </div>
          <div class="summary-row total">
            <span>Total:</span>
            <span class="currency">${data.currency.symbol}${data.total.toFixed(
    2
  )}</span>
          </div>
        </div>

        <div class="section-title">Itemized Breakdown</div>
        <div class="payee-breakdown">
          ${data.payees
            .map((payee) => {
              // Find items assigned to this payee
              const payeeItems = [];
              let payeeSubtotal = 0;

              data.items.forEach((item) => {
                const assignment = data.assignments.find(
                  (a) => a.itemId === item.id
                );
                if (!assignment) return;

                // Check if this payee is assigned to this item
                const isAssigned = assignment.payees.some(
                  (p) => p.id === payee.id
                );
                if (!isAssigned) return;

                let itemAmount = 0;
                let itemName = item.name;

                if (assignment.quantities && assignment.quantities[payee.id]) {
                  // Quantity-based assignment
                  const quantity = assignment.quantities[payee.id];
                  itemAmount = (item.price / item.quantity) * quantity;
                  if (item.quantity > 1) {
                    itemName = `${item.name} x${quantity}`;
                  }
                } else if (assignment.isSplit) {
                  // Equal split
                  itemAmount = item.price / assignment.payees.length;
                  if (item.quantity > 1) {
                    itemName = `${item.name} x${item.quantity}`;
                  }
                } else {
                  // Single assignment
                  itemAmount = item.price;
                  if (item.quantity > 1) {
                    itemName = `${item.name} x${item.quantity}`;
                  }
                }

                payeeItems.push({
                  name: itemName,
                  amount: itemAmount,
                });
                payeeSubtotal += itemAmount;
              });

              if (payeeItems.length === 0) return "";

              const payeeTip = data.tipAmount / data.payees.length;
              const payeeTotal = payeeSubtotal + payeeTip;

              return `
                <div class="payee-section">
                  <div class="payee-header">
                    <span class="payee-name">${payee.name}</span>
                    <span class="payee-total">${
                      data.currency.symbol
                    }${payeeTotal.toFixed(2)}</span>
                  </div>
                  <div class="payee-items">
                    ${payeeItems
                      .map(
                        (item) => `
                        <div class="payee-item-row">
                          <span class="item-name">${item.name}</span>
                          <span class="item-price">${
                            data.currency.symbol
                          }${item.amount.toFixed(2)}</span>
                        </div>
                      `
                      )
                      .join("")}
                    <div class="payee-subtotal">
                      <span>Subtotal:</span>
                      <span>${data.currency.symbol}${payeeSubtotal.toFixed(
                2
              )}</span>
                    </div>
                    <div class="payee-tip">
                      <span>Tip:</span>
                      <span>${data.currency.symbol}${payeeTip.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              `;
            })
            .join("")}
        </div>

        <div class="footer">
          <p>Generated by Splitt App</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Generate PDF and return file path
export const generateBillPDF = async (data: BillData): Promise<string> => {
  try {
    const html = generateHTML(data);

    const { uri } = await Print.printToFileAsync({
      html,
      base64: false,
    });

    return uri;
  } catch (error) {
    console.error("PDF generation failed:", error);
    throw new Error("Failed to generate PDF");
  }
};

// Share the PDF using native share dialog
export const shareBillPDF = async (data: BillData): Promise<void> => {
  try {
    // Generate PDF
    const pdfPath = await generateBillPDF(data);

    // Check if sharing is available
    const isAvailable = await Sharing.isAvailableAsync();
    if (!isAvailable) {
      throw new Error("Sharing is not available on this device");
    }

    // Share the PDF
    await Sharing.shareAsync(pdfPath, {
      mimeType: "application/pdf",
      dialogTitle: `Bill from ${data.restaurantName}`,
    });
  } catch (error) {
    console.error("Share failed:", error);
    throw new Error("Failed to share PDF");
  }
};

// Test function to verify PDF generation works
export const testPDFGeneration = async (): Promise<boolean> => {
  try {
    const testData: BillData = {
      restaurantName: "Test Restaurant",
      currency: { symbol: "R", code: "ZAR" },
      subtotal: 100.0,
      tipAmount: 10.0,
      tipPercentage: 10,
      total: 110.0,
      payees: [
        { id: "1", name: "John" },
        { id: "2", name: "Sarah" },
      ],
      items: [
        { id: "1", name: "Pizza", price: 50.0, quantity: 1 },
        { id: "2", name: "Pasta", price: 50.0, quantity: 1 },
      ],
      assignments: [
        {
          itemId: "1",
          payees: [{ id: "1", name: "John" }],
          isSplit: false,
        },
        {
          itemId: "2",
          payees: [{ id: "2", name: "Sarah" }],
          isSplit: false,
        },
      ],
    };

    await generateBillPDF(testData);
    return true;
  } catch (error) {
    console.error("PDF test failed:", error);
    return false;
  }
};
