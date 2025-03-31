import React, { useRef } from 'react';
import moment from 'moment';
import { toast } from 'sonner';

interface OrderItem {
  quantity: number;
  name: string;
  price: number;
}

interface OrderData {
  orderNumber: number;
  orderItems: OrderItem[];
  total: number;
  cashAmount: number;
  change: number;
  timestamp: string;
}

export class ReceiptPrinter {
  private iframeRef: React.RefObject<HTMLIFrameElement>;

  constructor() {
    this.iframeRef = React.createRef<HTMLIFrameElement>();
  }

  private generatePrintContent(orderData: OrderData): string {
    return `
      <div class="receipt-wrapper">
        <div class="receipt-content">
          <center>
            <img src="/icons/logo.svg" class="h-16 text-center w-auto" alt="" />
          </center>
          <p class="prints text-center text-xl font-medium">Food Rep</p>
          <p class="prints font-thin text-center">Douala - Cameroon</p>
          <p class="prints font-thin text-center">Monday - Sunday</p>
          <p class="prints font-thin text-center">From 08H00 - 22H00</p>
          <p class="prints font-thin text-center text-xl">----------------</p>
          <div class="w-full justify-center mt-5">
            <table class="w-full">
              <tr>
                <td><p class="font-thin prints">Bill Number</p></td>
                <td class="text-right"><p class="font-thin prints">${orderData.orderNumber}</p></td>
              </tr>
              ${orderData.orderItems.map(item => `
                <tr>
                  <td><p class="font-thin prints">${item.quantity} x ${item.name}</p></td>
                  <td class="text-right"><p class="font-thin prints">${item.price * item.quantity}</p></td>
                </tr>
              `).join('')}
              <tr>
                <td><p class="font-thin prints">Qty</p></td>
                <td class="text-right"><p class="font-thin prints">${orderData.orderItems.reduce((total, item) => total + item.quantity, 0)}</p></td>
              </tr>
              <tr>
                <td><p class="font-thin prints">Total Price:</p></td>
                <td class="text-right"><p class="font-thin prints">${orderData.total.toFixed(2)} XAF</p></td>
              </tr>
              <tr>
                <td><p class="font-thin prints">Cash Amount:</p></td>
                <td class="text-right"><p class="font-thin prints">${orderData.cashAmount.toFixed(2)} XAF</p></td>
              </tr>
              <tr>
                <td><p class="font-thin prints">Change:</p></td>
                <td class="text-right"><p class="font-thin prints">${orderData.change.toFixed(2)} XAF</p></td>
              </tr>
            </table>
          </div>
          <p class="font-thin text-center my-2 prints">${moment(orderData.timestamp).format('MM Do YYYY, h:mm:ss a')}</p>
          <p class="font-thin text-center my-2 prints">Thank you for your fidelity</p>
          <div class="w-full flex justify-center relative">
            <svg id="barcode"></svg>
          </div>
        </div>
      </div>
    `;
  }

  public getIframeElement(): JSX.Element {
    return <iframe ref={this.iframeRef} style={{ width: '100%', height: '400px', border: '1px solid #ddd' }} title="Receipt Preview" />;
  }

  public async printReceipt(orderData: OrderData): Promise<void> {
    return new Promise((resolve, reject) => {
      const iframe = this.iframeRef.current;
      if (!iframe) {
        reject(new Error('Iframe not found'));
        return;
      }

      try {
        const doc = iframe.contentWindow!.document;
        doc.open();
        doc.write('<!DOCTYPE html><html><head><title>Receipt Preview</title>');
        doc.write('<meta charset="UTF-8">');
        doc.write('<meta name="viewport" content="width=device-width, initial-scale=1.0">');
        doc.write('<link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet" />');
        doc.write(`
          <style>
            @page {
              size: 80mm auto;
              margin: 0;
            }
            html, body {
              margin: 0;
              padding: 0;
              font-family: Arial, sans-serif;
              background-color: white;
            }
            .receipt-wrapper {
              width: 80mm;
              max-width: 100%;
              margin: 0 auto;
              padding: 10px;
              box-sizing: border-box;
              background-color: white;
            }
            .receipt-content {
              width: 100%;
            }
            .prints {
              font-size: 14px;
              line-height: 1.2;
              margin: 4px 0;
            }
            table {
              width: 100%;
              border-collapse: collapse;
            }
            td {
              padding: 2px 0;
            }
            @media print {
              html, body {
                height: fit-content;
                page-break-after: avoid;
                page-break-before: avoid;
                width: 80mm;
              }
              .receipt-wrapper {
                width: 100%;
              }
            }
          </style>
        `);
        doc.write('</head><body>');
        doc.write(this.generatePrintContent(orderData));
        doc.write(`
          <script>
            // Ensure the paper height matches the content exactly
            document.addEventListener('DOMContentLoaded', function() {
              const content = document.querySelector('.receipt-content');
              if (content) {
                const contentHeight = content.offsetHeight;
                document.body.style.height = contentHeight + 'px';
              }
            });
          </script>
        `);
        doc.write('</body></html>');
        doc.close();

        // Wait for resources to load
        setTimeout(() => {
          // Set the height to match content before printing
          const contentHeight = iframe.contentWindow!.document.querySelector('.receipt-content')?.clientHeight || 0;
          if (contentHeight > 0) {
            iframe.contentWindow!.document.body.style.height = contentHeight + 'px';
          }

          iframe.contentWindow!.focus();
          iframe.contentWindow!.print();

          // Show success toast after printing
          toast.success('Receipt printed successfully', {
            description: `Order #${orderData.orderNumber} has been printed`,
            duration: 5000,
          });

          resolve();
        }, 800);
      } catch (error) {
        reject(error);
      }
    });
  }
}

export default ReceiptPrinter;
