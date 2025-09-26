import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { VaccinationFormData } from '../types/vaccination';
import { ImageService } from './imageService';

// Ensure all template assets are included in the bundle and retrievable by filename
const templateAssets = import.meta.glob('../assets/templates/*', { query: '?url', import: 'default', eager: true }) as Record<string, string>;
const informationAssets = import.meta.glob('../assets/information/*', { query: '?url', import: 'default', eager: true }) as Record<string, string>;
const alt1TemplateAssets = import.meta.glob('../assets/templates/alt1/*', { query: '?url', import: 'default', eager: true }) as Record<string, string>;
const alt2TemplateAssets = import.meta.glob('../assets/templates/alt2/*', { query: '?url', import: 'default', eager: true }) as Record<string, string>;
const alt3TemplateAssets = import.meta.glob('../assets/templates/alt3/*', { query: '?url', import: 'default', eager: true }) as Record<string, string>;
const alt4TemplateAssets = import.meta.glob('../assets/templates/alt4/*', { query: '?url', import: 'default', eager: true }) as Record<string, string>;

function getTemplateUrl(fileName: string): string {
  for (const [path, url] of Object.entries(templateAssets)) {
    if (path.endsWith('/' + fileName)) return url as string;
  }
  throw new Error(`Template asset not found: ${fileName}`);
}

function getAltTemplateUrl(fileName: string, alt: string): string {
  let altAssets: Record<string, string>;
  switch (alt) {
    case '1':
      altAssets = alt1TemplateAssets;
      break;
    case '2':
      altAssets = alt2TemplateAssets;
      break;
    case '3':
      altAssets = alt3TemplateAssets;
      break;
    case '4':
      altAssets = alt4TemplateAssets;
      break;
    default:
      throw new Error(`Invalid alternative: ${alt}`);
  }
  
  for (const [path, url] of Object.entries(altAssets)) {
    if (path.endsWith('/' + fileName)) return url as string;
  }
  throw new Error(`Alternative template asset not found: ${fileName} for alt ${alt}`);
}

function getAltTemplateAssets(alt: string): Record<string, string> {
  switch (alt) {
    case '1':
      return alt1TemplateAssets;
    case '2':
      return alt2TemplateAssets;
    case '3':
      return alt3TemplateAssets;
    case '4':
      return alt4TemplateAssets;
    default:
      throw new Error(`Invalid alternative: ${alt}`);
  }
}

function generateUserFriendlyFilename(originalFileName: string, companyName: string): string {
  const fileName = originalFileName.toLowerCase();
  
  // Determine language
  const isEnglish = fileName.startsWith('eng_');
  const language = isEnglish ? 'engelsk' : 'norsk';
  
  // Determine poster type
  const isMission = fileName.includes('mission');
  const posterType = isMission ? 'Oppdrag' : 'Bookingplakat';
  
  // Generate user-friendly name
  return `${companyName} - ${posterType} (${language})`;
}

