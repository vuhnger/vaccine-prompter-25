import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { QRService } from './qrService';

export class PDFService {
  static async loadPDF(pdfPath: string): Promise<ArrayBuffer> {
    const response = await fetch(pdfPath);
    if (!response.ok) {
      throw new Error(`Failed to load PDF: ${response.statusText}`);
    }
    return response.arrayBuffer();
  }

  static async replaceDateInPDF(
    pdfBytes: ArrayBuffer,
    newDate: string,
    searchText: string = 'date'
  ): Promise<ArrayBuffer> {
    try {
      const pdfDoc = await PDFDocument.load(pdfBytes);
      const pages = pdfDoc.getPages();
      const firstPage = pages[0];
      
      // Load font
      const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      
      // Get page dimensions
      const { width, height } = firstPage.getSize();
      
      // For new PDF template, place date below "We will be at your workplace"
      // Using Montserrat, bold, white, size 28 as specified
      const dateX = width * 0.5; // Center horizontally
      const dateY = height * 0.45; // Below "We will be at your workplace" text
      
      // Insert date text directly (no masking needed)
      firstPage.drawText(newDate, {
        x: dateX,
        y: dateY,
        size: 28,
        font: font,
        color: rgb(1, 1, 1), // White text (Montserrat bold style)
      });
      
      return pdfDoc.save();
    } catch (error) {
      console.error('Error replacing date in PDF:', error);
      throw new Error('Failed to replace date in PDF');
    }
  }

  static async replaceQRInPDF(
    pdfBytes: ArrayBuffer,
    qrText: string
  ): Promise<ArrayBuffer> {
    try {
      const pdfDoc = await PDFDocument.load(pdfBytes);
      const pages = pdfDoc.getPages();
      const firstPage = pages[0];
      
      // Get page dimensions
      const { width, height } = firstPage.getSize();
      
      // Generate QR code as PNG
      const qrDataUrl = await QRService.generateQRCodeDataURL(qrText, 400);
      const qrImageBytes = await fetch(qrDataUrl).then(res => res.arrayBuffer());
      const qrImage = await pdfDoc.embedPng(qrImageBytes);
      
      // QR code in the white circle at bottom-right
      const qrSize = width * 0.15; // Size to fill the white circle
      const qrX = width * 0.82; // Position in white circle (bottom-right)
      const qrY = height * 0.08; // Bottom area where white circle is located
      
      // Replace the white circle area directly with QR code
      // QR code fills the entire white circle area
      firstPage.drawImage(qrImage, {
        x: qrX,
        y: qrY,
        width: qrSize,
        height: qrSize,
      });
      
      return pdfDoc.save();
    } catch (error) {
      console.error('Error replacing QR in PDF:', error);
      throw new Error('Failed to replace QR code in PDF');
    }
  }

  static async createEditedPoster(
    templatePath: string,
    qrText: string,
    dateText: string
  ): Promise<Blob> {
    try {
      // Load PDF template
      const pdfBytes = await this.loadPDF(templatePath);
      
      // Replace date first
      const dateReplacedBytes = await this.replaceDateInPDF(pdfBytes, dateText);
      
      // Then replace QR code
      const finalBytes = await this.replaceQRInPDF(dateReplacedBytes, qrText);
      
      return new Blob([finalBytes], { type: 'application/pdf' });
    } catch (error) {
      console.error('Error creating edited poster:', error);
      throw new Error('Failed to create edited poster');
    }
  }
}