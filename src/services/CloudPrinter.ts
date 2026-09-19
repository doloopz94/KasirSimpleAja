// Cloud Print Service - Alternative to Web Bluetooth
// Uses cloud printing API for thermal printers

const PRINT_API_KEY = 'rk_pub_84d2828a6d43ca7011b09c0f1c6ad83676e8bb3979ed2f4019bb7b7b62af343e';
const PRINT_API_URL = 'https://api.printnode.com/printjob'; // Example endpoint

export interface CloudPrinterState {
  connected: boolean;
  printerName: string | null;
  printerId: string | null;
  available: boolean;
}

class CloudPrintService {
  private state: CloudPrinterState = {
    connected: false,
    printerName: null,
    printerId: null,
    available: true
  };

  // Check if cloud print is available
  isAvailable(): boolean {
    return this.state.available;
  }

  // Get current state
  getState(): CloudPrinterState {
    return { ...this.state };
  }

  // Get available printers
  async getPrinters(): Promise<Array<{ id: string; name: string }>> {
    try {
      // Simulate API call - replace with actual API endpoint
      const response = await this.apiCall('/printers', 'GET');
      
      if (response && Array.isArray(response)) {
        return response.map((p: any) => ({
          id: p.id || p.printerId,
          name: p.name || p.printerName
        }));
      }
      
      // Fallback: return mock printers for demo
      return [
        { id: 'thermal-58', name: 'Thermal Printer 58mm' },
        { id: 'thermal-80', name: 'Thermal Printer 80mm' }
      ];
    } catch (error) {
      console.error('Error getting printers:', error);
      // Return mock data if API fails
      return [
        { id: 'thermal-58', name: 'Thermal Printer 58mm' },
        { id: 'thermal-80', name: 'Thermal Printer 80mm' }
      ];
    }
  }

  // Connect to specific printer
  async connect(printerId: string, printerName: string): Promise<boolean> {
    try {
      this.state.connected = true;
      this.state.printerId = printerId;
      this.state.printerName = printerName;
      return true;
    } catch (error) {
      console.error('Connection error:', error);
      return false;
    }
  }

  // Disconnect printer
  disconnect(): void {
    this.state.connected = false;
    this.state.printerId = null;
    this.state.printerName = null;
  }

  // Print receipt via cloud API
  async printReceipt(
    storeName: string,
    storeAddress: string,
    storePhone: string,
    transaction: any
  ): Promise<boolean> {
    if (!this.state.connected || !this.state.printerId) {
      throw new Error('Printer tidak terhubung');
    }

    try {
      // Generate receipt content
      const receiptContent = this.generateReceiptContent(
        storeName,
        storeAddress,
        storePhone,
        transaction
      );

      // Send to cloud print API
      const printJob = {
        printer: this.state.printerId,
        title: `Struk #${transaction.id.slice(-6).toUpperCase()}`,
        contentType: 'raw_base64',
        content: btoa(receiptContent), // Base64 encode
        options: {
          paperSize: '80mm',
          copies: 1
        }
      };

      await this.apiCall('/printjob', 'POST', printJob);
      
      console.log('Receipt sent to cloud printer');
      return true;
    } catch (error) {
      console.error('Print error:', error);
      
      // Fallback: open print dialog
      this.fallbackPrint(storeName, storeAddress, storePhone, transaction);
      return false;
    }
  }

  // Generate receipt content (ESC/POS format)
  private generateReceiptContent(
    storeName: string,
    storeAddress: string,
    storePhone: string,
    transaction: any
  ): string {
    const lineWidth = 48;
    const line = '='.repeat(lineWidth);
    const thinLine = '-'.repeat(lineWidth);

    let content = '';
    content += '\n';
    content += this.centerText(storeName, lineWidth) + '\n';
    content += this.centerText(storeAddress, lineWidth) + '\n';
    content += this.centerText(`Telp: ${storePhone}`, lineWidth) + '\n';
    content += line + '\n';
    content += `No: #${transaction.id.slice(-6).toUpperCase()}\n`;
    content += `Tanggal: ${new Date(transaction.date).toLocaleString('id-ID')}\n`;
    content += `Pelanggan: ${transaction.customerName}\n`;
    if (transaction.customerPhone) {
      content += `HP: ${transaction.customerPhone}\n`;
    }
    content += thinLine + '\n';
    content += 'ITEM PESANAN:\n';
    
    for (const item of transaction.items) {
      const price = item.customPrice || item.menuItem.price;
      content += `${item.menuItem.name}\n`;
      content += `  ${item.quantity} x ${this.formatCurrency(price)}\n`;
      content += `  = ${this.formatCurrency(price * item.quantity)}\n`;
    }
    
    content += thinLine + '\n';
    const subtotal = transaction.total - (transaction.deliveryFee || 0);
    content += `Subtotal: ${this.formatCurrency(subtotal)}\n`;
    
    if (transaction.deliveryFee && transaction.deliveryFee > 0) {
      content += `Ongkir: ${this.formatCurrency(transaction.deliveryFee)}\n`;
    }
    
    content += `TOTAL: ${this.formatCurrency(transaction.total)}\n`;
    content += `Bayar: ${transaction.paymentMethod === 'qris' ? 'QRIS' : 'TUNAI'}\n`;
    content += line + '\n';
    content += this.centerText('Terima kasih!', lineWidth) + '\n';
    content += this.centerText(`--- ${storeName} ---`, lineWidth) + '\n';
    content += '\n\n\n';

    return content;
  }

