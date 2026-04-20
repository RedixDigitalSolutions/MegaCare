# MegaCare — Database Reference

All data is seeded automatically on first backend startup (`npm run dev`).
Seeding only runs if the users collection is empty.

---

## 📊 Database Summary

| Collection | Count |
| --- | --- |
| users | 256 |
| appointments | ~125 |
| doctors | 3 |
| dossiers | 8 |
| medicines | 25 |
| products | 1779 |
| orders | ~70 |
| prescriptions | 25 |

| messages | ~32 |
| labtests | 30 |
| labresults | 19 |
| supplierorders | 15 |
| vitals | ~68 |
| medservicepatients | 8 |
| medserviceequipments | 7 |
| medserviceteammembers | 6 |
| medservicevisits | ~43 |
| medserviceinvoices | 12 |
| medserviceprescriptions | 8 |
| medservicesettings | 1 |
| paramedpatients | 10 |
| paramedappointments | ~58 |
| paramedsupplies | 10 |
| paramedcaresessions | 15 |
| paramedicalproducts | 15 |
| paramedicalcatalogs | 15 |
| medicalestablishments | 9 |
| publiclabcenters | 9 |

---

## 👤 Admin (1)

| Name | Email | Password | Phone |
| --- | --- | --- | --- |
| Nabil Gharbi | admin@megacare.tn | Admin@megacare2024 | +216 71 800 100 |

---

## 🩺 Doctors (4)

| Name | Email | Password | Specialty | Doctor ID | Status |
| --- | --- | --- | --- | --- | --- |
| Amira Mansouri | dr.mansouri@megacare.tn | Medecin@2024 | Cardiologie | MED-TN-2024-0742 | approved |
| Slim Hajri | dr.hajri@megacare.tn | Medecin@2024 | Dermatologie | MED-TN-2024-0891 | approved |
| Ines Ben Youssef | dr.benyoussef@megacare.tn | Medecin@2024 | Pediatrie | MED-TN-2024-0556 | approved |
| Karim Tlili | dr.tlili@megacare.tn | Medecin@2024 | Neurologie | MED-TN-2024-0991 | **pending** |

---

## 💊 Pharmacies (120 — 5 per governorate)

**Email pattern:** `pharmacie.{governorate}.{1-5}@megacare.tn`  
**Password (all):** `Pharmacien@2024`

| Governorate | Example Email | Example Company |
| --- | --- | --- |
| Tunis | pharmacie.tunis.1@megacare.tn | Pharmacie Centrale Tunis Ville |
| Ariana | pharmacie.ariana.1@megacare.tn | Pharmacie El Amal Ariana Ville |
| Ben Arous | pharmacie.benarous.1@megacare.tn | Pharmacie de la Sante Ben Arous |
| Manouba | pharmacie.manouba.1@megacare.tn | Pharmacie El Merja Manouba |
| Nabeul | pharmacie.nabeul.1@megacare.tn | Pharmacie Ennasr Nabeul |
| Zaghouan | pharmacie.zaghouan.1@megacare.tn | Pharmacie Centrale Zaghouan |
| Bizerte | pharmacie.bizerte.1@megacare.tn | Pharmacie El Amal Bizerte Nord |
| Beja | pharmacie.beja.1@megacare.tn | Pharmacie de la Sante Beja Nord |
| Jendouba | pharmacie.jendouba.1@megacare.tn | Pharmacie El Merja Jendouba |
| Kef | pharmacie.kef.1@megacare.tn | Pharmacie Ennasr Le Kef |
| Siliana | pharmacie.siliana.1@megacare.tn | Pharmacie Centrale Siliana Nord |
| Sousse | pharmacie.sousse.1@megacare.tn | Pharmacie El Amal Sousse Ville |
| Monastir | pharmacie.monastir.1@megacare.tn | Pharmacie de la Sante Monastir |
| Mahdia | pharmacie.mahdia.1@megacare.tn | Pharmacie El Merja Mahdia |
| Sfax | pharmacie.sfax.1@megacare.tn | Pharmacie Ennasr Sfax Ville |
| Kairouan | pharmacie.kairouan.1@megacare.tn | Pharmacie Centrale Kairouan Nord |
| Kasserine | pharmacie.kasserine.1@megacare.tn | Pharmacie El Amal Kasserine Nord |
| Sidi Bouzid | pharmacie.sidibouzid.1@megacare.tn | Pharmacie de la Sante Sidi Bouzid Ouest |
| Gabes | pharmacie.gabes.1@megacare.tn | Pharmacie El Merja Gabes Ville |
| Medenine | pharmacie.medenine.1@megacare.tn | Pharmacie Ennasr Medenine Nord |
| Tataouine | pharmacie.tataouine.1@megacare.tn | Pharmacie Centrale Tataouine Nord |
| Gafsa | pharmacie.gafsa.1@megacare.tn | Pharmacie El Amal Gafsa Nord |
| Tozeur | pharmacie.tozeur.1@megacare.tn | Pharmacie de la Sante Tozeur |
| Kebili | pharmacie.kebili.1@megacare.tn | Pharmacie El Merja Kebili Nord |

