// Thermal Printer Service using Web Bluetooth API
// Supports ESC/POS compatible printers (58mm, 80mm)

export interface PrinterState {
  connected: boolean;
  deviceName: string | null;
  paperSize: '58mm' | '80mm';
}

class ThermalPrinterService {
  private device: BluetoothDevice | null = null;
  private server: BluetoothRemoteGATTServer | null = null;
  private characteristic: BluetoothRemoteGATTCharacteristic | null = null;
  private state: PrinterState = {
    connected: false,
    deviceName: null,
    paperSize: '80mm'
  };

  // Check if Web Bluetooth is supported
  isSupported(): boolean {
    return 'bluetooth' in navigator;
  }

  // Get current state
  getState(): PrinterState {
    return { ...this.state };
  }

  // Scan and connect to printer
  async connect(): Promise<boolean> {
    if (!this.isSupported()) {
      throw new Error('Web Bluetooth tidak didukung di browser ini. Gunakan Chrome/Edge.');
    }

    if (!navigator.bluetooth) {
      throw new Error('Web Bluetooth tidak tersedia');
    }

    try {
      // Request Bluetooth device - use acceptAllDevices for better compatibility
      this.device = await navigator.bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: [
          '000018f0-0000-1000-8000-00805f9b34fb', // Standard printer service
          '0000ff00-0000-1000-8000-00805f9b34fb', // Common printer service
          'e7810a71-73ae-499d-8c15-faa9aef0c3f2', // Another common printer service
        ]
      });

      // Handle disconnection
      this.device.addEventListener('gattserverdisconnected', () => {
        this.state.connected = false;
        this.state.deviceName = null;
        console.log('Printer disconnected');
      });

      // Connect to GATT server
      if (!this.device.gatt) {
        throw new Error('GATT tidak tersedia');
      }
      
      this.server = await this.device.gatt.connect();
      
      if (!this.server) {
        throw new Error('Gagal terhubung ke printer');
      }

      // Try to get primary service - try multiple common UUIDs
      let service = null;
      const serviceUUIDs = [
        '000018f0-0000-1000-8000-00805f9b34fb', // Standard printer service
        '0000ff00-0000-1000-8000-00805f9b34fb', // Common printer service
        'e7810a71-73ae-499d-8c15-faa9aef0c3f2', // Another common printer service
      ];

      for (const uuid of serviceUUIDs) {
        try {
          service = await this.server.getPrimaryService(uuid);
          console.log('Found service:', uuid);
          break;
        } catch (e) {
          console.log('Service not found:', uuid);
          continue;
        }
      }

      if (!service) {
        throw new Error('Printer service tidak ditemukan. Pastikan printer kompatibel.');
      }

      // Try to get characteristic for writing - try multiple common UUIDs
      let characteristic = null;
      const characteristicUUIDs = [
        '00002af1-0000-1000-8000-00805f9b34fb', // Standard write characteristic
        '00002a01-0000-1000-8000-00805f9b34fb', // Common write characteristic
        '0000ff01-0000-1000-8000-00805f9b34fb', // Another common write characteristic
      ];

      for (const uuid of characteristicUUIDs) {
        try {
          characteristic = await service.getCharacteristic(uuid);
          console.log('Found characteristic:', uuid);
          break;
        } catch (e) {
          console.log('Characteristic not found:', uuid);
          continue;
        }
      }

      if (!characteristic) {
        throw new Error('Write characteristic tidak ditemukan. Pastikan printer kompatibel.');
      }

      this.characteristic = characteristic;

      this.state.connected = true;
      this.state.deviceName = this.device.name || 'Thermal Printer';
      
