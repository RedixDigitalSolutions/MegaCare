# MegaCare — Database Reference

All data is seeded automatically on first backend startup (`npm run dev`).
Seeding only runs if the users collection is empty.

Additional one-off scripts create lab and establishment accounts:
- `node src/create-lab-accounts.js` — creates 7 public-lab-center login accounts
- `node src/create-establishment-accounts.js` — creates 35 medical-service login accounts

---

## ⚡ Quick Reference — One Login Per Role

| Role | Email | Password |
| --- | --- | --- |
| Admin | admin@megacare.tn | Admin@megacare2024 |
| Patient | fatima.benali@gmail.com | Patient@2024 |
| Doctor | dr.mansouri@megacare.tn | Medecin@2024 |
| Pharmacy | pharmacie.tunis.1@megacare.tn | Pharmacien@2024 |
| Lab / Radiology (seeded) | labo.elamal@megacare.tn | Labo@2024 |
| Lab / Radiology (script) | labo.central.tunis@megacare.tn | Lab@2024 |
| Medical Service (legacy) | had.sante@megacare.tn | Service@2024 |
| Medical Service (estab) | clinique.lamarsa@megacare.tn | Service@2024 |
| Paramedical / Parapharmacie | para.tunis.1@megacare.tn | Paramedical@2024 |

---

## 📊 Database Summary

| Collection | Count |
| --- | --- |
| users | 304 |
| appointments | 117 |
| doctors | 10 |
| dossiers | 8 |
| medicines | 25 |
| products | 1809 |
| orders | 72 |
| prescriptions | 25 |
| messages | 37 |
| labtests | 30 |
| labresults | 26 |
| supplierorders | 15 |
| vitals | 79 |
| medservicepatients | 8 |
| medserviceequipments | 7 |
| medserviceteammembers | 6 |
| medservicevisits | 46 |
| medserviceinvoices | 12 |
| medserviceprescriptions | 8 |
| medservicesettings | 1 |
| paramedpatients | 10 |
| paramedappointments | 58 |
| paramedsupplies | 10 |
| paramedcaresessions | 15 |
| paramedicalproducts | 37 |
| paramedicalcatalogs | 35 |
| medicalestablishments | 35 |
| publiclabcenters | 9 |

---

## 👤 Admin (1)

| Name | Email | Password | Phone |
| --- | --- | --- | --- |
| Nabil Gharbi | admin@megacare.tn | Admin@megacare2024 | +216 71 800 100 |

---

## 🩺 Doctors (10 — all approved)

**Password (all):** `Medecin@2024`

| Name | Email | Specialty | Doctor ID | Status |
| --- | --- | --- | --- | --- |
| Amira Mansouri | dr.mansouri@megacare.tn | Cardiologie | MED-TN-2024-0742 | approved |
| Slim Hajri | dr.hajri@megacare.tn | Dermatologie | MED-TN-2024-0891 | approved |
| Ines Ben Youssef | dr.benyoussef@megacare.tn | Pediatrie | MED-TN-2024-0556 | approved |
| Karim Tlili | dr.tlili@megacare.tn | Neurologie | MED-TN-2024-0991 | approved |
| Sonia Belhaj | dr.belhaj@megacare.tn | Gynecologie | MED-TN-2024-1123 | approved |
| Riadh Chaabane | dr.chaabane@megacare.tn | Ophtalmologie | MED-TN-2024-1254 | approved |
| Leila Trabelsi | dr.trabelsi@megacare.tn | Psychiatrie | MED-TN-2024-1387 | approved |
| Nizar Gharbi | dr.gharbi@megacare.tn | Chirurgie generale | MED-TN-2024-1498 | approved |
| Hajer Mekni | dr.mekni@megacare.tn | Rhumatologie | MED-TN-2024-1612 | approved |
| Bassem Zouari | dr.zouari@megacare.tn | Medecine generale | MED-TN-2024-1734 | approved |

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

## 🧪 Lab / Radiology (9)

Two separate seeding methods are used, resulting in two different passwords:

### Seeded via `seed.js` — password: `Labo@2024`

| Name | Email | Company | Lab ID | Governorate |
| --- | --- | --- | --- | --- |
| Yassine Bouzid | labo.elamal@megacare.tn | Laboratoire El Amal | LAB-TN-2024-0031 | Ariana |
| Rym Ferchichi | labo.pasteur@megacare.tn | Centre Radio-Diagnostic Pasteur | LAB-TN-2024-0042 | Tunis |

