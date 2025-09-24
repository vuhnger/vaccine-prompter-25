import { QRService } from './qrService';

export class SVGService {
  static async loadSVGContent(svgPath: string): Promise<string> {
    try {
      const response = await fetch(svgPath);
      if (!response.ok) {
        throw new Error(`Failed to load SVG: ${response.statusText}`);
      }
      return await response.text();
    } catch (error) {
      console.error('Error loading SVG:', error);
      throw new Error('Failed to load SVG file');
    }
  }

  static async createPosterWithQRAndDate(
    templatePath: string,
    qrText: string,
    dateText: string
  ): Promise<Blob> {
    try {
      // Load the SVG content
      const svgContent = await this.loadSVGContent(templatePath);
      
      // Parse the SVG to find and replace elements
      const parser = new DOMParser();
      const svgDoc = parser.parseFromString(svgContent, 'image/svg+xml');
      
      // Find and replace the QR code image
      await this.replaceQRCode(svgDoc, qrText);
      
      // Find and replace the date text (look for common date patterns)
      this.replaceDateText(svgDoc, dateText);
      
      // Convert back to string
      const serializer = new XMLSerializer();
      const modifiedSVG = serializer.serializeToString(svgDoc);
      
      // Convert SVG to blob
      return new Blob([modifiedSVG], { type: 'image/svg+xml' });
      
    } catch (error) {
      console.error('Error creating SVG poster:', error);
      throw new Error('Failed to create SVG poster with QR code and date');
    }
  }

  private static async replaceQRCode(svgDoc: Document, qrText: string): Promise<void> {
    console.log('Looking for QR code images...');
    
    const images = Array.from(svgDoc.querySelectorAll('image'));
    console.log(`Found ${images.length} image elements`);

    type Cand = { el: Element; w: number; h: number; idx: number };
    const candidates: Cand[] = [];

    images.forEach((img, idx) => {
      const href = (img.getAttribute('xlink:href') || img.getAttribute('href') || '').toString();
      const wAttr = img.getAttribute('width') || '';
      const hAttr = img.getAttribute('height') || '';
      const w = parseFloat(wAttr);
      const h = parseFloat(hAttr);
      console.log(`Image ${idx}: href starts with: ${href.substring(0, 50)}, w=${wAttr}, h=${hAttr}`);
      if (href.includes('data:image')) {
        candidates.push({ el: img, w: isNaN(w) ? 0 : w, h: isNaN(h) ? 0 : h, idx });
      }
    });

    let target = candidates.find(c => Math.abs(c.w - c.h) < 1 && c.w >= 200 && c.w <= 300)
      || candidates.find(c => Math.abs(c.w - c.h) < 1 && c.w > 0)
      || (candidates.length ? candidates[candidates.length - 1] : undefined);

    if (target) {
      console.log(`Replacing QR at image index ${target.idx} (w=${target.w}, h=${target.h})`);
      const qrSize = target.w && target.h ? Math.min(target.w, target.h) : 248;
      const qrDataURL = await QRService.generateQRCodeDataURL(qrText, Math.round(qrSize));
      if ((target.el as Element).hasAttribute('xlink:href')) {
        (target.el as Element).setAttribute('xlink:href', qrDataURL);
      } else {
        (target.el as Element).setAttribute('href', qrDataURL);
      }
      console.log('QR code replaced successfully');
    } else {
      console.warn('No suitable image element found for QR replacement.');
    }
  }

  private static replaceDateText(svgDoc: Document, dateText: string): void {
    console.log('Looking for date text elements...');
    
    const textElements = svgDoc.querySelectorAll('text, tspan');
    console.log(`Found ${textElements.length} text/tspan elements`);
    
    let replaced = false;
    for (let i = 0; i < textElements.length; i++) {
      const textElement = textElements[i];
      const textContent = textElement.textContent || '';
      console.log(`Text element ${i}:`, textContent.substring(0, 50));
      
      if (textContent) {
        const updatedText = textContent
          .replace(/DATE_PLACEHOLDER/gi, dateText)
          .replace(/\bdate\b/gi, dateText)
          .replace(/\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4}/g, dateText)
          .replace(/\d{2,4}[\/\-\.]\d{1,2}[\/\-\.]\d{1,2}/g, dateText);
        
        if (updatedText !== textContent) {
          console.log(`Replacing text: "${textContent}" -> "${updatedText}"`);
          textElement.textContent = updatedText;
          replaced = true;
        }
      }
    }

    if (!replaced) {
      console.log('No date placeholders found; injecting new text element.');
      const svgNS = 'http://www.w3.org/2000/svg';
      const text = svgDoc.createElementNS(svgNS, 'text');
      text.setAttribute('x', '540');
      text.setAttribute('y', '462');
      text.setAttribute('fill', '#FFFFFF');
      text.setAttribute('font-family', 'Montserrat, Arial, sans-serif');
      text.setAttribute('font-size', '28');
      text.setAttribute('font-weight', 'bold');
      text.textContent = dateText;
      svgDoc.documentElement.appendChild(text);
    }
    
    console.log('Date text replacement completed');
  }

  static async convertSVGToBlob(svgPath: string): Promise<Blob> {
    const svgContent = await this.loadSVGContent(svgPath);
    return new Blob([svgContent], { type: 'image/svg+xml' });
  }
}