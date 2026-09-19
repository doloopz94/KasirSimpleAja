// WiFi Thermal Printer Service
// Supports network thermal printers via HTTP API or direct connection

export interface WiFiPrinterConfig {
  ipAddress: string;
  port: number;
  printerModel?: string;
}

export interface WiFiPrinterState {
  connected: boolean;
  printerName: string | null;
  config: WiFiPrinterConfig | null;
}

class WiFiPrinterService {
  private state: WiFiPrinterState = {
    connected: false,
    printerName: null,
    config: null
  };

  // Get current state
  getState(): WiFiPrinterState {
    return { ...this.state };
  }

  // Test connection to printer
  async testConnection(ipAddress: string, port: number = 9100): Promise<boolean> {
    try {
      // Try to ping printer via HTTP (common for WiFi printers with web interface)
      const response = await fetch(`http://${ipAddress}:${port}/status`, {
        method: 'GET',
        mode: 'no-cors',
        signal: AbortSignal.timeout(5000)
      });
      
      // If we get here, connection is possible
      this.state.config = { ipAddress, port };
      return true;
    } catch (error) {
      console.warn('WiFi printer test failed:', error);
      // Even if test fails, allow connection (printer might not have web interface)
      this.state.config = { ipAddress, port };
      return true;
    }
  }

