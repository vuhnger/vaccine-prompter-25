import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { VaccinationFormData } from '../types/vaccination';
import { FileService } from '../services/fileService';
import { EmailService } from '../services/emailService';
import { Loader2, Download, Syringe, Copy, Mail, Eye } from 'lucide-react';

const formSchema = z.object({
  kontaktpersonNavn: z.string().min(2, 'Kontaktperson navn må være minst 2 tegn'),
  bedriftensNavn: z.string().min(2, 'Bedriftens navn må være minst 2 tegn'),
  datoNO: z.string().min(5, 'Norsk dato er påkrevd'),
  dateEN: z.string().min(5, 'Engelsk dato er påkrevd'),
  klokkeslett: z.string().min(3, 'Klokkeslett er påkrevd'),
  includeTime: z.boolean().default(true),
  bookinglink: z.string().url('Må være en gyldig URL'),
  alternativ: z.enum(['1', '2', '3', '4', '5', '6'], {
    required_error: 'Du må velge et alternativ',
  }),
});

export function VaccinationForm() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [generatedEmail, setGeneratedEmail] = useState<string>('');
  const [generatedEmailHTML, setGeneratedEmailHTML] = useState<string>('');
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [previewImages, setPreviewImages] = useState<Array<{ name: string; url: string }>>([]);
  const [showPreview, setShowPreview] = useState(false);

  // Cleanup preview images when component unmounts
  useEffect(() => {
    return () => {
      previewImages.forEach(image => URL.revokeObjectURL(image.url));
    };
  }, [previewImages]);

  const form = useForm<VaccinationFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      kontaktpersonNavn: '',
      bedriftensNavn: '',
      datoNO: '',
      dateEN: '',
      klokkeslett: '',
      includeTime: true,
      bookinglink: '',
      alternativ: '1',
    },
  });

  const onSubmit = async (values: VaccinationFormData) => {
    setIsGenerating(true);
    
    try {
      toast.info('Genererer vaksinasjonsmateriale...', {
        description: 'Dette kan ta noen sekunder'
      });
      
      // Generate email content first
      const emailContent = EmailService.generateEmailContent(values);
      const emailHTML = EmailService.generateEmailHTML(values);
      setGeneratedEmail(emailContent);
      setGeneratedEmailHTML(emailHTML);
      
      // Create file package
      await FileService.createCompanyFolder(values);
      
      toast.success('Materiale generert!', {
        description: `Mappe for ${values.bedriftensNavn} er klar for nedlasting`
      });
      
      // Show email modal
      setShowEmailModal(true);
      
    } catch (error) {
      console.error('Error generating materials:', error);
      toast.error('Feil ved generering', {
        description: 'Kunne ikke generere vaksinasjonsmateriale. Prøv igjen.'
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const onPreview = async (values: VaccinationFormData) => {
    setIsPreviewing(true);
    
    try {
      toast.info('Genererer forhåndsvisning...', {
        description: 'Dette kan ta noen sekunder'
      });
      
      console.log('Starting preview generation with values:', values);
      
      // Generate preview images
      const previewBlobs = await FileService.generatePreviewImages(values);
      
      console.log('Preview blobs generated:', previewBlobs);
      
      // Convert blobs to data URLs for display
      const imageUrls = previewBlobs.images.map(image => ({
        name: image.name,
        url: URL.createObjectURL(image.blob)
      }));
      
      console.log('Object URLs created:', imageUrls);
      
      setPreviewImages(imageUrls);
      setShowPreview(true);
      
      toast.success('Forhåndsvisning klar!');
      
    } catch (error) {
      console.error('Error generating preview:', error);
      
      // More specific error information
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      const errorStack = error instanceof Error ? error.stack : '';
      
      console.error('Error details:', {
        message: errorMessage,
        stack: errorStack,
        values: values
      });
      
      toast.error('Feil ved forhåndsvisning', {
        description: `Detaljert feil: ${errorMessage}`
      });
    } finally {
      setIsPreviewing(false);
    }
  };

  // Demo data fill function
  const fillDemoData = () => {
    form.setValue('kontaktpersonNavn', 'Kari Nordmann');
    form.setValue('bedriftensNavn', 'Fjell & Fjord AS');
    form.setValue('datoNO', '21. oktober 2025');
    form.setValue('dateEN', 'October 21st, 2025');
    form.setValue('klokkeslett', '09:00–11:30');
    form.setValue('includeTime', true);
    form.setValue('bookinglink', 'https://pasientsky.no/booking/fjell-fjord-21-10');
    form.setValue('alternativ', '3');
  };

  const copyEmailToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedEmail);
      toast.success('E-post kopiert til utklippstavle!');
    } catch (error) {
      toast.error('Kunne ikke kopiere e-post');
    }
  };

  const copyHTMLToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedEmailHTML);
      toast.success('HTML-versjon kopiert til utklippstavle!');
    } catch (error) {
      toast.error('Kunne ikke kopiere HTML-versjon');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/10">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <Syringe className="h-12 w-12 text-primary mr-3" />
              <h1 className="text-4xl font-bold text-foreground">
                Vaksinasjonsmateriell Generator
              </h1>
            </div>
            <p className="text-lg text-muted-foreground">
              Generer komplette materialpakker for bedriftsvaksinering
            </p>
          </div>

          <Card className="shadow-xl border-border/50 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-primary/10 to-secondary/10 border-b border-border/50">
              <CardTitle className="text-2xl text-foreground">Bedriftsinformasjon</CardTitle>
              <CardDescription className="text-muted-foreground">
                Fyll ut informasjonen for å generere tilpassede plakater, e-post og dokumenter
              </CardDescription>
              <Button 
                type="button" 
                variant="secondary" 
                size="sm"
                onClick={fillDemoData}
                className="w-fit mt-2"
              >
                Fyll demo-data
              </Button>
            </CardHeader>
            <CardContent className="p-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="kontaktpersonNavn"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Kontaktperson Navn</FormLabel>
                          <FormControl>
                            <Input placeholder="Kari Nordmann" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="bedriftensNavn"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bedriftens Navn</FormLabel>
                          <FormControl>
                            <Input placeholder="Fjell & Fjord AS" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="datoNO"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Dato (Norsk)</FormLabel>
                          <FormControl>
                            <Input placeholder="21. oktober 2025" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="dateEN"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date (English)</FormLabel>
                          <FormControl>
                            <Input placeholder="October 21st, 2025" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="klokkeslett"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Klokkeslett</FormLabel>
                        <FormControl>
                          <Input placeholder="09:00–11:30" {...field} />
                        </FormControl>
                        <FormDescription>
                          Tidsrommet for vaksinering
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="includeTime"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>
                            Inkluder klokkeslett i e-post og materiell
                          </FormLabel>
                          <FormDescription>
                            Fjern haken for å utelate tidsangivelse
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="bookinglink"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bookinglink</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="https://pasientsky.no/booking/fjell-fjord-21-10" 
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          URL som brukes for QR-kode generering
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="alternativ"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Alternativ</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Velg betalingsalternativ" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="1">
                              Alt 1 - Kun influensa, bedrift betaler
                            </SelectItem>
                            <SelectItem value="2">
                              Alt 2 - Influensa + Boostrix, bedrift betaler begge
                            </SelectItem>
                            <SelectItem value="3">
                              Alt 3 - Influensa betalt av bedrift, Boostrix betales av ansatte
                            </SelectItem>
                            <SelectItem value="4">
                              Alt 4 - Kun influensa, ansatte betaler selv
                            </SelectItem>
                            <SelectItem value="5">
                              Alt 5 - TEST: Cleaned Template 1
                            </SelectItem>
                            <SelectItem value="6">
                              Alt 6 - TEST: Cleaned Template 2
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Bestemmer hvilke plakater, vedlegg og e-posttekst som genereres
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="space-y-3">
                    <Button 
                      type="button"
                      onClick={() => {
                        const values = form.getValues();
                        onPreview(values);
                      }}
                      disabled={isPreviewing || isGenerating}
                      className="w-full h-12 text-lg font-semibold"
                      size="lg"
                      variant="outline"
                    >
                      {isPreviewing ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Genererer forhåndsvisning...
                        </>
                      ) : (
                        <>
                          <Eye className="mr-2 h-5 w-5" />
                          Forhåndsvis bilder
                        </>
                      )}
                    </Button>

                    <Button 
                      type="submit" 
                      disabled={isGenerating || isPreviewing}
                      className="w-full h-12 text-lg font-semibold"
                      size="lg"
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Genererer materiale...
                        </>
                      ) : (
                        <>
                          <Download className="mr-2 h-5 w-5" />
                          Generer vaksinasjonsmateriale
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>

          {/* Email Preview Modal */}
          <Dialog open={showEmailModal} onOpenChange={setShowEmailModal}>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Generert E-post
                </DialogTitle>
                <DialogDescription>
                  E-posten er klar og ligger også i den nedlastede mappen som en .txt fil
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Button onClick={copyEmailToClipboard} variant="outline" size="sm">
                    <Copy className="mr-2 h-4 w-4" />
                    Kopier tekst-versjon
                  </Button>
                  <Button onClick={copyHTMLToClipboard} variant="outline" size="sm">
                    <Copy className="mr-2 h-4 w-4" />
                    Kopier HTML-versjon
                  </Button>
                  <Button onClick={() => setShowEmailModal(false)} variant="default" size="sm">
                    Lukk
                  </Button>
                </div>
                
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Text Version */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Tekst versjon (for kopiering)</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                      <Textarea
                        value={generatedEmail}
                        readOnly
                        className="min-h-[400px] font-mono text-sm resize-none"
                      />
                    </CardContent>
                  </Card>

                  {/* HTML Preview */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Forhåndsvisning (med klikkbare linker)</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                      <div 
                        className="min-h-[400px] max-h-[400px] overflow-y-auto p-4 bg-white border rounded-lg"
                        dangerouslySetInnerHTML={{ __html: generatedEmailHTML }}
                      />
                    </CardContent>
                  </Card>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Image Preview Modal */}
          <Dialog open={showPreview} onOpenChange={setShowPreview}>
            <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Forhåndsvisning av genererte bilder
                </DialogTitle>
                <DialogDescription>
                  Her kan du se hvordan plakatene vil se ut før du laster dem ned
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6">
                <div className="flex gap-2">
                  <Button onClick={() => setShowPreview(false)} variant="default" size="sm">
                    Lukk forhåndsvisning
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {previewImages.map((image, index) => (
                    <Card key={index}>
                      <CardHeader>
                        <CardTitle className="text-lg">{image.name}</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4">
                        <img 
                          src={image.url} 
                          alt={`${image.name} forhåndsvisning`}
                          className="w-full h-auto border rounded-lg shadow-sm"
                        />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}