### Created via `create-lab-accounts.js` — password: `Lab@2024`

| Name | Email | Company | Lab ID | Governorate |
| --- | --- | --- | --- | --- |
| Karim Mansouri | labo.central.tunis@megacare.tn | Laboratoire Central de Tunis | LAB-TN-2024-0011 | Tunis |
| Sana Belhaj | radio.avicenne@megacare.tn | Centre d'Imagerie Avicenne | LAB-TN-2024-0012 | Tunis |
| Mounir Ghribi | radio.sfax@megacare.tn | Centre Radio-Diagnostic Sfax | LAB-TN-2024-0014 | Sfax |
| Leila Ben Romdhane | irm.monastir@megacare.tn | Centre IRM Monastir | LAB-TN-2024-0016 | Monastir |
| Tarek Saidi | labo.biosante.nabeul@megacare.tn | Laboratoire Bio-Sante Nabeul | LAB-TN-2024-0017 | Nabeul |
| Ines Jelassi | radio.benarous@megacare.tn | Centre de Radiologie Ben Arous | LAB-TN-2024-0018 | Ben Arous |
| Anis Trabelsi | labo.moderne.bizerte@megacare.tn | Laboratoire Moderne Bizerte | LAB-TN-2024-0019 | Bizerte |

---

## 🏥 Medical Services (36 — 35 establishments + 1 legacy)

> One account per establishment, linked via `establishmentId`.

**Password (all):** `Service@2024`

### Legacy account — seeded via `seed.js`

| Name | Email | Company | Service ID |
| --- | --- | --- | --- |
| Rania Cherif | had.sante@megacare.tn | HAD Sante a Domicile | SVC-TN-2024-0012 |

### Establishment accounts — created via `create-establishment-accounts.js`

