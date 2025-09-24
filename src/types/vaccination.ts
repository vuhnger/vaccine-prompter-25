export interface VaccinationFormData {
  kontaktpersonNavn: string;
  bedriftensNavn: string;
  datoNO: string;
  dateEN: string;
  klokkeslett: string;
  includeTime: boolean;
  bookinglink: string;
  alternativ: '1' | '2' | '3' | '4' | '5' | '6';
}

export interface AlternativeConfig {
  emailTextModification: string;
  paymentMethod: {
    no: string;
    en: string;
  };
  posterTemplate: {
    no: string;
    en: string;
  };
  internalPosterTemplate: string;
  includeBoostrix: boolean;
}

export const ALTERNATIVE_CONFIGS: Record<string, AlternativeConfig> = {
  '1': {
    emailTextModification: 'remove_boostrix',
    paymentMethod: {
      no: 'Influensavaksinen er gratis for deg, kostnaden dekkes av arbeidsgiver.',
      en: 'The flu shot is free for you, it is paid by your employer.'
    },
    posterTemplate: {
      no: 'Bookingplakat_-_BedriftensNavn.png',
      en: 'Bookingplakat_-_BedriftensNavn_eng.png'
    },
    internalPosterTemplate: 'BedriftensNavn_Plakat_-_Til_å_ha_med_på_oppdrag_ikke_sende.png',
    includeBoostrix: false
  },
  '2': {
    emailTextModification: 'none',
    paymentMethod: {
      no: 'Influensavaksinen og Boostrix Polio er gratis for deg, kostnaden dekkes av arbeidsgiver.',
      en: 'The flu shot and Boostrix Polio are free for you, they are paid by your employer.'
    },
    posterTemplate: {
      no: 'Versjon_2.png',
      en: 'Versjon_2_eng.png'
    },
    internalPosterTemplate: 'BedriftensNavn_Plakat_-_Til_å_ha_med_på_oppdrag_ikke_sende_beggebedriftenbetaler.png',
    includeBoostrix: true
  },
  '3': {
    emailTextModification: 'none',
    paymentMethod: {
      no: 'Influensavaksinen er gratis for deg, kostnaden dekkes av arbeidsgiver. Boostrix Polio betaler du enkelt med Vipps eller kort. Pris: 495,-',
      en: 'The flu shot is free for you, it is paid by your employer. Boostrix Polio can be easily paid for with Vipps or card. Price: 495,-'
    },
    posterTemplate: {
      no: 'Versjon_3_from_pdf.jpg',
      en: 'Versjon_3_eng.png'
    },
    internalPosterTemplate: 'BedriftensNavn_Plakat_-_Til_å_ha_med_på_oppdrag_ikke_sende_beggebedriftenbetaleriv.png',
    includeBoostrix: true
  },
  '4': {
    emailTextModification: 'remove_boostrix',
    paymentMethod: {
      no: 'Influensavaksinen betaler du enkelt med Vipps eller kort. Pris: 395,-',
      en: 'The flu shot can be easily paid for with Vipps or card. Price: 395,-'
    },
    posterTemplate: {
      no: 'Versjon_4.png',
      en: 'Versjon_4_eng_new.svg'
    },
    internalPosterTemplate: 'BedriftensNavn_Plakat_-_Til_å_ha_med_på_oppdrag_ikke_sende_betale_selv.png',
    includeBoostrix: false
  },
  '5': {
    emailTextModification: 'remove_boostrix',
    paymentMethod: {
      no: 'Influensavaksinen er gratis for deg, kostnaden dekkes av arbeidsgiver.',
      en: 'The flu shot is free for you, it is paid by your employer.'
    },
    posterTemplate: {
      no: 'cleaned_templates/Eksisterende kunder - vaksinert.png',
      en: 'cleaned_templates/Eksisterende kunder - vaksinert (1).png'
    },
    internalPosterTemplate: 'cleaned_templates/Eksisterende kunder - vaksinert.png',
    includeBoostrix: false
  },
  '6': {
    emailTextModification: 'remove_boostrix',
    paymentMethod: {
      no: 'Test alternativ for rene templates',
      en: 'Test alternative for clean templates'
    },
    posterTemplate: {
      no: 'cleaned_templates/Eksisterende kunder - vaksinert (1).png',
      en: 'cleaned_templates/Eksisterende kunder - vaksinert.png'
    },
    internalPosterTemplate: 'cleaned_templates/Eksisterende kunder - vaksinert (1).png',
    includeBoostrix: false
  }
};