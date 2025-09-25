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
      let qrCenterX, qrCenterY;
      if (templatePath.toLowerCase().includes('graphic')) {
        qrCenterX = Math.round(canvas.width * 0.80); // 5% right (0.75 + 0.05)
        qrCenterY = Math.round(canvas.height * 0.87); // 2% down from 85% (0.85 + 0.02)
      } else {
        qrCenterX = Math.round(canvas.width * 0.75); 
        qrCenterY = Math.round(canvas.height * 0.85);
      }
      
      // Adjust QR size based on template type
      let qrSize;
      if (templatePath.toLowerCase().includes('graphic')) {
        qrSize = Math.round(canvas.width * 0.4 * 0.75); // 3/4ths of current size for graphic templates
      } else {
        qrSize = Math.round(canvas.width * 0.4); // Standard size for all other templates
      }

      // Calculate QR position (top-left corner) from center coordinates
      const qrX = qrCenterX - (qrSize / 2); // Move left by half size from center
      const qrY = qrCenterY - (qrSize / 2); // Move up by half size from center
      
      // Generate QR code with custom background for graphic templates
      const qrBackgroundColor = templatePath.toLowerCase().includes('graphic') ? '#75D1C6' : '#FFFFFF';
      const qrCanvas = await QRService.generateQRCodeCanvas(qrText, qrSize, qrBackgroundColor);
      ctx.drawImage(qrCanvas, qrX, qrY, qrSize, qrSize);
      
      // MASK AND REPLACE DATE TEXT - like editing text layer in Photoshop
      // Skip date text entirely if filename contains "mission"
      if (templatePath.toLowerCase().includes('mission')) {
        // Mission templates - no date text at all, just QR code
        // Do nothing, skip date text completely
      } else if (templatePath.toLowerCase().includes('graphic')) {
        // Graphic templates - place date CENTERED and 2/3 down the image
        const dateX = Math.round(canvas.width * 0.5); // Center horizontally
        const dateY = Math.round(canvas.height * 0.665) - 4; // 0.5% down from 66% minus 4 pixels total
        
        // Place date text centered with black text
        ctx.fillStyle = '#000000'; // Black text for graphic templates
        ctx.font = 'bold 50px Montserrat, sans-serif'; // 10% larger (45px * 1.1 ≈ 50px)
        ctx.textAlign = 'center'; // Center alignment for graphic templates
        ctx.fillText(dateText, dateX, dateY);
      } else if (templatePath.toLowerCase().includes('booking')) {
        // Booking templates - place date 4/5ths down and adjusted further left with black text
        const dateX = Math.round(canvas.width * 0.053); // 2% more to the right (0.033 + 0.02)
        const dateY = Math.round(canvas.height * 0.8) + 3; // 4/5ths down + 3 pixels
        
        // Place date text with black text
        ctx.fillStyle = '#000000'; // Black text for booking templates
        ctx.font = 'bold 40px Montserrat, sans-serif'; // 10% smaller (45px * 0.9 = 40.5px ≈ 40px)
        ctx.textAlign = 'left';
        ctx.fillText(dateText, dateX, dateY);
      } else {
        // All other templates - use previous positioning and white text
        const dateX = Math.round(canvas.width * 0.17); // Previous position
        const dateY = Math.round(canvas.height * 0.54); // 2% lower (0.52 + 0.02)
        
        // Place date text with white color for non-booking templates
        ctx.fillStyle = '#FFFFFF'; // White text to match other bullet points
        ctx.font = 'bold 45px Montserrat, sans-serif'; // 5% larger (43px * 1.05)
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