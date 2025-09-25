import QRCode from 'qrcode';

export class QRService {
  static async generateQRCodeDataURL(text: string, size = 512, backgroundColor = '#FFFFFF'): Promise<string> {
    try {
      return await QRCode.toDataURL(text, {
        width: size,
        margin: 0,
        color: {
          dark: '#000000',
          light: backgroundColor
        }
      });
    } catch (error) {
      console.error('Error generating QR code:', error);
      throw new Error('Failed to generate QR code');
    }
  }

  static async generateQRCodeCanvas(text: string, size = 512, backgroundColor = '#FFFFFF'): Promise<HTMLCanvasElement> {
    const canvas = document.createElement('canvas');
    try {
      await QRCode.toCanvas(canvas, text, {
        width: size,
        margin: 0,
        color: {
          dark: '#000000',
          light: backgroundColor
        }
      });
      return canvas;
    } catch (error) {
      console.error('Error generating QR code canvas:', error);
      throw new Error('Failed to generate QR code canvas');
    }
  }
}