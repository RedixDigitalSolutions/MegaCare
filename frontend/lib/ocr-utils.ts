import { mockMedicines } from "./pharmacy-data";

export interface ExtractedMedicine {
  name: string;
  dosage?: string;
  quantity?: number;
  confidence: number;
  foundMedicine?: (typeof mockMedicines)[0];
}

// Medicine names variations for better matching
const medicineVariations: Record<string, string[]> = {
  // ── Antibiotiques ──
  Amoxicilline: ["amoxicilline", "amoxycilline", "amoxil", "amoxi", "amox"],
  Augmentin: [
    "augmentin",
    "amoxiclav",
    "amoxicilline/acide clavulanique",
    "co-amoxiclav",
  ],
  Azithromycine: ["azithromycine", "azithromycin", "zithromax", "azitro"],
  Ciprofloxacine: ["ciprofloxacine", "ciprofloxacin", "cipro", "ciproxine"],
  Lévofloxacine: ["lévofloxacine", "levofloxacine", "levofloxacin", "tavanic"],
  Doxycycline: ["doxycycline", "doxycyline", "vibramycine"],
  Métronidazole: ["métronidazole", "metronidazole", "flagyl"],
  Céfixime: ["céfixime", "cefixime", "oroken", "suprax"],
  Ceftriaxone: ["ceftriaxone", "rocéphine", "rocephine"],
  Érythromycine: ["érythromycine", "erythromycine", "erythromycin", "ery"],
  Clarithromycine: ["clarithromycine", "clarithromycin", "zeclar"],
  Ofloxacine: ["ofloxacine", "ofloxacin", "oflocet"],
  Cotrimoxazole: [
    "cotrimoxazole",
    "bactrim",
    "sulfaméthoxazole",
    "sulfamethoxazole",
  ],
  Spiramycine: ["spiramycine", "rovamycine"],
  Pristinamycine: ["pristinamycine", "pyostacine"],

  // ── Antalgiques / Anti-inflammatoires ──
  Paracétamol: [
    "paracétamol",
    "paracetamol",
    "acetaminophen",
    "tylenol",
    "doliprane",
    "efferalgan",
    "dafalgan",
  ],
  Ibuprofène: [
    "ibuprofène",
    "ibuprofen",
    "ibupirac",
    "advil",
    "nurofen",
    "brufen",
  ],
  Diclofénac: [
    "diclofénac",
    "diclofenac",
    "voltarène",
    "voltarene",
    "voltaren",
  ],
  Kétoprofène: [
    "kétoprofène",
    "ketoprofene",
    "profénid",
    "profenid",
    "kétum",
    "ketum",
  ],
  Aspirine: [
    "aspirine",
    "aspirin",
    "acide acétylsalicylique",
    "aspégic",
    "aspegic",
  ],
  Tramadol: ["tramadol", "tramal", "topalgic", "contramal"],
  Codéine: ["codéine", "codeine", "codoliprane"],
  Naproxène: ["naproxène", "naproxene", "naprosyne", "aleve"],
  Célécoxib: ["célécoxib", "celecoxib", "celebrex"],
  Acéclofénac: ["acéclofénac", "aceclofenac", "airtal"],
  Piroxicam: ["piroxicam", "feldène", "feldene"],

  // ── Gastro-entérologie ──
  Oméprazole: ["oméprazole", "omeprazole", "prilosec", "mopral"],
  Ésoméprazole: ["ésoméprazole", "esomeprazole", "inexium", "nexium"],
  Lansoprazole: ["lansoprazole", "lanzor", "ogast", "prevacid"],
  Pantoprazole: ["pantoprazole", "inipomp", "pantoloc"],
  Ranitidine: ["ranitidine", "zantac", "azantac"],
  Dompéridone: ["dompéridone", "domperidone", "motilium", "peridys"],
  Métoclopramide: [
    "métoclopramide",
    "metoclopramide",
    "primpéran",
    "primperan",
  ],
  Smecta: ["smecta", "diosmectite", "smectalia"],
  Lopéramide: ["lopéramide", "loperamide", "imodium"],
  Mébévérine: ["mébévérine", "mebeverine", "duspatalin"],

  // ── Cardiologie / Hypertension ──
  Lisinopril: ["lisinopril", "zestril", "prinivil"],
  Énalapril: ["énalapril", "enalapril", "renitec"],
  Ramipril: ["ramipril", "triatec"],
  Périndopril: ["périndopril", "perindopril", "coversyl"],
  Captopril: ["captopril", "lopril"],
  Losartan: ["losartan", "cozaar"],
  Valsartan: ["valsartan", "tareg", "diovan"],
  Irbésartan: ["irbésartan", "irbesartan", "aprovel"],
  Amlodipine: ["amlodipine", "norvasc", "amlor"],
  Nifédipine: ["nifédipine", "nifedipine", "adalate"],
  Atenolol: ["atenolol", "tenormine", "ténormine"],
  Bisoprolol: ["bisoprolol", "concor", "detensiel"],
  Propranolol: ["propranolol", "avlocardyl"],
  Furosémide: ["furosémide", "furosemide", "lasilix", "lasix"],
  Hydrochlorothiazide: ["hydrochlorothiazide", "esidrex"],
  Spironolactone: ["spironolactone", "aldactone"],
  Clopidogrel: ["clopidogrel", "plavix"],
  Warfarine: ["warfarine", "warfarin", "coumadine", "coumadin"],
  Rivaroxaban: ["rivaroxaban", "xarelto"],
  Atorvastatine: ["atorvastatine", "atorvastatin", "tahor", "lipitor"],
  Simvastatine: ["simvastatine", "simvastatin", "zocor"],
  Rosuvastatine: ["rosuvastatine", "rosuvastatin", "crestor"],
  Fénofibrate: ["fénofibrate", "fenofibrate", "lipanthyl"],
  Digoxine: ["digoxine", "digoxin", "lanoxin"],
  Amiodarone: ["amiodarone", "cordarone"],
  Flécaïnide: ["flécaïnide", "flecainide", "flécaine"],

  // ── Diabétologie ──
  Metformine: ["metformine", "metformin", "glucophage", "stagid"],
  Gliclazide: ["gliclazide", "diamicron"],
  Glibenclamide: ["glibenclamide", "daonil"],
  Glimepiride: ["glimépiride", "glimepiride", "amarel"],
  Sitagliptine: ["sitagliptine", "sitagliptin", "januvia", "xelevia"],
  Vildagliptine: ["vildagliptine", "vildagliptin", "galvus"],
  Insuline: [
    "insuline",
    "insulin",
    "lantus",
    "novorapid",
    "humalog",
    "levemir",
    "apidra",
  ],

  // ── Antihistaminiques / Allergie ──
  Cetirizine: ["cetirizine", "cétirizine", "zyrtec", "virlix"],
  Loratadine: ["loratadine", "claritin", "claritine"],
  Desloratadine: ["desloratadine", "aerius", "desloratadin"],
  Fexofénadine: ["fexofénadine", "fexofenadine", "telfast"],
  Lévocétirizine: ["lévocétirizine", "levocetirizine", "xyzall"],
  Bilastine: ["bilastine", "bilaska"],
  Hydroxyzine: ["hydroxyzine", "atarax"],

  // ── Respiratoire / Pneumologie ──
  Salbutamol: ["salbutamol", "ventoline", "ventolin", "airomir"],
  Budésonide: ["budésonide", "budesonide", "pulmicort"],
  Fluticasone: ["fluticasone", "flixotide", "seretide"],
  Montélukast: ["montélukast", "montelukast", "singulair"],
  Acétylcystéine: ["acétylcystéine", "acetylcysteine", "fluimucil", "mucomyst"],
  Carbocistéine: ["carbocistéine", "carbocisteine", "rhinathiol", "bronchokod"],
  Ambroxol: ["ambroxol", "muxol", "mucosolvan"],
  Dextrométhorphane: ["dextrométhorphane", "dextromethorphane", "tuxium"],
  Théophylline: ["théophylline", "theophylline", "euphylline"],

  // ── Neurologie / Psychiatrie ──
  Sertraline: ["sertraline", "zoloft"],
  Fluoxétine: ["fluoxétine", "fluoxetine", "prozac"],
  Paroxétine: ["paroxétine", "paroxetine", "déroxat", "deroxat", "paxil"],
  Escitalopram: ["escitalopram", "séroplex", "seroplex", "lexapro", "cipralex"],
  Venlafaxine: ["venlafaxine", "effexor"],
  Duloxétine: ["duloxétine", "duloxetine", "cymbalta"],
  Alprazolam: ["alprazolam", "xanax"],
  Diazépam: ["diazépam", "diazepam", "valium"],
  Bromazépam: ["bromazépam", "bromazepam", "lexomil"],
  Zolpidem: ["zolpidem", "stilnox"],
  Zopiclone: ["zopiclone", "imovane"],
  Prégabaline: ["prégabaline", "pregabaline", "pregabalin", "lyrica"],
  Gabapentine: ["gabapentine", "gabapentin", "neurontin"],
  Carbamazépine: ["carbamazépine", "carbamazepine", "tégrétol", "tegretol"],
  Valproate: ["valproate", "dépakine", "depakine", "acide valproïque"],
  Lévétiracétam: ["lévétiracétam", "levetiracetam", "keppra"],
  Amitriptyline: ["amitriptyline", "laroxyl", "elavil"],

  // ── Dermatologie ──
  Diprosone: ["diprosone", "bétaméthasone", "betamethasone"],
  Dermoval: ["dermoval", "clobétasol", "clobetasol"],
  Aciclovir: ["aciclovir", "acyclovir", "zovirax"],
  Kétoconazole: ["kétoconazole", "ketoconazole", "kétoderm", "nizoral"],
  Terbinafine: ["terbinafine", "lamisil"],
  Adapalène: ["adapalène", "adapalene", "différine", "differine"],
  Isotrétinoïne: ["isotrétinoïne", "isotretinoine", "roaccutane", "curacné"],
  Fusidique: ["acide fusidique", "fucidine", "fusidine"],

  // ── Ophtalmologie ──
  Tobramycine: ["tobramycine", "tobramycin", "tobrex"],
  Timolol: ["timolol", "timoptol"],
  Latanoprost: ["latanoprost", "xalatan"],

  // ── Endocrinologie / Thyroïde ──
  Lévothyroxine: [
    "lévothyroxine",
    "levothyroxine",
    "levothyrox",
    "euthyrox",
    "synthroid",
  ],
  Prednisone: ["prednisone", "cortancyl"],
  Prednisolone: ["prednisolone", "solupred"],
  Dexaméthasone: ["dexaméthasone", "dexamethasone", "dectancyl"],

  // ── Rhumatologie ──
  Allopurinol: ["allopurinol", "zyloric"],
  Colchicine: ["colchicine", "colchimax"],
  Méthotrexate: ["méthotrexate", "methotrexate", "novatrex"],

  // ── Suppléments / Vitamines ──
  Magnésium: [
    "magnésium",
    "magnesium",
    "mag 2",
    "magnévie",
    "magnevie",
    "magnésium b6",
  ],
  Fer: ["fer", "tardyféron", "tardyferon", "ferrostrane", "fumafer"],
  "Vitamine D": [
    "vitamine d",
    "cholécalciférol",
    "cholecalciferol",
    "uvédose",
    "uvedose",
    "zyma d",
  ],
  "Vitamine B12": ["vitamine b12", "cyanocobalamine", "hydroxocobalamine"],
  "Vitamine C": ["vitamine c", "acide ascorbique", "ascorbique"],
  "Acide folique": [
    "acide folique",
    "folique",
    "spéciafoldine",
    "speciafoldine",
  ],
  Calcium: ["calcium", "caltrate", "orocal", "cacit"],
  Zinc: ["zinc", "rubozinc"],

  // ── Urologie ──
  Tamsulosine: ["tamsulosine", "tamsulosin", "omix", "josir"],
  Alfuzosine: ["alfuzosine", "alfuzosin", "xatral"],
  Finastéride: ["finastéride", "finasteride", "chibro-proscar", "propecia"],

  // ── Autres fréquents ──
  Phloroglucinol: ["phloroglucinol", "spasfon"],
  Thiocolchicoside: ["thiocolchicoside", "coltramyl", "miorel"],
  Héparine: ["héparine", "heparine", "lovenox", "énoxaparine", "enoxaparine"],
  "Acide acétylsalicylique": [
    "acide acétylsalicylique",
    "kardégic",
    "kardegic",
  ],
};