export class FileService {
  static async generatePreviewImages(formData: VaccinationFormData): Promise<{
    images: Array<{ name: string; originalName: string; blob: Blob }>;
  }> {
    try {
      console.log(`Generating preview images for alternative ${formData.alternativ} (includes mission templates)...`);
      
      const images: Array<{ name: string; originalName: string; blob: Blob }> = [];
      
      // Get the alternative-specific templates
      const altAssets = getAltTemplateAssets(formData.alternativ);
      
      // Process alternative-specific templates
      for (const [path, url] of Object.entries(altAssets)) {
        const fileName = path.split('/').pop();
        if (!fileName) continue;
        
        console.log(`Processing alternative ${formData.alternativ} template: ${fileName}`);
        
        // Determine which date to use based on language in filename
        const isEnglish = fileName.toLowerCase().includes('eng');
        const dateText = isEnglish ? formData.dateEN : formData.datoNO;
        
        try {
          const blob = await ImageService.createPosterWithQRAndDate(
            url as string,
            formData.bookinglink,
            dateText,
            isEnglish
          );
          
          images.push({
            name: generateUserFriendlyFilename(fileName, formData.bedriftensNavn),
            originalName: fileName,
            blob
          });
          
          console.log(`Successfully processed: ${fileName}`);
        } catch (error) {
          console.error(`Failed to process ${fileName}:`, error);
          // Continue with other files even if one fails
        }
      }
      
      console.log(`Generated ${images.length} preview images`);
      
      return { images };
      
    } catch (error) {
      console.error('Error in generatePreviewImages:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error in preview generation';
      throw new Error(`Failed to generate preview images: ${errorMessage}`);
    }
  }

  static async generateSelectedImages(
    formData: VaccinationFormData, 
    selectedImageNames: string[]
  ): Promise<{
    images: Array<{ name: string; blob: Blob }>;
  }> {
    try {
      console.log('Generating selected images:', selectedImageNames);
      
      const images: Array<{ name: string; blob: Blob }> = [];
      
      // Get the alternative-specific templates
      const altAssets = getAltTemplateAssets(formData.alternativ);
      
      // Loop through only selected files
      for (const selectedName of selectedImageNames) {
        // Find the corresponding template asset
        let templateUrl: string | null = null;
        
        // Check alternative templates first
        for (const [path, url] of Object.entries(altAssets)) {
          if (path.endsWith('/' + selectedName)) {
            templateUrl = url as string;
            break;
          }
        }
        
        if (!templateUrl) {
          console.warn(`Template not found for: ${selectedName}`);
          continue;
        }
        
        // Determine which date to use based on language in filename
        const isEnglish = selectedName.toLowerCase().includes('eng');
        const dateText = isEnglish ? formData.dateEN : formData.datoNO;
        
        try {
          const blob = await ImageService.createPosterWithQRAndDate(
            templateUrl,
            formData.bookinglink,
            dateText,
            isEnglish
          );
          
          images.push({
            name: generateUserFriendlyFilename(selectedName, formData.bedriftensNavn),
            blob
          });
          
          console.log(`Successfully processed selected: ${selectedName}`);
        } catch (error) {
          console.error(`Failed to process selected ${selectedName}:`, error);
          // Continue with other files even if one fails
        }
      }
      
      console.log(`Generated ${images.length} selected images`);
      
      return { images };
      
    } catch (error) {
      console.error('Error in generateSelectedImages:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error in selected generation';
      throw new Error(`Failed to generate selected images: ${errorMessage}`);
    }
  }

  static async downloadSelectedImages(
    formData: VaccinationFormData,
    selectedImageNames: string[] = []
  ): Promise<void> {
    console.log('Starting downloadSelectedImages with:', selectedImageNames);
    const zip = new JSZip();

    try {
      // If no images selected, use default selection (all alternative images)
      let imagesToGenerate = selectedImageNames;
      if (imagesToGenerate.length === 0) {
        console.log('No images selected, generating all images...');
        // Generate all images to determine defaults
        const allImages = await this.generatePreviewImages(formData);
        // Default selection is ALL files from selected alternative
        imagesToGenerate = allImages.images.map(img => img.name);
        console.log('Default images to generate:', imagesToGenerate);
      }

      console.log('Generating selected images...');
      // Generate only selected/default images
      const selectedImages = await this.generateSelectedImages(formData, imagesToGenerate);
      console.log('Selected images generated:', selectedImages.images.length);
      
      // Add selected images directly to ZIP root
      for (const image of selectedImages.images) {
        console.log('Adding selected image to ZIP:', image.name);
        zip.file(`${image.name}.png`, image.blob);
      }
      
      console.log('Adding information files...');
      // Add all information files directly to ZIP root
      await this.addInformationFilesToRoot(zip);
      
      console.log('Generating ZIP file...');
      // Generate and download the zip file
      const content = await zip.generateAsync({ type: 'blob' });
      console.log('ZIP generated successfully, downloading...');
      saveAs(content, `${formData.bedriftensNavn}_vaksinasjonsmateriale.zip`);
      
    } catch (error) {
      console.error('Detailed error in downloadSelectedImages:', error);
      if (error instanceof Error) {
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
      }
      throw new Error(`Failed to create selected vaccination materials package: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  static async createCompanyFolder(formData: VaccinationFormData): Promise<void> {
    console.log('Starting createCompanyFolder with formData:', formData);
    const zip = new JSZip();

    try {
      console.log('Generating preview images...');
      // Generate all images from selected alternative
      const allImages = await this.generatePreviewImages(formData);
      console.log('Generated images:', allImages.images.length);
      
      // Add generated images directly to ZIP root
      for (const image of allImages.images) {
        console.log('Adding image to ZIP:', image.name);
        zip.file(`${image.name}.png`, image.blob);
      }
      
      console.log('Adding information files...');
      // Add all information files directly to ZIP root
      await this.addInformationFilesToRoot(zip);
      
      console.log('Generating ZIP file...');
      // Generate and download the zip file
      const content = await zip.generateAsync({ type: 'blob' });
      console.log('ZIP generated successfully, downloading...');
      saveAs(content, `${formData.bedriftensNavn}_vaksinasjonsmateriale.zip`);
      
    } catch (error) {
      console.error('Detailed error in createCompanyFolder:', error);
      if (error instanceof Error) {
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
      }
      throw new Error(`Failed to create vaccination materials package: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private static async addInformationFilesToRoot(zip: JSZip): Promise<void> {
    console.log('Starting addInformationFilesToRoot...');
    console.log('Available information assets:', Object.keys(informationAssets));
    console.log('Information assets entries:', Object.entries(informationAssets));
    
    // Use all files from the informationAssets import instead of hardcoded list
    for (const [path, url] of Object.entries(informationAssets)) {
      const fileName = path.split('/').pop();
      if (!fileName) continue;
      
      try {
        console.log('Processing information file:', fileName);
        console.log('File path:', path);
        console.log('File URL:', url);
        
        // Try to handle URL encoding for special characters
        const encodedUrl = encodeURI(url as string);
        console.log('Encoded URL:', encodedUrl);
        
        const response = await fetch(encodedUrl);
        if (!response.ok) {
          console.error(`Failed to fetch ${fileName}: ${response.status} ${response.statusText}`);
          // Try with the original URL as fallback
          const fallbackResponse = await fetch(url as string);
          if (!fallbackResponse.ok) {
            throw new Error(`Failed to fetch ${fileName}: ${fallbackResponse.status} ${fallbackResponse.statusText}`);
          }
          console.log('Fallback fetch succeeded for:', fileName);
          const blob = await fallbackResponse.blob();
          console.log('File blob size:', blob.size, 'type:', blob.type);
          
          // Create user-friendly filename
          let friendlyName = fileName
            .replace(/_/g, ' ')
            .replace(/-/g, ' ')
            .replace(/  +/g, ' ')
            .trim();
          
          console.log('Adding to ZIP as:', friendlyName);
          zip.file(friendlyName, blob);
          continue;
        }
        
        const blob = await response.blob();
        console.log('File blob size:', blob.size, 'type:', blob.type);
        
        // Create user-friendly filename
        let friendlyName = fileName
          .replace(/_/g, ' ')
          .replace(/-/g, ' ')
          .replace(/  +/g, ' ')
          .trim();
        
        console.log('Adding to ZIP as:', friendlyName);
        zip.file(friendlyName, blob);
      } catch (error) {
        console.error(`Could not add information file ${fileName}:`, error);
        console.error('Error details:', error);
        // Continue with other files
      }
    }
    console.log('Finished adding information files');
  }
}