> Each governorate has 5 pharmacies numbered `.1` through `.5`. Login with any number.

---

## 🧪 Lab / Radiology (2)

| Name | Email | Password | Company | Lab ID |
| --- | --- | --- | --- | --- |
| Yassine Bouzid | labo.elamal@megacare.tn | Labo@2024 | Laboratoire El Amal | LAB-TN-2024-0031 |
| Rym Ferchichi | labo.pasteur@megacare.tn | Labo@2024 | Centre Radio-Diagnostic Pasteur | LAB-TN-2024-0042 |

---

## 🏥 Medical Service (1)

| Name | Email | Password | Company | Service ID |
| --- | --- | --- | --- | --- |
| Rania Cherif | had.sante@megacare.tn | Service@2024 | HAD Sante a Domicile | SVC-TN-2024-0012 |

---

## 💅 Parapharmacies (120 — 5 per governorate)

**Email pattern:** `para.{governorate}.{1-5}@megacare.tn`  
**Password (all):** `Paramedical@2024`  
**Type:** Beauty & cosmetics shops (solar creams, skincare, women's cosmetics, dermocosmetics)

| Governorate | Example Email | Example Company |
| --- | --- | --- |
| Tunis | para.tunis.1@megacare.tn | Parapharmacie Beaute Plus Tunis Ville |
| Ariana | para.ariana.1@megacare.tn | Parapharmacie Hana Beauty Ariana Ville |
| Ben Arous | para.benarous.1@megacare.tn | Parapharmacie Syrine Ben Arous |
| Manouba | para.manouba.1@megacare.tn | Parapharmacie Reine de Beaute Manouba |
| Nabeul | para.nabeul.1@megacare.tn | Parapharmacie Teint Parfait Nabeul |
| Zaghouan | para.zaghouan.1@megacare.tn | Parapharmacie Beaute Plus Zaghouan |
| Bizerte | para.bizerte.1@megacare.tn | Parapharmacie Hana Beauty Bizerte Nord |
| Beja | para.beja.1@megacare.tn | Parapharmacie Syrine Beja Nord |
| Jendouba | para.jendouba.1@megacare.tn | Parapharmacie Reine de Beaute Jendouba |
| Kef | para.kef.1@megacare.tn | Parapharmacie Teint Parfait Le Kef |
| Siliana | para.siliana.1@megacare.tn | Parapharmacie Beaute Plus Siliana Nord |
| Sousse | para.sousse.1@megacare.tn | Parapharmacie Hana Beauty Sousse Ville |
| Monastir | para.monastir.1@megacare.tn | Parapharmacie Syrine Monastir |
| Mahdia | para.mahdia.1@megacare.tn | Parapharmacie Reine de Beaute Mahdia |
| Sfax | para.sfax.1@megacare.tn | Parapharmacie Teint Parfait Sfax Ville |
| Kairouan | para.kairouan.1@megacare.tn | Parapharmacie Beaute Plus Kairouan Nord |
| Kasserine | para.kasserine.1@megacare.tn | Parapharmacie Hana Beauty Kasserine Nord |
| Sidi Bouzid | para.sidibouzid.1@megacare.tn | Parapharmacie Syrine Sidi Bouzid Ouest |
| Gabes | para.gabes.1@megacare.tn | Parapharmacie Reine de Beaute Gabes Ville |
| Medenine | para.medenine.1@megacare.tn | Parapharmacie Teint Parfait Medenine Nord |
| Tataouine | para.tataouine.1@megacare.tn | Parapharmacie Beaute Plus Tataouine Nord |
| Gafsa | para.gafsa.1@megacare.tn | Parapharmacie Hana Beauty Gafsa Nord |
| Tozeur | para.tozeur.1@megacare.tn | Parapharmacie Syrine Tozeur |
| Kebili | para.kebili.1@megacare.tn | Parapharmacie Reine de Beaute Kebili Nord |

> Each governorate has 5 parapharmacies numbered `.1` through `.5`. Login with any number.

---

## 🙍 Patients (8)

| Name | Email | Password | Phone |
| --- | --- | --- | --- |
| Fatima Benali | fatima.benali@gmail.com | Patient@2024 | +216 98 123 456 |
| Mohamed Karoui | mohamed.karoui@gmail.com | Patient@2024 | +216 98 234 567 |
| Aisha Hamdi | aisha.hamdi@gmail.com | Patient@2024 | +216 98 345 678 |
| Salim Drissi | salim.drissi@gmail.com | Patient@2024 | +216 98 456 789 |
| Layla Meddeb | layla.meddeb@gmail.com | Patient@2024 | +216 98 567 890 |
| Youssef Bouazizi | youssef.bouazizi@gmail.com | Patient@2024 | +216 52 112 233 |
| Nour Triki | nour.triki@gmail.com | Patient@2024 | +216 55 998 877 |
| Karim Saidi |   | Patient@2024 | +216 97 332 211 |

---

## 💊 Medicines Catalog (25)

| Name | DCI | Category | Form | Brand | Prescription |
| --- | --- | --- | --- | --- | --- |
| Paracetamol 500mg | Paracetamol | Analgesique | Comprimes | DOLIPRANE | ❌ |
| Amoxicilline 500mg | Amoxicilline | Antibiotique | Gelules | CLAMOXYL | ✅ |
| Vitamine C 1000mg | Acide ascorbique | Vitamines | Comprimes effervescents | UPSA-C | ❌ |
| Ibuprofene 400mg | Ibuprofene | Anti-inflammatoire | Comprimes | ADVIL | ❌ |
| Omeprazole 20mg | Omeprazole | Gastro-enterologie | Gelules gastro-resistantes | MOPRAL | ✅ |
| Loratadine 10mg | Loratadine | Antihistaminique | Comprimes | CLARITYNE | ❌ |
| Amlodipine 5mg | Amlodipine | Antihypertenseur | Comprimes | AMLOR | ✅ |
| Metformine 850mg | Metformine | Antidiabetique | Comprimes | GLUCOPHAGE | ✅ |
| Atorvastatine 20mg | Atorvastatine | Cardiologie | Comprimes pellicules | TAHOR | ✅ |
| Azithromycine 250mg | Azithromycine | Antibiotique | Comprimes | ZITHROMAX | ✅ |
| Diclofenac 50mg | Diclofenac | Anti-inflammatoire | Comprimes | VOLTARENE | ✅ |
| Cetirizine 10mg | Cetirizine | Antihistaminique | Comprimes | ZYRTEC | ❌ |
| Pantoprazole 40mg | Pantoprazole | Gastro-enterologie | Comprimes gastro-resistants | INIPOMP | ✅ |
| Levothyroxine 50ug | Levothyroxine | Endocrinologie | Comprimes | LEVOTHYROX | ✅ |
| Acide folique 5mg | Acide folique | Vitamines | Comprimes | SPECIAFOLDINE | ❌ |
| Salbutamol 100ug | Salbutamol | Pneumologie | Spray | VENTOLINE | ✅ |
| Prednisone 20mg | Prednisone | Anti-inflammatoire | Comprimes | CORTANCYL | ✅ |
| Fer 80mg | Sulfate ferreux | Vitamines | Comprimes | TARDYFERON | ❌ |
| Ciprofloxacine 500mg | Ciprofloxacine | Antibiotique | Comprimes | CIFLOX | ✅ |
| Magnesium 300mg | Magnesium | Vitamines | Comprimes | MAG 2 | ❌ |
| Losartan 50mg | Losartan | Antihypertenseur | Comprimes pellicules | COZAAR | ✅ |
| Tramadol 50mg | Tramadol | Analgesique | Gelules | TOPALGIC | ✅ |
| Domperidone 10mg | Domperidone | Gastro-enterologie | Comprimes | MOTILIUM | ❌ |
| Fluconazole 150mg | Fluconazole | Dermatologie | Gelule unique | TRIFLUCAN | ✅ |
| Vitamine D3 100000 UI | Cholecalciferol | Vitamines | Solution buvable | UVEDOSE | ❌ |

---

## 🏗️ Medical Establishments (9)

| Name | Type | Governorate | City | Rating | Beds | Doctors | Emergencies |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Clinique La Marsa | Clinique | Tunis | La Marsa | 4.6 | 120 | 45 | ✅ |
| Hopital La Rabta | Hôpital | Tunis | Tunis | 4.2 | 450 | 180 | ✅ |
| Clinique Pasteur | Clinique | Tunis | Tunis | 4.7 | 60 | 35 | ❌ |
| Hopital Sahloul | Hôpital | Sousse | Sousse | 4.4 | 620 | 250 | ✅ |
| Clinique Les Oliviers | Clinique | Sfax | Sfax | 4.5 | 80 | 30 | ✅ |
| Hopital Habib Bourguiba Sfax | Hôpital | Sfax | Sfax | 4.1 | 800 | 320 | ✅ |
| Clinique El Amen Nabeul | Clinique | Nabeul | Nabeul | 4.3 | 50 | 20 | ✅ |
| Hopital Fattouma Bourguiba Monastir | Hôpital | Monastir | Monastir | 4.3 | 550 | 200 | ✅ |
| Polyclinique Les Jasmins | Clinique | Ariana | Ariana | 4.4 | 30 | 15 | ❌ |

---

## 🧫 Public Lab Centers (9)

| Name | Type | Governorate | City | Rating | CNAM | Delay | 24h |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Laboratoire Central de Tunis | Laboratoire | Tunis | Tunis | 4.7 | ✅ | 24-48h | ❌ |
| Centre d Imagerie Avicenne | Radiologie | Tunis | Tunis | 4.8 | ✅ | 2-4h | ❌ |
| Laboratoire Pasteur Sousse | Laboratoire | Sousse | Sousse | 4.5 | ✅ | 24h | ❌ |
| Centre Radio-Diagnostic Sfax | Radiologie | Sfax | Sfax | 4.4 | ✅ | 2-6h | ✅ |
| Laboratoire El Amal Ariana | Laboratoire | Ariana | Ariana | 4.6 | ✅ | 12-24h | ❌ |
| Centre IRM Monastir | Radiologie | Monastir | Monastir | 4.3 | ❌ | 4-8h | ❌ |
| Laboratoire Bio-Sante Nabeul | Laboratoire | Nabeul | Nabeul | 4.4 | ✅ | 24-48h | ❌ |
| Centre de Radiologie Ben Arous | Radiologie | Ben Arous | Ben Arous | 4.5 | ✅ | 1-3h | ❌ |
| Laboratoire Moderne Bizerte | Laboratoire | Bizerte | Bizerte | 4.2 | ✅ | 24-48h | ❌ |

---

## 🩻 Paramedical Products (15)

| Name | Brand | Category | Price (DT) | Prescription |
| --- | --- | --- | --- | --- |
| Genouillere ligamentaire rotulienne | Thuasne | Orthopedie | 45.00 | ❌ |
| Attelle de poignet Manurhizo | Gibaud | Orthopedie | 38.50 | ✅ |
| Ceinture lombaire LombaSkin | Thuasne | Orthopedie | 65.00 | ❌ |
| Bequilles aluminium reglables | Invacare | Aide a la mobilite | 35.00 | ❌ |
| Electrostimulateur TENS | Compex | Reeducation | 189.00 | ❌ |
| Bandes de resistance set 5 niveaux | TheraBand | Reeducation | 28.00 | ❌ |
| Coussin d assise ergonomique | Sissel | Ergonomie | 42.00 | ❌ |
| Spirometre incitatif Voldyne | Teleflex | Respiratoire | 22.00 | ❌ |
| Creme chauffante articulaire | Phytodolor | Soins | 14.50 | ❌ |
| Chevillere stabilisatrice Malleo | Bauerfeind | Orthopedie | 52.00 | ❌ |
| Rouleau de massage fascia | Blackroll | Reeducation | 32.00 | ❌ |
| Table d inversion therapeutique | Teeter | Reeducation | 450.00 | ✅ |
| Huile essentielle menthe poivree | Puressentiel | Soins | 9.50 | ❌ |
| Poche chaud/froid reutilisable | Nexcare 3M | Soins | 8.00 | ❌ |
| Deambulateur pliant 4 roues | Drive Medical | Aide a la mobilite | 120.00 | ❌ |

---

## 📋 Generated Data (random, varies per seed)

| Data Type | Approx. Count | Range |
| --- | --- | --- |
| Appointments | ~116 | 30 days past + 7 future, 2-5/day |
| Messages | ~31 | 8 conversation pairs (patient ↔ doctor) |
| Patient Dossiers | 8 | 1 per patient, with medical history |
| Pharmacy Orders | ~76 | 30 days, 1-4/day |
| Reviews | ~23 | Across 3 approved doctors |
| Prescriptions | 25 | With 1-4 medications each |
| Lab Tests | 30 | Various test types |
| Lab Results | ~17 | For completed tests |
| Supplier Orders | 15 | From Tunisian pharma suppliers |
| Vitals | ~70 | Medical service + paramedical patients |
| Med Service Patients | 8 | HAD patients |
| Med Service Equipment | 7 | Various medical devices |
| Med Service Team | 6 | Nurses, therapists, aides |
| Med Service Visits | ~45 | 14 days, 2-4/day |
| Med Service Invoices | 12 | Various statuses |
| Med Service Prescriptions | 8 | Active and terminated |
| Paramed Patients | 10 | Split between 2 paramedicals |
| Paramed Appointments | ~52 | 14 past + 5 future days |
| Paramed Supplies | 10 | Various categories |
| Paramed Care Sessions | 15 | Signed and unsigned |
| Pharmacy Products | 52 | Medicines distributed across 3 pharmacies |

---

## Notes

- Backend runs on **port 5000** — start with `npm run dev` from project root
- Frontend runs on **port 5173** (or 5174 if 5173 is busy)
- All passwords are hashed with bcrypt on seed — use the plaintext passwords above to log in
- Seeding only runs if the users collection is empty (first run only)
- To re-seed: drop the database with `mongosh megacare --eval "db.dropDatabase()"` then restart the backend
- To re-seed: drop the `megacare` MongoDB database and restart the backend