export function extractMedicineNames(text: string): ExtractedMedicine[] {
  const extracted: ExtractedMedicine[] = [];
  const normalizedText = text.toLowerCase();

  // Process each known medicine
  for (const [medicineName, variations] of Object.entries(medicineVariations)) {
    for (const variation of variations) {
      const regex = new RegExp(`\\b${variation}\\b`, "gi");
      if (regex.test(normalizedText)) {
        const medicine = mockMedicines.find((m) => m.name === medicineName);

        // Extract dosage if present
        const dosagePattern = new RegExp(
          `${variation}\\s*([0-9]+\\s*(?:mg|ml|g)?)`,
          "i",
        );
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
  text = text.replace(/\s+/g, " ").trim();

  // Remove common OCR errors
  text = text.replace(/l0/g, "lo"); // l0 -> lo
  text = text.replace(/O0/g, "00"); // O0 -> 00
  text = text.replace(/I1/g, "Il"); // I1 -> Il

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
  const patientMatch = cleanedText.match(
    /(?:patient|nom):\s*([A-Za-zàâäéèêëïîôùûüœæÀÂÄÉÈÊËÏÎÔÙÛÜŒÆ\s]+)/i,
  );
  const doctorMatch = cleanedText.match(
    /(?:docteur|dr|médecin):\s*([A-Za-zàâäéèêëïîôùûüœæÀÂÄÉÈÊËÏÎÔÙÛÜŒÆ\s]+)/i,
  );

  return {
    medicines,
    patientName: patientMatch?.[1]?.trim(),
    doctorName: doctorMatch?.[1]?.trim(),
  };
}

export async function initializeTesseract(): Promise<any> {
  try {
    const { createWorker } = await import("tesseract.js");
    const worker = await createWorker("fra+eng");
    return worker;
  } catch (error) {
    console.error("Erreur lors de l'initialisation de Tesseract:", error);
    return null;
  }
}

export async function recognizeText(
  imagePath: string,
  worker: any,
): Promise<string> {
  if (!worker) {
    throw new Error("Tesseract worker not initialized");
  }

  const result = await worker.recognize(imagePath);
  return result.data.text;
}
