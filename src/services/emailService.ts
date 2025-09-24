import { VaccinationFormData, ALTERNATIVE_CONFIGS } from '../types/vaccination';

export class EmailService {
  static generateEmailContent(formData: VaccinationFormData): string {
    const config = ALTERNATIVE_CONFIGS[formData.alternativ];
    const timeText = formData.includeTime ? `\nTid: ${formData.klokkeslett}` : '';
    const timeTextEN = formData.includeTime ? `\nTime: ${formData.klokkeslett}` : '';
    
    // Modify opening sentence based on alternative
    let openingSentenceNO = `Snart kommer vi til ${formData.bedriftensNavn} for å sette influensavaksine og Boostrix Polio.`;
    let openingSentenceEN = `Dr.Dropin will visit ${formData.bedriftensNavn} on ${formData.dateEN} to offer flu vaccinations and Boostrix Polio.`;
    
    if (config.emailTextModification === 'remove_boostrix') {
      openingSentenceNO = `Snart kommer vi til ${formData.bedriftensNavn} for å sette influensavaksine.`;
      openingSentenceEN = `Dr.Dropin will visit ${formData.bedriftensNavn} on ${formData.dateEN} to offer flu vaccinations.`;
    }

    return `Hei ${formData.kontaktpersonNavn},

${openingSentenceNO} Her finner du alt du trenger for å dele informasjonen internt og sikre at flest mulig ansatte melder seg på. Materiell finnes på norsk og engelsk:
• Plakater
• Informasjonstekst til e-post/intranett
• Påmeldingslink

👉 Erfaring viser at påminnelser i flere kanaler (e-post, intranett, plakater, skjermer osv.) gir best oppmøte.

Hvorfor det lønner seg for dere at mange tar influensavaksinen:
• En sykedag koster bedriften ca. 4000 kr.
• Influensavaksinen kan redusere risikoen for influensa med opptil 60 %.
• Ansatte som likevel blir smittet av influensa får ofte kortere og mildere sykdomsforløp dersom de har tatt vaksinen.

Eksempeltekst til ansatte (norsk):
Influensavaksinering
Dr.Dropin kommer til ${formData.bedriftensNavn} ${formData.datoNO} for å sette ${config.includeBoostrix ? 'influensavaksine og Boostrix Polio' : 'influensavaksine'}. ${config.paymentMethod.no}${timeText}
Sted: [Møterom – fylles inn av bedriften]
👉 Meld deg på her: ${formData.bookinglink}

Vaksinen registreres på Helsenorge. Husk å lese egenerklæringen og sette av tid i kalenderen din.

Example text for employees (English):
Flu vaccination
${openingSentenceEN} ${config.paymentMethod.en}${timeTextEN}
Location: [Meeting room at your office]
👉 Sign up here: ${formData.bookinglink}

Your vaccination will be registered on Helsenorge. Please read the self-declaration form before your appointment and add the time to your calendar.

Vi ser frem til videre samarbeid med dere. Ta gjerne kontakt om du har noen spørsmål.`;
  }

  static generateEmailHTML(formData: VaccinationFormData): string {
    const config = ALTERNATIVE_CONFIGS[formData.alternativ];
    const timeText = formData.includeTime ? `<br>Tid: ${formData.klokkeslett}` : '';
    const timeTextEN = formData.includeTime ? `<br>Time: ${formData.klokkeslett}` : '';
    
    // Modify opening sentence based on alternative
    let openingSentenceNO = `Snart kommer vi til ${formData.bedriftensNavn} for å sette influensavaksine og Boostrix Polio.`;
    let openingSentenceEN = `Dr.Dropin will visit ${formData.bedriftensNavn} on ${formData.dateEN} to offer flu vaccinations and Boostrix Polio.`;
    
    if (config.emailTextModification === 'remove_boostrix') {
      openingSentenceNO = `Snart kommer vi til ${formData.bedriftensNavn} for å sette influensavaksine.`;
      openingSentenceEN = `Dr.Dropin will visit ${formData.bedriftensNavn} on ${formData.dateEN} to offer flu vaccinations.`;
    }

    return `<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.5; color: #333;">
<p>Hei ${formData.kontaktpersonNavn},</p>

<p>${openingSentenceNO} Her finner du alt du trenger for å dele informasjonen internt og sikre at flest mulig ansatte melder seg på. Materiell finnes på norsk og engelsk:</p>
<ul style="margin: 0; padding-left: 20px;">
<li>Plakater</li>
<li>Informasjonstekst til e-post/intranett</li>
<li>Påmeldingslink</li>
</ul>

<p>👉 Erfaring viser at påminnelser i flere kanaler (e-post, intranett, plakater, skjermer osv.) gir best oppmøte.</p>

<p><strong>Hvorfor det lønner seg for dere at mange tar influensavaksinen:</strong></p>
<ul style="margin: 0; padding-left: 20px;">
<li>En sykedag koster bedriften ca. 4000 kr.</li>
<li>Influensavaksinen kan redusere risikoen for influensa med opptil 60 %.</li>
<li>Ansatte som likevel blir smittet av influensa får ofte kortere og mildere sykdomsforløp dersom de har tatt vaksinen.</li>
</ul>

<div style="background-color: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0;">
<p><strong>Eksempeltekst til ansatte (norsk):</strong></p>
<p><strong>Influensavaksinering</strong><br>
Dr.Dropin kommer til ${formData.bedriftensNavn} ${formData.datoNO} for å sette ${config.includeBoostrix ? 'influensavaksine og Boostrix Polio' : 'influensavaksine'}. ${config.paymentMethod.no}${timeText}<br>
Sted: [Møterom – fylles inn av bedriften]<br>
👉 Meld deg på her: <a href="${formData.bookinglink}" target="_blank" style="color: #0066cc; text-decoration: none;">${formData.bookinglink}</a></p>

<p>Vaksinen registreres på Helsenorge. Husk å lese egenerklæringen og sette av tid i kalenderen din.</p>
</div>

<div style="background-color: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0;">
<p><strong>Example text for employees (English):</strong></p>
<p><strong>Flu vaccination</strong><br>
${openingSentenceEN} ${config.paymentMethod.en}${timeTextEN}<br>
Location: [Meeting room at your office]<br>
👉 Sign up here: <a href="${formData.bookinglink}" target="_blank" style="color: #0066cc; text-decoration: none;">${formData.bookinglink}</a></p>

<p>Your vaccination will be registered on Helsenorge. Please read the self-declaration form before your appointment and add the time to your calendar.</p>
</div>

<p>Vi ser frem til videre samarbeid med dere. Ta gjerne kontakt om du har noen spørsmål.</p>
</div>`;
  }
}