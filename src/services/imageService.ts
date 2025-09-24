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
      if (templatePath.includes('cleaned_templates/')) {
        // Cleaned templates - position QR code at specific coordinates
        // Center of QR code should be at x=930, y=1590
        const qrCenterX = 930;
        const qrCenterY = 1590;
        const qrSize = Math.round(canvas.width * 0.32); // Double again (was 0.16, now 0.32)
        
        // Calculate QR position (top-left corner) from center coordinates
        // Currently lower-left is at (930, 1590), we want center at (930, 1590)
        // So we need to move right by qrSize/2 and up by qrSize/2
        const qrX = qrCenterX - (qrSize / 2); // Move left by half size from center
        const qrY = qrCenterY - (qrSize / 2); // Move up by half size from center
        
        // No circular mask needed for cleaned templates - direct placement
        const qrCanvas = await QRService.generateQRCodeCanvas(qrText, qrSize);
        ctx.drawImage(qrCanvas, qrX, qrY, qrSize, qrSize);
        
        // Skip the circular masking logic for cleaned templates
        circleRadius = 0;
        circleCenterX = 0;
        circleCenterY = 0;
      } else if (templatePath.includes('Versjon_4_eng_new.png')) {
        // New Canva template - white circle on the right side
        circleRadius = Math.round(canvas.width * 0.15); // Circle radius based on template
        circleCenterX = canvas.width - Math.round(canvas.width * 0.18); // Position on right side
        circleCenterY = canvas.height - Math.round(canvas.height * 0.25); // Position vertically
      } else {
        // Original template positioning
        circleRadius = Math.round(canvas.width * 0.12); // Radius of white circle
        circleCenterX = canvas.width - Math.round(canvas.width * 0.15); // Center X of white circle
        circleCenterY = canvas.height - Math.round(canvas.height * 0.22); // Center Y of white circle
      }
      
      // STEP 1: Mask out old QR code by filling with white (skip for cleaned templates)
      if (circleRadius > 0) {
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(circleCenterX, circleCenterY, circleRadius, 0, 2 * Math.PI);
        ctx.fill();
      }
      
      // STEP 2: Insert new QR code (skip for cleaned templates as already done above)
      if (circleRadius > 0) {
        const qrSize = circleRadius * 1.6; // QR should fill most of the circle
        const qrX = circleCenterX - (qrSize / 2); // Center QR in circle
        const qrY = circleCenterY - (qrSize / 2); // Center QR in circle
        
        const qrCanvas = await QRService.generateQRCodeCanvas(qrText, qrSize);
        ctx.drawImage(qrCanvas, qrX, qrY, qrSize, qrSize);
      }
      
      // MASK AND REPLACE DATE TEXT - like editing text layer in Photoshop
      // Find exact coordinates where date appears in bullet point
      if (templatePath.includes('cleaned_templates/')) {
        // Cleaned templates - place date under "Vi kommer til din arbeidsplass" text
        // Assuming the workplace text is in the middle section of the poster
        const dateX = Math.round(canvas.width * 0.1); // 10% from left edge
        const dateY = Math.round(canvas.height * 0.6); // 60% down from top (under workplace text)
        const maskWidth = Math.round(canvas.width * 0.4); // Wide enough for date text
        const maskHeight = Math.round(canvas.height * 0.05); // Height for text
        
        // Mask area where we'll place the date (assuming light background)
        ctx.fillStyle = '#FFFFFF'; // White background mask
        ctx.fillRect(dateX, dateY - maskHeight + 10, maskWidth, maskHeight);
        
        // Place date text under workplace text
        ctx.fillStyle = '#333333'; // Dark text color for visibility
        ctx.font = 'bold 24px Arial, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(dateText, dateX, dateY);
      } else if (templatePath.includes('Versjon_4_eng_new.png')) {
        // New Canva template - replace "date" text in the bullet point
        // Position where "date" appears after "We will be at your workplace"
        ctx.fillStyle = '#4a5d5a'; // Background color to mask existing "date" text
        ctx.fillRect(540, 440, 60, 35); // Mask area covering the "date" text
        
        // Replace with new date using Montserrat font as specified
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 28px Montserrat, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(dateText, 540, 462); // Position where "date" was located
      } else if (isEnglish) {
        // Original English template
        ctx.fillStyle = '#4a5d5a'; // Exact background color match
        ctx.fillRect(135, 708, 200, 28); // Precise area covering date text
        
        // Replace with new date using original styling
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 22px Arial, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(dateText, 135, 728); // Exact same baseline as original
      } else {
        // Original Norwegian template
        ctx.fillStyle = '#4a5d5a'; // Exact background color match
        ctx.fillRect(135, 708, 200, 28); // Precise area covering date text
        
        // Replace with new date using original styling
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 22px Arial, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(dateText, 135, 728); // Exact same baseline as original
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