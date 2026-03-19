import { mockMedicines } from './pharmacy-data';

export interface ExtractedMedicine {
  name: string;
  dosage?: string;
  quantity?: number;
  confidence: number;
  foundMedicine?: (typeof mockMedicines)[0];
}

// Medicine names variations for better matching
const medicineVariations: Record<string, string[]> = {
  'Amoxicilline': ['amoxicilline', 'amoxycilline', 'amoxil'],
  'Paracétamol': ['paracétamol', 'paracetamol', 'acetaminophen', 'tylenol'],
  'Ibuprofène': ['ibuprofène', 'ibuprofen', 'ibupirac'],
  'Metformine': ['metformine', 'glucophage'],
  'Lisinopril': ['lisinopril', 'zestril', 'prinivil'],
  'Oméprazole': ['oméprazole', 'omeprazole', 'prilosec'],
  'Cetirizine': ['cetirizine', 'zyrtec'],
  'Loratadine': ['loratadine', 'claritin'],
  'Augmentin': ['augmentin', 'amoxiclav'],
  'Azithromycine': ['azithromycine', 'azithromycin', 'zithromax'],
};

export function extractMedicineNames(text: string): ExtractedMedicine[] {
  const extracted: ExtractedMedicine[] = [];
  const normalizedText = text.toLowerCase();
  
  // Process each known medicine
  for (const [medicineName, variations] of Object.entries(medicineVariations)) {
    for (const variation of variations) {
      const regex = new RegExp(`\\b${variation}\\b`, 'gi');
      if (regex.test(normalizedText)) {
        const medicine = mockMedicines.find((m) => m.name === medicineName);
        
        // Extract dosage if present
        const dosagePattern = new RegExp(`${variation}\\s*([0-9]+\\s*(?:mg|ml|g)?)`, 'i');
        const dosageMatch = normalizedText.match(dosagePattern);
        
        extracted.push({
          name: medicineName,
          dosage: dosageMatch?.[1],
          confidence: 0.9,
          foundMedicine: medicine,
        });
        break;
      }
    }
  }
  
  return extracted;
}

export function cleanOCRText(text: string): string {
  // Remove extra whitespace
  text = text.replace(/\s+/g, ' ').trim();
  
  // Remove common OCR errors
  text = text.replace(/l0/g, 'lo'); // l0 -> lo
  text = text.replace(/O0/g, '00'); // O0 -> 00
  text = text.replace(/I1/g, 'Il'); // I1 -> Il
  
  return text;
}

export function extractPrescriptionInfo(text: string): {
  medicines: ExtractedMedicine[];
  patientName?: string;
  doctorName?: string;
} {
  const cleanedText = cleanOCRText(text);
  const medicines = extractMedicineNames(cleanedText);
  
  // Try to extract patient name (usually after "Patient:" or "Nom:")
  const patientMatch = cleanedText.match(/(?:patient|nom):\s*([A-Za-zàâäéèêëïîôùûüœæÀÂÄÉÈÊËÏÎÔÙÛÜŒÆ\s]+)/i);
  const doctorMatch = cleanedText.match(/(?:docteur|dr|médecin):\s*([A-Za-zàâäéèêëïîôùûüœæÀÂÄÉÈÊËÏÎÔÙÛÜŒÆ\s]+)/i);
  
  return {
    medicines,
    patientName: patientMatch?.[1]?.trim(),
    doctorName: doctorMatch?.[1]?.trim(),
  };
}

export async function initializeTesseract(): Promise<any> {
  try {
    const { createWorker } = await import('tesseract.js');
    const worker = await createWorker('fra+eng');
    return worker;
  } catch (error) {
    console.error('Erreur lors de l\'initialisation de Tesseract:', error);
    return null;
  }
}

export async function recognizeText(imagePath: string, worker: any): Promise<string> {
  if (!worker) {
    throw new Error('Tesseract worker not initialized');
  }
  
  const result = await worker.recognize(imagePath);
  return result.data.text;
}
