import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { VaccinationFormData, ALTERNATIVE_CONFIGS } from '../types/vaccination';
import { ImageService } from './imageService';

// Ensure all template assets are included in the bundle and retrievable by filename
const templateAssets = import.meta.glob('../assets/templates/*', { eager: true, as: 'url' }) as Record<string, string>;
const cleanedTemplateAssets = import.meta.glob('../assets/templates/cleaned_templates/*', { eager: true, as: 'url' }) as Record<string, string>;

function getTemplateUrl(fileName: string): string {
  for (const [path, url] of Object.entries(templateAssets)) {
    if (path.endsWith('/' + fileName)) return url as string;
  }
  throw new Error(`Template asset not found: ${fileName}`);
}

function getCleanedTemplateUrl(fileName: string): string {
  for (const [path, url] of Object.entries(cleanedTemplateAssets)) {
    if (path.endsWith('/' + fileName)) return url as string;
  }
  throw new Error(`Cleaned template asset not found: ${fileName}`);
}

export class FileService {
  static async createCompanyFolder(formData: VaccinationFormData): Promise<void> {
    const zip = new JSZip();
    const config = ALTERNATIVE_CONFIGS[formData.alternativ];
    const companyFolder = zip.folder(formData.bedriftensNavn);
    const internalFolder = zip.folder(`${formData.bedriftensNavn}2025`);
    
    if (!companyFolder || !internalFolder) {
      throw new Error('Failed to create folders');
    }

    try {
      // Generate main posters (Norwegian and English)
      const posterPathNO = getTemplateUrl(config.posterTemplate.no);
      const posterPathEN = getTemplateUrl(config.posterTemplate.en);
      
      const posterNO = await ImageService.createPosterWithQRAndDate(
        posterPathNO,
        formData.bookinglink,
        formData.datoNO,
        false
      );
      
      const posterEN = await ImageService.createPosterWithQRAndDate(
        posterPathEN,
        formData.bookinglink,
        formData.dateEN,
        true
      );
      
      // Determine file extensions based on template type
      const extensionNO = config.posterTemplate.no.endsWith('.pdf') ? 'pdf' : 
                          config.posterTemplate.no.endsWith('.svg') ? 'svg' : 'png';
      const extensionEN = config.posterTemplate.en.endsWith('.pdf') ? 'pdf' : 
                          config.posterTemplate.en.endsWith('.svg') ? 'svg' : 'png';
      
      companyFolder.file(`Bookingplakat - ${formData.bedriftensNavn}.${extensionNO}`, posterNO);
      companyFolder.file(`Bookingplakat - ${formData.bedriftensNavn}(eng).${extensionEN}`, posterEN);
      
      // Generate internal poster
      const internalPosterPath = getTemplateUrl(config.internalPosterTemplate);
      const internalPoster = await ImageService.createInternalPoster(
        internalPosterPath,
        formData.bookinglink
      );
      
      internalFolder.file(`${formData.bedriftensNavn} – intern plakat 2025.png`, internalPoster);
      
      // Add self-declarations based on alternative
      await this.addSelfDeclarations(companyFolder, config.includeBoostrix);
      
      // Add info sheets based on alternative
      await this.addInfoSheets(companyFolder, config.includeBoostrix);
      
      // Generate and download the zip file
      const content = await zip.generateAsync({ type: 'blob' });
      saveAs(content, `${formData.bedriftensNavn}_vaksinasjonsmateriale.zip`);
      
    } catch (error) {
      console.error('Error creating company folder:', error);
      throw new Error('Failed to create vaccination materials package');
    }
  }
  
  private static async addSelfDeclarations(folder: JSZip, includeBoostrix: boolean): Promise<void> {
    // Always include influenza declarations
    const influenzaNO = await fetch(getTemplateUrl('Egenerklæring_Influensavaksine.pdf'));
    const influenzaEN = await fetch(getTemplateUrl('Egenerklæring_Influensavaksine_eng.pdf'));
    
    folder.file('Egenerklæring Influensavaksine.pdf', await influenzaNO.blob());
    folder.file('Egenerklæring Influensavaksine(eng).pdf', await influenzaEN.blob());
    
    // Add Boostrix Polio declarations if needed (Alt 2 & 3)
    if (includeBoostrix) {
      const boostrixNO = await fetch(getTemplateUrl('Egenerklæring_Boostrix_Polio.pdf'));
      const boostrixEN = await fetch(getTemplateUrl('Egenerklæring_Boostrix_Polio_eng.pdf'));
      
      folder.file('Egenerklæring Boostrix Polio.pdf', await boostrixNO.blob());
      folder.file('Egenerklæring Boostrix Polio(eng).pdf', await boostrixEN.blob());
    }
  }
  
  private static async addInfoSheets(folder: JSZip, includeBoostrix: boolean): Promise<void> {
    // Always include influenza info sheets
    const influenzaNO = await fetch(getTemplateUrl('Influensa_-_Infoskriv.png'));
    const influenzaEN = await fetch(getTemplateUrl('Influensa_-_Infoskriv_eng.png'));
    
    folder.file('Influensa - Infoskriv.png', await influenzaNO.blob());
    folder.file('Influensa - Infoskriv(eng).png', await influenzaEN.blob());
    
    // Add Boostrix Polio info sheets if needed (Alt 2 & 3)
    if (includeBoostrix) {
      const boostrixNO = await fetch(getTemplateUrl('Boostrix_Polio_-_Infoskriv.png'));
      const boostrixEN = await fetch(getTemplateUrl('Boostrix_Polio_-_Infoskriv_eng.png'));
      
      folder.file('Boostrix Polio - Infoskriv.png', await boostrixNO.blob());
      folder.file('Boostrix Polio - Infoskriv(eng).png', await boostrixEN.blob());
    }
  }
}