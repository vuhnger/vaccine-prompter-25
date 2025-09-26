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
  alternativ: z.enum(['1', '2', '3', '4', '5'], {
    required_error: 'Du må velge et alternativ',
  }).default('5'), // Make TEST alternative the default
});

export function VaccinationForm() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [generatedEmail, setGeneratedEmail] = useState<string>('');
  const [generatedEmailHTML, setGeneratedEmailHTML] = useState<string>('');
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [previewImages, setPreviewImages] = useState<Array<{ name: string; url: string }>>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [selectedImages, setSelectedImages] = useState<Set<string>>(new Set());

  // Cleanup preview images when component unmounts
  useEffect(() => {
    return () => {
      previewImages.forEach(image => URL.revokeObjectURL(image.url));
    };
  }, [previewImages]);

  const form = useForm<VaccinationFormData>({
    resolver: zodResolver(formSchema),
    mode: 'onChange', // Enable real-time validation
    defaultValues: {
      kontaktpersonNavn: '',
      bedriftensNavn: '',
      datoNO: '',
      dateEN: '',
      klokkeslett: '',
      includeTime: true,
      bookinglink: '',
      alternativ: '5', // Default to TEST - Nye maler
    },
  });

  const handleGenerate = async () => {
    // Trigger form validation
    const isValid = await form.trigger();
    
    if (!isValid) {
      toast.error('Fyll ut alle påkrevde felter', {
        description: 'Røde felter må fylles ut før generering'
      });
      return;
    }

    // Check if any images are selected
    if (selectedImages.size === 0) {
      toast.error('Velg minst ett bilde', {
        description: 'Du må velge hvilke bilder som skal inkluderes i nedlastingen'
      });
      return;
    }
    
    const values = form.getValues();
    onSubmit(values);
  };

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
      
      // Create file package with selected images
      await FileService.createSelectedCompanyFolder(values, Array.from(selectedImages));
      
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

  const handlePreview = async () => {
    // Trigger form validation
    const isValid = await form.trigger();
    
    if (!isValid) {
      toast.error('Fyll ut alle påkrevde felter', {
        description: 'Røde felter må fylles ut før forhåndsvisning'
      });
      return;
    }
    
    const values = form.getValues();
    onPreview(values);
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
      // Select all images by default
      setSelectedImages(new Set(imageUrls.map(img => img.name)));
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

  // Image selection functions
  const toggleImageSelection = (imageName: string) => {
    const newSelected = new Set(selectedImages);
    if (newSelected.has(imageName)) {
      newSelected.delete(imageName);
    } else {
      newSelected.add(imageName);
    }
    setSelectedImages(newSelected);
  };

  const selectAllImages = () => {
    setSelectedImages(new Set(previewImages.map(img => img.name)));
  };

  const deselectAllImages = () => {
    setSelectedImages(new Set());
  };

  // Demo data fill function
  const fillDemoData = async () => {
    form.setValue('kontaktpersonNavn', 'Kari Nordmann');
    form.setValue('bedriftensNavn', 'Fjell & Fjord AS');
    form.setValue('datoNO', '21. oktober 2025');
    form.setValue('dateEN', 'October 21st, 2025');
    form.setValue('klokkeslett', '09:00–11:30');
    form.setValue('includeTime', true);
    form.setValue('bookinglink', 'https://pasientsky.no/booking/fjell-fjord-21-10');
    form.setValue('alternativ', '3');
    
    // Clear validation errors after filling demo data
    form.clearErrors();
    // Alternatively, trigger validation to show fields are now valid
    await form.trigger();
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
    <div className="min-h-screen bg-gradient-to-br from-light-mint via-background to-mint/20">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <Syringe className="h-12 w-12 text-moss-green mr-3" />
              <h1 className="text-4xl font-bold text-moss-green">
                Vaksinasjonsmateriell Generator
              </h1>
            </div>
            <p className="text-lg text-moss-green/70">
              Generer komplette materialpakker for bedriftsvaksinering
            </p>
          </div>

          <Card className="shadow-xl border-moss-green/20 backdrop-blur-sm bg-white/90">
            <CardHeader className="bg-gradient-to-r from-light-mint to-mint/30 border-b border-moss-green/10">
              <CardTitle className="text-2xl text-moss-green">Bedriftsinformasjon</CardTitle>
              <CardDescription className="text-moss-green/70">
                Fyll ut informasjonen for å generere tilpassede plakater, e-post og dokumenter
              </CardDescription>
              <Button 
                type="button" 
                variant="secondary" 
                size="sm"
                onClick={fillDemoData}
                className="w-fit mt-2 bg-mint text-moss-green hover:bg-mint/80"
              >
                Fyll demo-data
              </Button>
            </CardHeader>
            <CardContent className="p-6">
              <Form {...form}>
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="kontaktpersonNavn"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Kontaktperson Navn</FormLabel>
                          <FormControl>
                            <Input {...field} />
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
                            <Input {...field} />
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
                            <Input {...field} />
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
                            <Input {...field} />
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
                          <Input {...field} />
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
                          <Input {...field} />
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
                            <SelectItem value="5">
                              TEST - Nye maler
                            </SelectItem>
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
                      onClick={handlePreview}
                      disabled={isPreviewing || isGenerating}
                      className="w-full h-12 text-lg font-semibold bg-mint text-moss-green hover:bg-mint/80"
                      size="lg"
                    >
                      {isPreviewing ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Genererer forhåndsvisning...
                        </>
                      ) : (
                        <>
                          <Eye className="mr-2 h-5 w-5" />
                          Forhåndsvis og velg plakater
                        </>
                      )}
                    </Button>

                    <Button 
                      type="button"
                      onClick={handleGenerate}
                      disabled={isGenerating || isPreviewing}
                      className="w-full h-12 text-lg font-semibold bg-moss-green text-white hover:bg-moss-green/90"
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
                          Last ned vaksinasjonsmateriale
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
                  <Button onClick={copyEmailToClipboard} variant="outline" size="sm" className="border-mint text-mint hover:bg-mint hover:text-moss-green">
                    <Copy className="mr-2 h-4 w-4" />
                    Kopier tekst-versjon
                  </Button>
                  <Button onClick={copyHTMLToClipboard} variant="outline" size="sm" className="border-mint text-mint hover:bg-mint hover:text-moss-green">
                    <Copy className="mr-2 h-4 w-4" />
                    Kopier HTML-versjon
                  </Button>
                  <Button onClick={() => setShowEmailModal(false)} className="bg-light-mint text-moss-green hover:bg-light-mint/80" size="sm">
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

          <Dialog open={showPreview} onOpenChange={setShowPreview}>
            <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Forhåndsvisning av genererte bilder
                </DialogTitle>
                <DialogDescription>
                  Trykk på bildene for å velge hvilke som skal lastes ned
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <div className="flex gap-2">
                    <Button onClick={() => setShowPreview(false)} className="bg-light-mint text-moss-green hover:bg-light-mint/80" size="sm">
                      Lukk forhåndsvisning
                    </Button>
                    <Button
                      onClick={handleGenerate}
                      disabled={selectedImages.size === 0 || isGenerating}
                      size="sm"
                      className="bg-moss-green text-white hover:bg-moss-green/90"
                    >
                      {isGenerating ? 'Laster ned...' : 'Last ned valgte'}
                    </Button>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={selectAllImages}
                      variant="outline"
                      size="sm"
                      className="border-mint text-mint hover:bg-mint hover:text-moss-green"
                    >
                      Velg alle
                    </Button>
                    <Button
                      onClick={deselectAllImages}
                      variant="outline"
                      size="sm"
                      className="border-mint text-mint hover:bg-mint hover:text-moss-green"
                    >
                      Velg ingen
                    </Button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                  {/* Mission Files Column */}
                  {(() => {
                    const missionImages = previewImages.filter(image => 
                      image.name.toLowerCase().includes('mission')
                    );
                    return missionImages.length > 0 ? (
                      <div className="space-y-4">
                        <h4 className="font-semibold text-lg text-center border-b pb-2">Til oppdrag</h4>
                        {missionImages.map((image, index) => {
                          const isSelected = selectedImages.has(image.name);
                          return (
                            <Card 
                              key={`mission-${index}`}
                              className={`cursor-pointer transition-all ${
                                isSelected 
                                  ? 'ring-2 ring-blue-500 bg-blue-50' 
                                  : 'hover:ring-1 hover:ring-gray-300'
                              }`}
                              onClick={() => toggleImageSelection(image.name)}
                            >
                              <CardHeader className="pb-2">
                                <CardTitle className="text-xs flex items-center justify-between">
                                  {image.name}
                                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                                    isSelected 
                                      ? 'bg-blue-500 border-blue-500' 
                                      : 'bg-white border-gray-300'
                                  }`}>
                                    {isSelected && (
                                      <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                      </svg>
                                    )}
                                  </div>
                                </CardTitle>
                              </CardHeader>
                              <CardContent className="p-2 pt-0">
                                <img 
                                  src={image.url} 
                                  alt={`${image.name} forhåndsvisning`}
                                  className={`w-full h-auto border rounded-lg shadow-sm transition-opacity ${
                                    isSelected ? 'opacity-100' : 'opacity-70 hover:opacity-90'
                                  }`}
                                />
                              </CardContent>
                            </Card>
                          );
                        })}
                      </div>
                    ) : null;
                  })()}

                  {/* Graphic Files Column */}
                  {(() => {
                    const graphicImages = previewImages.filter(image => 
                      image.name.toLowerCase().includes('graphic') && 
                      !image.name.toLowerCase().includes('nographic')
                    );
                    return graphicImages.length > 0 ? (
                      <div className="space-y-4">
                        <h4 className="font-semibold text-lg text-center border-b pb-2">Med grafikk</h4>
                        {graphicImages.map((image, index) => {
                          const isSelected = selectedImages.has(image.name)
                          return (
                            <Card 
                              key={`graphic-${index}`}
                              className={`cursor-pointer transition-all ${
                                isSelected 
                                  ? 'ring-2 ring-blue-500 bg-blue-50' 
                                  : 'hover:ring-1 hover:ring-gray-300'
                              }`}
                              onClick={() => toggleImageSelection(image.name)}
                            >
                              <CardHeader className="pb-2">
                                <CardTitle className="text-xs flex items-center justify-between">
                                  {image.name}
                                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                                    isSelected 
                                      ? 'bg-blue-500 border-blue-500' 
                                      : 'bg-white border-gray-300'
                                  }`}>
                                    {isSelected && (
                                      <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                      </svg>
                                    )}
                                  </div>
                                </CardTitle>
                              </CardHeader>
                              <CardContent className="p-2 pt-0">
                                <img 
                                  src={image.url} 
                                  alt={`${image.name} forhåndsvisning`}
                                  className={`w-full h-auto border rounded-lg shadow-sm transition-opacity ${
                                    isSelected ? 'opacity-100' : 'opacity-70 hover:opacity-90'
                                  }`}
                                />
                              </CardContent>
                            </Card>
                          );
                        })}
                      </div>
                    ) : null;
                  })()}

                  {/* No-Graphic Files Column */}
                  {(() => {
                    const noGraphicImages = previewImages.filter(image => 
                      image.name.toLowerCase().includes('nographic')
                    );
                    return noGraphicImages.length > 0 ? (
                      <div className="space-y-4">
                        <h4 className="font-semibold text-lg text-center border-b pb-2">Uten grafikk</h4>
                        {noGraphicImages.map((image, index) => {
                          const isSelected = selectedImages.has(image.name);
                          return (
                            <Card 
                              key={`nographic-${index}`}
                              className={`cursor-pointer transition-all ${
                                isSelected 
                                  ? 'ring-2 ring-blue-500 bg-blue-50' 
                                  : 'hover:ring-1 hover:ring-gray-300'
                              }`}
                              onClick={() => toggleImageSelection(image.name)}
                            >
                              <CardHeader className="pb-2">
                                <CardTitle className="text-xs flex items-center justify-between">
                                  {image.name}
                                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                                    isSelected 
                                      ? 'bg-blue-500 border-blue-500' 
                                      : 'bg-white border-gray-300'
                                  }`}>
                                    {isSelected && (
                                      <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                      </svg>
                                    )}
                                  </div>
                                </CardTitle>
                              </CardHeader>
                              <CardContent className="p-2 pt-0">
                                <img 
                                  src={image.url} 
                                  alt={`${image.name} forhåndsvisning`}
                                  className={`w-full h-auto border rounded-lg shadow-sm transition-opacity ${
                                    isSelected ? 'opacity-100' : 'opacity-70 hover:opacity-90'
                                  }`}
                                />
                              </CardContent>
                            </Card>
                          );
                        })}
                      </div>
                    ) : null;
                  })()}

                  {/* Other Files Column */}
                  {(() => {
                    const otherImages = previewImages.filter(image => 
                      !image.name.toLowerCase().includes('graphic') && 
                      !image.name.toLowerCase().includes('nographic') &&
                      !image.name.toLowerCase().includes('mission')
                    );
                    return otherImages.length > 0 ? (
                      <div className="space-y-4">
                        <h4 className="font-semibold text-lg text-center border-b pb-2">Øvrig</h4>
                        {otherImages.map((image, index) => {
                          const isSelected = selectedImages.has(image.name);
                          return (
                            <Card 
                              key={`other-${index}`}
                              className={`cursor-pointer transition-all ${
                                isSelected 
                                  ? 'ring-2 ring-blue-500 bg-blue-50' 
                                  : 'hover:ring-1 hover:ring-gray-300'
                              }`}
                              onClick={() => toggleImageSelection(image.name)}
                            >
                              <CardHeader className="pb-2">
                                <CardTitle className="text-xs flex items-center justify-between">
                                  {image.name}
                                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                                    isSelected 
                                      ? 'bg-blue-500 border-blue-500' 
                                      : 'bg-white border-gray-300'
                                  }`}>
                                    {isSelected && (
                                      <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                      </svg>
                                    )}
                                  </div>
                                </CardTitle>
                              </CardHeader>
                              <CardContent className="p-2 pt-0">
                                <img 
                                  src={image.url} 
                                  alt={`${image.name} forhåndsvisning`}
                                  className={`w-full h-auto border rounded-lg shadow-sm transition-opacity ${
                                    isSelected ? 'opacity-100' : 'opacity-70 hover:opacity-90'
                                  }`}
                                />
                              </CardContent>
                            </Card>
                          );
                        })}
                      </div>
                    ) : null;
                  })()}
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}