      console.log('Printer connected:', this.state.deviceName);
      return true;
    } catch (error) {
      console.error('Connection error:', error);
      this.state.connected = false;
      this.state.deviceName = null;
      throw error;
    }
  }

  // Disconnect printer
  disconnect(): void {
    if (this.device && this.device.gatt?.connected) {
      this.device.gatt.disconnect();
    }
    this.state.connected = false;
    this.state.deviceName = null;
    this.device = null;
    this.server = null;
    this.characteristic = null;
  }

  // Set paper size
  setPaperSize(size: '58mm' | '80mm'): void {
    this.state.paperSize = size;
  }

  // Initialize printer (ESC/POS commands)
  private async initialize(): Promise<void> {
    if (!this.characteristic) {
      throw new Error('Printer tidak terhubung');
    }

    // ESC/POS initialization commands
    const initCommands = new Uint8Array([
      0x1B, 0x40, // Initialize
      0x1B, 0x61, 0x00, // Left align
    ]);

    await this.characteristic.writeValue(initCommands);
  }

  // Print text
  private async printText(text: string, bold: boolean = false, align: 'left' | 'center' | 'right' = 'left'): Promise<void> {
    if (!this.characteristic) {
      throw new Error('Printer tidak terhubung');
    }

    // Clean text - remove any non-ASCII characters that might cause issues
    const cleanText = text.replace(/[^\x00-\x7F]/g, '');

    const commands: number[] = [];

    // Set alignment
    const alignCode = align === 'center' ? 0x01 : align === 'right' ? 0x02 : 0x00;
    commands.push(0x1B, 0x61, alignCode);

    // Set bold
    if (bold) {
      commands.push(0x1B, 0x45, 0x01);
    }

    // Convert text to bytes - use simple ASCII encoding
    for (let i = 0; i < cleanText.length; i++) {
      commands.push(cleanText.charCodeAt(i));
    }

    // Reset bold
    if (bold) {
      commands.push(0x1B, 0x45, 0x00);
    }

    // Reset alignment
    commands.push(0x1B, 0x61, 0x00);

    // Line feed
    commands.push(0x0A);

    await this.characteristic.writeValue(new Uint8Array(commands));
  }

  // Print line
  private async printLine(): Promise<void> {
    if (!this.characteristic) return;

    const lineWidth = this.state.paperSize === '58mm' ? 32 : 48;
    const line = '-'.repeat(lineWidth);
    await this.printText(line);
  }

  // Feed paper
  private async feedPaper(lines: number = 4): Promise<void> {
    if (!this.characteristic) return;

    const feedCommands = new Uint8Array(lines).fill(0x0A);
    await this.characteristic.writeValue(feedCommands);
  }

  // Cut paper (if supported)
  private async cutPaper(): Promise<void> {
    if (!this.characteristic) return;

    const cutCommands = new Uint8Array([0x1D, 0x56, 0x00]);
    await this.characteristic.writeValue(cutCommands);
  }

  // Print receipt
  async printReceipt(
    storeName: string,
    storeAddress: string,
    storePhone: string,
    transaction: any
  ): Promise<void> {
    if (!this.state.connected || !this.characteristic) {
      throw new Error('Printer tidak terhubung');
    }

    try {
      await this.initialize();

      // Header
      await this.printText(storeName, true, 'center');
      await this.printText(storeAddress, false, 'center');
      await this.printText(`Telp: ${storePhone}`, false, 'center');
      await this.printLine();

      // Transaction info
      await this.printText(`No: #${transaction.id.slice(-6).toUpperCase()}`);
      await this.printText(`Tanggal: ${new Date(transaction.date).toLocaleString('id-ID')}`);
      await this.printText(`Pelanggan: ${transaction.customerName}`);
      if (transaction.customerPhone) {
        await this.printText(`HP: ${transaction.customerPhone}`);
      }
      await this.printLine();

      // Items
      await this.printText('ITEM PESANAN:', true);
      for (const item of transaction.items) {
        const price = item.customPrice || item.menuItem.price;
        await this.printText(item.menuItem.name);
        await this.printText(`  ${item.quantity} x ${this.formatCurrency(price)}`);
        await this.printText(`  = ${this.formatCurrency(price * item.quantity)}`, false, 'right');
      }
      await this.printLine();

      // Totals
      const subtotal = transaction.total - (transaction.deliveryFee || 0);
      await this.printText(`Subtotal: ${this.formatCurrency(subtotal)}`);
      
      if (transaction.deliveryFee && transaction.deliveryFee > 0) {
        await this.printText(`Ongkir: ${this.formatCurrency(transaction.deliveryFee)}`);
      }
      
      await this.printText(`TOTAL: ${this.formatCurrency(transaction.total)}`, true);
      await this.printText(`Bayar: ${transaction.paymentMethod === 'qris' ? 'QRIS' : 'TUNAI'}`);
      await this.printLine();

      // Footer
      await this.printText('Terima kasih!', false, 'center');
      await this.printText(`--- ${storeName} ---`, false, 'center');

      // Feed and cut
      await this.feedPaper(5);
      await this.cutPaper();

      console.log('Receipt printed successfully');
    } catch (error) {
      console.error('Print error:', error);
      throw error;
    }
  }

  // Format currency
  private formatCurrency(amount: number): string {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  }
}

// Export singleton instance
export const thermalPrinter = new ThermalPrinterService();