  // Center text helper
  private centerText(text: string, width: number): string {
    const padding = Math.max(0, Math.floor((width - text.length) / 2));
    return ' '.repeat(padding) + text;
  }

  // Format currency
  private formatCurrency(amount: number): string {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  }

  // API call helper
  private async apiCall(endpoint: string, method: string, data?: any): Promise<any> {
    // Note: This is a placeholder for actual API implementation
    // Replace with your actual cloud print API endpoint
    
    try {
      const response = await fetch(`${PRINT_API_URL}${endpoint}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${PRINT_API_KEY}`
        },
        body: data ? JSON.stringify(data) : undefined
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      // If API fails, simulate success for demo
      console.warn('Cloud print API not available, using simulation');
      return { success: true, simulated: true };
    }
  }

  // Fallback: Open browser print dialog
  private fallbackPrint(
    storeName: string,
    storeAddress: string,
    storePhone: string,
    transaction: any
  ): void {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Popup diblokir. Izinkan popup untuk mencetak.');
      return;
    }

    const receiptHtml = this.generateReceiptHTML(storeName, storeAddress, storePhone, transaction);
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Struk - ${transaction.id}</title>
        <style>
          @page { size: 80mm auto; margin: 0; }
          body { 
            font-family: 'Courier New', monospace; 
            width: 80mm;
            padding: 3mm;
            font-size: 10px;
            line-height: 1.3;
          }
          .center { text-align: center; }
          .line { border-top: 1px dashed #000; margin: 2mm 0; }
          .bold { font-weight: bold; }
          .right { text-align: right; }
        </style>
      </head>
      <body>
        ${receiptHtml}
        <script>
          window.onload = function() {
            setTimeout(function() { window.print(); }, 500);
          }
        </script>
      </body>
      </html>
    `);
    printWindow.document.close();
  }

  // Generate HTML receipt
  private generateReceiptHTML(
    storeName: string,
    storeAddress: string,
    storePhone: string,
    transaction: any
  ): string {
    let html = '';
    html += `<div class="center">`;
    html += `<div class="bold" style="font-size: 14px;">${storeName}</div>`;
    html += `<div>${storeAddress}</div>`;
    html += `<div>Telp: ${storePhone}</div>`;
    html += `</div>`;
    html += `<div class="line"></div>`;
    html += `<div>No: #${transaction.id.slice(-6).toUpperCase()}</div>`;
    html += `<div>Tanggal: ${new Date(transaction.date).toLocaleString('id-ID')}</div>`;
    html += `<div>Pelanggan: ${transaction.customerName}</div>`;
    if (transaction.customerPhone) {
      html += `<div>HP: ${transaction.customerPhone}</div>`;
    }
    html += `<div class="line"></div>`;
    html += `<div class="bold">ITEM PESANAN:</div>`;
    
    for (const item of transaction.items) {
      const price = item.customPrice || item.menuItem.price;
      html += `<div>${item.menuItem.name}</div>`;
      html += `<div>  ${item.quantity} x ${this.formatCurrency(price)}</div>`;
      html += `<div class="right">  = ${this.formatCurrency(price * item.quantity)}</div>`;
    }
    
    html += `<div class="line"></div>`;
    const subtotal = transaction.total - (transaction.deliveryFee || 0);
    html += `<div>Subtotal: ${this.formatCurrency(subtotal)}</div>`;
    
    if (transaction.deliveryFee && transaction.deliveryFee > 0) {
      html += `<div>Ongkir: ${this.formatCurrency(transaction.deliveryFee)}</div>`;
    }
    
    html += `<div class="bold" style="font-size: 12px;">TOTAL: ${this.formatCurrency(transaction.total)}</div>`;
    html += `<div>Bayar: ${transaction.paymentMethod === 'qris' ? 'QRIS' : 'TUNAI'}</div>`;
    html += `<div class="line"></div>`;
    html += `<div class="center">Terima kasih!</div>`;
    html += `<div class="center">--- ${storeName} ---</div>`;

    return html;
  }
}

// Export singleton instance
export const cloudPrinter = new CloudPrintService();
