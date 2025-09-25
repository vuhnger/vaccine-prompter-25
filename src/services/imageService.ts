import { QRService } from './qrService';
import { PDFService } from './pdfService';
import { SVGService } from './svgService';

export class ImageService {
  static async loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      let objectUrl: string | null = null;

      try {
        const url = new URL(src, window.location.href);
        const sameOrigin = url.origin === window.location.origin;
        if (!sameOrigin) {
          img.crossOrigin = 'anonymous';
        }
      } catch {
        // If URL constructor fails, try without crossOrigin and fallback to fetch
      }

      const cleanup = () => {
        if (objectUrl) URL.revokeObjectURL(objectUrl);
      };

      img.onload = () => {
        cleanup();
        resolve(img);
      };

      img.onerror = async () => {
        // Fallback: fetch as blob and load via object URL for reliability
        try {
          const resp = await fetch(src);
          if (!resp.ok) throw new Error(`Failed to fetch image (${resp.status})`);
          const blob = await resp.blob();
          objectUrl = URL.createObjectURL(blob);
          img.src = objectUrl;
        } catch (e) {
          cleanup();
          console.error('Image load failed for', src, e);
          reject(e);
        }
      };

      img.src = src;
    });
  }

  static async createPosterWithQRAndDate(
    templatePath: string,
    qrText: string,
    dateText: string,
    isEnglish: boolean = false
  ): Promise<Blob> {
    // Handle PDF templates
    if (templatePath.endsWith('.pdf')) {
      return PDFService.createEditedPoster(templatePath, qrText, dateText);
    }
    
    // Handle SVG templates
    if (templatePath.endsWith('.svg')) {
      return SVGService.createPosterWithQRAndDate(templatePath, qrText, dateText);
    }
    try {
      // Load the template image
      const templateImg = await this.loadImage(templatePath);
      
      // Create canvas for composition
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        throw new Error('Could not get canvas context');
      }
      
      // Set canvas size to match template
      canvas.width = templateImg.width;
      canvas.height = templateImg.height;
      
      // Draw template image as base
      ctx.drawImage(templateImg, 0, 0);
      
      // MASK AND REPLACE QR CODE - like editing layers in Photoshop
      // Calculate exact position where QR code exists in template
      let circleRadius, circleCenterX, circleCenterY;
      
      // Handle different templates with specific positioning
      // Always add QR code in the same place for all images
      const qrCenterX = Math.round(canvas.width * 0.75); 
      const qrCenterY = Math.round(canvas.height * 0.85); 
      const qrSize = Math.round(canvas.width * 0.4); 

      // Calculate QR position (top-left corner) from center coordinates
      const qrX = qrCenterX - (qrSize / 2); // Move left by half size from center
      const qrY = qrCenterY - (qrSize / 2); // Move up by half size from center
      
      // Direct placement for all templates
      const qrCanvas = await QRService.generateQRCodeCanvas(qrText, qrSize);
      ctx.drawImage(qrCanvas, qrX, qrY, qrSize, qrSize);
      
      // MASK AND REPLACE DATE TEXT - like editing text layer in Photoshop
      // Skip date text entirely if filename contains "mission"
      if (templatePath.toLowerCase().includes('mission')) {
        // Mission templates - no date text at all, just QR code
        // Do nothing, skip date text completely
      } else if (templatePath.toLowerCase().includes('booking')) {
        // Booking templates - place date in UPPER LEFT CORNER with black text
        const dateX = Math.round(canvas.width * 0.05); // Near left edge
        const dateY = Math.round(canvas.height * 0.05); // 2% lower (0.03 + 0.02)
        
        // Place date text in upper left corner with black text
        ctx.fillStyle = '#000000'; // Black text for booking templates
        ctx.font = 'bold 45px Arial, sans-serif'; // 5% larger (43px * 1.05)
        ctx.textAlign = 'left';
        ctx.fillText(dateText, dateX, dateY);
      } else {
        // All other templates - use previous positioning and white text
        const dateX = Math.round(canvas.width * 0.17); // Previous position
        const dateY = Math.round(canvas.height * 0.54); // 2% lower (0.52 + 0.02)
        
        // Place date text with white color for non-booking templates
        ctx.fillStyle = '#FFFFFF'; // White text to match other bullet points
        ctx.font = 'bold 45px Arial, sans-serif'; // 5% larger (43px * 1.05)
        ctx.textAlign = 'left';
        ctx.fillText(dateText, dateX, dateY);
      }
      
      // Convert canvas to blob
      return new Promise((resolve, reject) => {
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to create blob from canvas'));
          }
        }, 'image/png');
      });
      
    } catch (error) {
      console.error('Error creating poster:', error);
      throw new Error('Failed to create poster with QR code and date');
    }
  }

  static async createInternalPoster(
    templatePath: string,
    qrText: string
  ): Promise<Blob> {
    try {
      // Load the template image
      const templateImg = await this.loadImage(templatePath);
      
      // Create canvas for composition
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        throw new Error('Could not get canvas context');
      }
      
      // Set canvas size to match template
      canvas.width = templateImg.width;
      canvas.height = templateImg.height;
      
      // Draw template image as base
      ctx.drawImage(templateImg, 0, 0);
      
      // MASK AND REPLACE QR CODE - exact same method as main posters
      const circleRadius = Math.round(canvas.width * 0.12);
      const circleCenterX = canvas.width - Math.round(canvas.width * 0.15);
      const circleCenterY = canvas.height - Math.round(canvas.height * 0.22);
      
      // STEP 1: Mask out old QR code
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(circleCenterX, circleCenterY, circleRadius, 0, 2 * Math.PI);
      ctx.fill();
      
      // STEP 2: Insert new QR code in exact same position
      const qrSize = circleRadius * 1.6;
      const qrX = circleCenterX - (qrSize / 2);
      const qrY = circleCenterY - (qrSize / 2);
      
      const qrCanvas = await QRService.generateQRCodeCanvas(qrText, qrSize);
      ctx.drawImage(qrCanvas, qrX, qrY, qrSize, qrSize);
      
      // Convert canvas to blob
      return new Promise((resolve, reject) => {
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to create blob from canvas'));
          }
        }, 'image/png');
      });
      
    } catch (error) {
      console.error('Error creating internal poster:', error);
      throw new Error('Failed to create internal poster');
    }
  }
}