| Name (Director) | Email | Establishment | Type | Governorate | Establishment ID | Service ID |
| --- | --- | --- | --- | --- | --- | --- |
| Amira Bouslama | clinique.lamarsa@megacare.tn | Clinique La Marsa | Clinique | Tunis | estab-01 | SVC-TN-2024-0101 |
| Khalil Sfar | clinique.pasteur@megacare.tn | Clinique Pasteur | Clinique | Tunis | estab-02 | SVC-TN-2024-0102 |
| Sirine Chaabane | clinique.alhayat@megacare.tn | Clinique Al Hayat | Clinique | Tunis | estab-03 | SVC-TN-2024-0103 |
| Mounir Taoufik | clinique.taoufik@megacare.tn | Clinique Taoufik | Clinique | Tunis | estab-04 | SVC-TN-2024-0104 |
| Leila Dridi | clinique.carthage@megacare.tn | Clinique Carthage | Clinique | Tunis | estab-05 | SVC-TN-2024-0105 |
| Sami Belhaj | centre.elmenzah@megacare.tn | Centre Medical El Menzah | Centre médical | Tunis | estab-06 | SVC-TN-2024-0106 |
| Ines Karray | polyclinique.jasmins@megacare.tn | Polyclinique Les Jasmins | Clinique | Ariana | estab-07 | SVC-TN-2024-0107 |
| Wafa Hammami | clinique.ennasr@megacare.tn | Clinique Ennasr | Clinique | Ariana | estab-08 | SVC-TN-2024-0108 |
| Hichem Zouari | polyclinique.lasoukra@megacare.tn | Polyclinique La Soukra | Clinique | Ariana | estab-09 | SVC-TN-2024-0109 |
| Randa Slim | clinique.megrine@megacare.tn | Clinique Megrine | Clinique | Ben Arous | estab-10 | SVC-TN-2024-0110 |
| Mehdi Oueslati | clinique.elamen.nabeul@megacare.tn | Clinique El Amen Nabeul | Clinique | Nabeul | estab-11 | SVC-TN-2024-0111 |
| Asma Abidi | clinique.ibnrochd@megacare.tn | Clinique Ibn Rochd Hammamet | Clinique | Nabeul | estab-12 | SVC-TN-2024-0112 |
| Tarek Trabelsi | centre.bizerte@megacare.tn | Centre Medical Bizerte | Centre médical | Bizerte | estab-13 | SVC-TN-2024-0113 |
| Nadia Ben Salem | clinique.palmiers@megacare.tn | Clinique Les Palmiers | Clinique | Sousse | estab-14 | SVC-TN-2024-0114 |
| Farid Gharbi | polyclinique.soussenord@megacare.tn | Polyclinique Sousse Nord | Clinique | Sousse | estab-15 | SVC-TN-2024-0115 |
| Samira Riahi | polyclinique.akouda@megacare.tn | Polyclinique Akouda | Clinique | Sousse | estab-16 | SVC-TN-2024-0116 |
| Lotfi Mssedi | clinique.ibnjazzar@megacare.tn | Clinique Ibn El Jazzar | Clinique | Monastir | estab-17 | SVC-TN-2024-0117 |
| Najla Saidi | clinique.ksarhellal@megacare.tn | Clinique Ksar Hellal | Clinique | Monastir | estab-18 | SVC-TN-2024-0118 |
| Bassem Mahjoub | centre.jemmal@megacare.tn | Centre Medical Jemmal | Centre médical | Monastir | estab-19 | SVC-TN-2024-0119 |
| Hatem Ben Fredj | clinique.lesoliviers@megacare.tn | Clinique Les Oliviers | Clinique | Sfax | estab-20 | SVC-TN-2024-0120 |
| Emna Toumi | clinique.elyasmine@megacare.tn | Clinique El Yasmine Sfax | Clinique | Sfax | estab-21 | SVC-TN-2024-0121 |
| Walid Gargouri | centre.ibnkhaldoun@megacare.tn | Centre Medical Ibn Khaldoun | Centre médical | Sfax | estab-22 | SVC-TN-2024-0122 |
| Sonia Jebali | clinique.elamal.kairouan@megacare.tn | Clinique El Amal Kairouan | Clinique | Kairouan | estab-23 | SVC-TN-2024-0123 |
| Rachid Ferchichi | centre.beja@megacare.tn | Centre Medical Beja | Centre médical | Beja | estab-24 | SVC-TN-2024-0124 |
| Mariam Khelifi | clinique.elhayat.gabes@megacare.tn | Clinique El Hayat Gabes | Clinique | Gabes | estab-25 | SVC-TN-2024-0125 |
| Olfa Ayari | had.tunisnord@megacare.tn | HAD Soins Tunis Nord | Hospitalisation À Domicile | Tunis | estab-26 | SVC-TN-2024-0126 |
| Zied Mellouli | had.ariana@megacare.tn | HAD Ariana Domicile Sante | Hospitalisation À Domicile | Ariana | estab-27 | SVC-TN-2024-0127 |
| Hela Msaddek | had.benarous@megacare.tn | HAD Ben Arous Confort Soin | Hospitalisation À Domicile | Ben Arous | estab-28 | SVC-TN-2024-0128 |
| Anis Turki | had.sousse@megacare.tn | HAD Sousse Aile Medicale | Hospitalisation À Domicile | Sousse | estab-29 | SVC-TN-2024-0129 |
| Dorra Mansouri | had.monastir@megacare.tn | HAD Monastir Sante Proximite | Hospitalisation À Domicile | Monastir | estab-30 | SVC-TN-2024-0130 |
| Yacine Lahmar | had.sfax@megacare.tn | HAD Sfax Soins Integres | Hospitalisation À Domicile | Sfax | estab-31 | SVC-TN-2024-0131 |
| Imen Baccouche | had.nabeul@megacare.tn | HAD Nabeul Cap Bon Sante | Hospitalisation À Domicile | Nabeul | estab-32 | SVC-TN-2024-0132 |
| Kamel Hadj Ali | had.bizerte@megacare.tn | HAD Bizerte Nord Sante | Hospitalisation À Domicile | Bizerte | estab-33 | SVC-TN-2024-0133 |
| Fatma Chouchane | had.kairouan@megacare.tn | HAD Kairouan Domicile Plus | Hospitalisation À Domicile | Kairouan | estab-34 | SVC-TN-2024-0134 |
| Majdi Riahi | had.gabes@megacare.tn | HAD Gabes Soins Domicile | Hospitalisation À Domicile | Gabes | estab-35 | SVC-TN-2024-0135 |

---

## 💅 Parapharmacies / Paramedical Service Providers (120 — 5 per governorate)

> System role: `paramedical`. These accounts cover both parapharmacy storefronts and home-care paramedical service providers in the platform.

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
| Karim Saidi | karim.saidi@gmail.com | Patient@2024 | +216 97 332 211 |

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