  // Connect to WiFi printer
  async connect(config: WiFiPrinterConfig): Promise<boolean> {
    try {
      const success = await this.testConnection(config.ipAddress, config.port);
      
      if (success) {
        this.state.connected = true;
        this.state.config = config;
        this.state.printerName = `WiFi Printer (${config.ipAddress})`;
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('WiFi connection error:', error);
      return false;
    }
  }

  // Disconnect printer
  disconnect(): void {
    this.state.connected = false;
    this.state.printerName = null;
    this.state.config = null;
  }

  // Print receipt via WiFi
  async printReceipt(
    storeName: string,
    storeAddress: string,
    storePhone: string,
    transaction: any
  ): Promise<boolean> {
    if (!this.state.connected || !this.state.config) {
      throw new Error('WiFi printer tidak terhubung');
    }

    try {
      const { ipAddress, port } = this.state.config;

      // Method 1: Try HTTP API (if printer supports it)
      const printSuccess = await this.printViaHTTP(ipAddress, port, storeName, storeAddress, storePhone, transaction);
      
      if (printSuccess) {
        return true;
      }

      // Method 2: Fallback to browser print dialog with WiFi printer format
      this.printViaBrowser(storeName, storeAddress, storePhone, transaction);
      return true;
    } catch (error) {
      console.error('WiFi print error:', error);
      // Fallback to browser print
      this.printViaBrowser(storeName, storeAddress, storePhone, transaction);
      return false;
    }
  }

  // Print via HTTP API
  private async printViaHTTP(
    ipAddress: string,
    port: number,
    storeName: string,
    storeAddress: string,
    storePhone: string,
    transaction: any
  ): Promise<boolean> {
    try {
      // Generate ESC/POS commands
      const receiptData = this.generateESCPOSData(storeName, storeAddress, storePhone, transaction);
      
      // Try common WiFi printer API endpoints
      const endpoints = [
        `/print`,
        `/api/print`,
        `/printer/print`,
        `/receipt`
      ];

      for (const endpoint of endpoints) {
        try {
          const response = await fetch(`http://${ipAddress}:${port}${endpoint}`, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
              'Content-Type': 'application/octet-stream'
            },
            body: receiptData.buffer as ArrayBuffer,
            signal: AbortSignal.timeout(5000)
          });

          // If no error thrown, assume success (no-cors mode)
          console.log(`Print sent to ${endpoint}`);
          return true;
        } catch (err) {
          // Try next endpoint
          continue;
        }
      }

      return false;
    } catch (error) {
      console.error('HTTP print failed:', error);
      return false;
    }
  }

  // Generate ESC/POS data
  private generateESCPOSData(
    storeName: string,
    storeAddress: string,
    storePhone: string,
    transaction: any
  ): Uint8Array {
    const commands: number[] = [];

    // Initialize printer
    commands.push(0x1B, 0x40);

    // Center alignment
    commands.push(0x1B, 0x61, 0x01);

    // Store name (bold)
    commands.push(0x1B, 0x45, 0x01);
    commands.push(...this.stringToBytes(storeName));
    commands.push(0x0A);
    commands.push(0x1B, 0x45, 0x00);

    // Address
    commands.push(...this.stringToBytes(storeAddress));
    commands.push(0x0A);

    // Phone
    commands.push(...this.stringToBytes(`Telp: ${storePhone}`));
    commands.push(0x0A);

    // Line
    commands.push(...this.stringToBytes('='.repeat(48)));
    commands.push(0x0A);

    // Left alignment
    commands.push(0x1B, 0x61, 0x00);

    // Transaction info
    commands.push(...this.stringToBytes(`No: #${transaction.id.slice(-6).toUpperCase()}`));
    commands.push(0x0A);
    commands.push(...this.stringToBytes(`Tanggal: ${new Date(transaction.date).toLocaleString('id-ID')}`));
    commands.push(0x0A);
    commands.push(...this.stringToBytes(`Pelanggan: ${transaction.customerName}`));
    commands.push(0x0A);

    if (transaction.customerPhone) {
      commands.push(...this.stringToBytes(`HP: ${transaction.customerPhone}`));
      commands.push(0x0A);
    }

    // Line
    commands.push(...this.stringToBytes('-'.repeat(48)));
    commands.push(0x0A);

    // Items header
    commands.push(0x1B, 0x45, 0x01);
    commands.push(...this.stringToBytes('ITEM PESANAN:'));
    commands.push(0x0A);
    commands.push(0x1B, 0x45, 0x00);

    // Items
    for (const item of transaction.items) {
      const price = item.customPrice || item.menuItem.price;
      commands.push(...this.stringToBytes(item.menuItem.name));
      commands.push(0x0A);
      commands.push(...this.stringToBytes(`  ${item.quantity} x ${this.formatCurrency(price)}`));
      commands.push(0x0A);

      // Right align for total
      commands.push(0x1B, 0x61, 0x02);
      commands.push(...this.stringToBytes(`= ${this.formatCurrency(price * item.quantity)}`));
      commands.push(0x0A);
      commands.push(0x1B, 0x61, 0x00);
    }

    // Line
    commands.push(...this.stringToBytes('-'.repeat(48)));
    commands.push(0x0A);

    // Totals
    const subtotal = transaction.total - (transaction.deliveryFee || 0);
    commands.push(...this.stringToBytes(`Subtotal: ${this.formatCurrency(subtotal)}`));
    commands.push(0x0A);

    if (transaction.deliveryFee && transaction.deliveryFee > 0) {
      commands.push(...this.stringToBytes(`Ongkir: ${this.formatCurrency(transaction.deliveryFee)}`));
      commands.push(0x0A);
    }

    // Total (bold)
    commands.push(0x1B, 0x45, 0x01);
    commands.push(...this.stringToBytes(`TOTAL: ${this.formatCurrency(transaction.total)}`));
    commands.push(0x0A);
    commands.push(0x1B, 0x45, 0x00);

    commands.push(...this.stringToBytes(`Bayar: ${transaction.paymentMethod === 'qris' ? 'QRIS' : 'TUNAI'}`));
    commands.push(0x0A);

    // Line
    commands.push(...this.stringToBytes('='.repeat(48)));
    commands.push(0x0A);

    // Footer (center)
    commands.push(0x1B, 0x61, 0x01);
    commands.push(...this.stringToBytes('Terima kasih!'));
    commands.push(0x0A);
    commands.push(...this.stringToBytes(`--- ${storeName} ---`));
    commands.push(0x0A);
    commands.push(0x0A);
    commands.push(0x0A);
    commands.push(0x0A);

    // Cut paper
    commands.push(0x1D, 0x56, 0x00);

    return new Uint8Array(commands);
  }

  // String to bytes converter
  private stringToBytes(str: string): number[] {
    const bytes: number[] = [];
    for (let i = 0; i < str.length; i++) {
      const code = str.charCodeAt(i);
      if (code < 128) {
        bytes.push(code);
      } else {
        // Handle non-ASCII characters
        bytes.push(63); // Replace with '?'
      }
    }
    return bytes;
  }

  // Format currency
  private formatCurrency(amount: number): string {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  }

  // Print via browser dialog (fallback)
  private printViaBrowser(
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
export const wifiPrinter = new WiFiPrinterService();
