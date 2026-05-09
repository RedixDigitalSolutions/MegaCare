/**
 * reset-parapharmacy-products.js
 * Drops all existing ParamedicalProduct documents and inserts fresh ones
 * sourced from the uploads/parapharmacy folder.
 * Run with: node src/reset-parapharmacy-products.js
 */

require("dotenv").config();
const mongoose = require("mongoose");
const path = require("path");

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/megacare";

// ─── Product definitions ───────────────────────────────────────────────────────
// name is derived from the image filename; imageUrl points to the static asset.
const products = [
    {
        _id: "svr-sun-secure-blur-spf50-50ml",
        name: "SVR Sun Secure Blur SPF50+ 50ML",
        brand: "SVR",
        category: "Soins & pansements",
        price: 28.5,
        originalPrice: 32.0,
        imageUrl: "/uploads/parapharmacy/SVR SUN SECURE BLUR SPF50+ 50ML.jpg",
        description: "Écran solaire innovant à texture floue qui lisse instantanément le grain de peau tout en offrant une protection SPF50+. Sa formule légère matifie et laisse un effet « blurred skin » naturel. Idéal pour les peaux mixtes à grasses exposées au soleil.",
    },
    {
        _id: "acm-novophane-chronic-lotion-anti-chute-100ml",
        name: "ACM Novophane Chronic Lotion Anti-Chute 100ml",
        brand: "ACM",
        category: "Soins & pansements",
        price: 22.9,
        imageUrl: "/uploads/parapharmacy/acm-novophane-chronic-lotion-anti-chute-100ml.jpg",
        description: "Lotion capillaire à usage quotidien formulée pour lutter contre la chute chronique des cheveux. Enrichie en actifs fortifiants, elle stimule les racines, améliore la densité capillaire et favorise la repousse pour une chevelure plus épaisse et résistante.",
    },
    {
        _id: "alphanova-ecran-bebe-bio-lait-solaire-spf50-50gr",
        name: "Alphanova Écran Bébé Bio Lait Solaire SPF50 50gr",
        brand: "Alphanova",
        category: "Matériel bébé",
        price: 19.9,
        imageUrl: "/uploads/parapharmacy/alphanova-ecran-bebe-bio-lait-solaire-spf50-50gr.jpg",
        description: "Lait solaire biologique certifié, spécialement conçu pour la peau fragile des bébés dès la naissance. Sa formule à filtres minéraux offre une protection SPF50 sans produits chimiques agressifs. Résistant à l'eau, il hydrate et protège durablement.",
    },
    {
        _id: "baby-pur-lingettes-bebe-adoucissantes-0m-72-pieces",
        name: "Baby Pur Lingettes Bébé Adoucissantes 0m 72 Pièces",
        brand: "Baby Pur",
        category: "Matériel bébé",
        price: 7.5,
        imageUrl: "/uploads/parapharmacy/baby-pur-lingettes-bebe-adoucissantes-0m-72-pieces-.jpg",
        description: "Lingettes ultra-douces et épaisses pour le nettoyage délicat du bébé dès la naissance. Imprégnées d'une solution apaisante sans alcool ni parfum, elles respectent le pH naturel de la peau. Boîte de 72 pièces pour une hygiène quotidienne en toute sécurité.",
    },
    {
        _id: "beurer-bm28-tensiometre-brassard-chargeur",
        name: "Beurer BM28 Tensiomètre à Brassard avec Chargeur",
        brand: "Beurer",
        category: "Maintien à domicile",
        price: 95.0,
        imageUrl: "/uploads/parapharmacy/beurer-bm28-tensiometre-a-brassard-chargeur.jpg",
        description: "Tensiomètre électronique au bras avec détection de l'arythmie et mémoire pour deux utilisateurs (60 mesures chacun). Livré avec son chargeur USB, il garantit des mesures précises et conformes aux normes médicales. Idéal pour le suivi tensionnel quotidien à domicile.",
    },
    {
        _id: "bio-orient-huile-essentielle-tea-tree-10ml",
        name: "Bio Orient Huile Essentielle de Tea Tree 10ml",
        brand: "Bio Orient",
        category: "Soins & pansements",
        price: 8.9,
        imageUrl: "/uploads/parapharmacy/bio-orient-huile-essentielle-de-tea-tree-10ml.jpg",
        description: "Huile essentielle pure de Tea Tree (Melaleuca alternifolia) aux propriétés antiseptiques, antibactériennes et antifongiques reconnues. Utilisée diluée sur la peau pour traiter imperfections et petites plaies, ou en diffusion atmosphérique pour assainir l'air ambiant.",
    },
    {
        _id: "bio-orient-savon-cicatrisant-huile-argan",
        name: "Bio Orient Savon Cicatrisant à l'Huile d'Argan",
        brand: "Bio Orient",
        category: "Soins & pansements",
        price: 7.5,
        imageUrl: "/uploads/parapharmacy/bio-orient-savon-cicatrisant-a-l-huile-d-argan.jpg",
        description: "Savon naturel enrichi en huile d'argan du Maroc, réputée pour ses vertus cicatrisantes et régénérantes. Sa formule douce nettoie en profondeur tout en nourrissant la peau sèche et abîmée. Convient aux peaux sensibles et aux zones à cicatrices récentes.",
    },
    {
        _id: "biohealth-mare-mag-60-gelules",
        name: "Biohealth Mare Mag 60 Gélules",
        brand: "Biohealth",
        category: "Bien-être & rééducation",
        price: 18.5,
        imageUrl: "/uploads/parapharmacy/biohealth-mare-mag-60-gelules.jpg",
        description: "Complément alimentaire à base de magnésium marin hautement biodisponible. Contribue à réduire la fatigue, soutient le fonctionnement normal du système nerveux et musculaire. Recommandé en cure de 1 mois, à raison de 2 gélules par jour au cours des repas.",
    },
    {
        _id: "brunex-creme-depigmentante-30ml",
        name: "Brunex Crème Dépigmentante 30ml",
        brand: "Brunex",
        category: "Soins & pansements",
        price: 32.0,
        imageUrl: "/uploads/parapharmacy/brunex-creme-depigmentante30ml.jpg",
        description: "Crème dépigmentante à action progressive qui cible les taches brunes, le mélasma et les hyperpigmentations post-inflammatoires. Sa formule associe des actifs éclaircissants et un filtre solaire pour prévenir la réapparition des taches. Résultats visibles dès 4 semaines d'utilisation.",
    },
    {
        _id: "canpol-babies-liquide-nettoyage-biberons-tetines-1000ml",
        name: "Canpol Babies Liquide de Nettoyage Écologique Biberons et Tétines 1000ml",
        brand: "Canpol Babies",
        category: "Matériel bébé",
        price: 12.9,
        imageUrl: "/uploads/parapharmacy/canpol-babies-liquide-de-nettoyage-ecologique-pour-biberons-et-tetines-1000ml.jpg",
        description: "Liquide de nettoyage écologique certifié, sans parfum ni colorant agressif, spécialement formulé pour biberons, tétines et accessoires bébé. Élimine efficacement les résidus de lait et de jus tout en préservant l'environnement. Flacon économique de 1 litre.",
    },
    {
        _id: "cetaphil-creme-hydratante-100g",
        name: "Cetaphil Crème Hydratante 100g",
        brand: "Cetaphil",
        category: "Soins & pansements",
        price: 23.5,
        imageUrl: "/uploads/parapharmacy/cetaphil-creme-hydratante-100-g.jpg",
        description: "Crème hydratante non comédogène recommandée par les dermatologues pour les peaux sèches à très sèches. Sa texture riche et non grasse offre une hydratation longue durée de 48 heures. Convient aux peaux sensibles, atopiques et fragilisées, utilisable dès le nourrisson.",
    },
    {
        _id: "cetaphil-sun-liposomal-lotion-spf50-100ml",
        name: "Cetaphil Sun Liposomal Lotion SPF50 100ml",
        brand: "Cetaphil",
        category: "Soins & pansements",
        price: 31.0,
        originalPrice: 35.0,
        imageUrl: "/uploads/parapharmacy/cetaphil-sun-liposomal-lotion-spf50-100ml.jpg",
        description: "Lotion solaire à technologie liposomale qui encapsule les actifs pour une diffusion continue et une protection optimale UVA/UVB SPF50. Sa texture ultra-légère s'absorbe rapidement sans laisser de film gras. Idéale pour les peaux sensibles et réactives au soleil.",
    },
    {
        _id: "cytolnat-cytolight-ecran-mineral-teinte-anti-taches-spf50-50ml",
        name: "Cytolnat Cytolight Écran Minéral Teinté Anti-Taches SPF50 50ml",
        brand: "Cytolnat",
        category: "Soins & pansements",
        price: 27.9,
        imageUrl: "/uploads/parapharmacy/cytolnat-cytolight-ecran-mineral-teinte-anti-tahes-spf50-50ml.jpg",
        description: "Écran solaire minéral teinté formulé pour unifier le teint tout en traitant et prévenant les taches pigmentaires. Associe une protection SPF50 à des actifs dépigmentants pour un double effet soin et maquillage naturel. Convient aux peaux mixtes et grasses à tendance acnéique.",
    },
    {
        _id: "cytolnat-cytolsun-ecran-spf50-teinte-beige-sable",
        name: "Cytolnat Cytolsun Écran SPF50 Teinté Beige Sable",
        brand: "Cytolnat",
        category: "Soins & pansements",
        price: 25.5,
        imageUrl: "/uploads/parapharmacy/cytolnat-cytolsun-ecran-sppf50-teinte-beige-sable.jpg",
        description: "Écran solaire teinté beige sable à haute protection SPF50 pour un teint naturel et lumineux tout en protégeant la peau du soleil. Sa formule enrichie en actifs hydratants laisse la peau douce et confortable. Parfait pour une utilisation quotidienne en été.",
    },
    {
        _id: "cytolnat-cytolsun-oil-control-gel-creme-spf50-50ml",
        name: "Cytolnat Cytolsun Oil Control Gel-Crème SPF50 50ml",
        brand: "Cytolnat",
        category: "Soins & pansements",
        price: 25.5,
        imageUrl: "/uploads/parapharmacy/cytolnat-cytolsun-sun-protection-oil-control-gel-creme-spf-50-50ml.jpg",
        description: "Gel-crème solaire matifiant à protection SPF50 conçu pour les peaux grasses et mixtes. Sa texture légère contrôle l'excès de sébum et réduit l'effet brillance tout au long de la journée. Non comédogène et à absorption rapide, il constitue une base idéale sous le maquillage.",
    },
    {
        _id: "daylong-actinica-lotion-spf50-80gr",
        name: "Daylong Actinica Lotion SPF50 80gr",
        brand: "Daylong",
        category: "Soins & pansements",
        price: 38.0,
        originalPrice: 44.0,
        imageUrl: "/uploads/parapharmacy/daylong-actinica-lotion-spf-50-80gr.jpg",
        description: "Lotion solaire médicale à très haute protection SPF50+ recommandée pour les patients à risque de kératoses actiniques et de cancers cutanés. Sa formule liposomale à libération prolongée maintient une barrière protectrice stable même après transpiration. Testée dermatologiquement.",
    },
    {
        _id: "dermacare-photosun-fluide-matifiant-teinte-spf50-50ml",
        name: "Dermacare Photosun Fluide Matifiant Teinté Peaux Mixtes SPF50 50ml",
        brand: "Dermacare",
        category: "Soins & pansements",
        price: 26.9,
        imageUrl: "/uploads/parapharmacy/dermacare-photosun-01-fluide-matifiant-teinte-peaux-mixtes-a-grasses-spf-50-50ml.jpg",
        description: "Fluide solaire matifiant teinté haute protection SPF50, spécialement formulé pour les peaux mixtes à grasses. Réduit le brillant, unifie le teint et protège efficacement des rayons UVA et UVB. Sa texture fondante et non grasse convient à une application quotidienne sous le maquillage.",
    },
    {
        _id: "dermagor-atopicalm-creme-nourrissante-visage-40ml",
        name: "Dermagor Atopicalm Crème Nourrissante Visage 40ml",
        brand: "Dermagor",
        category: "Soins & pansements",
        price: 21.5,
        imageUrl: "/uploads/parapharmacy/dermagor-atopicalm-creme-nourrissante-visage-40ml.jpg",
        description: "Crème nourrissante visage conçue pour les peaux atopiques et à tendance eczémateuse. Restaure la barrière cutanée grâce à un complexe lipidique biomimétique, apaise les démangeaisons et soulage la sécheresse intense. Sans parfum ni colorant, testée sous contrôle dermatologique.",
    },
    {
        _id: "dermedic-hydrain3-gel-creme-ultra-hydratant-50gr",
        name: "Dermedic Hydrain 3 Gel-Crème Ultra Hydratant 50gr",
        brand: "Dermedic",
        category: "Soins & pansements",
        price: 24.0,
        imageUrl: "/uploads/parapharmacy/dermedic-hydrain-3-gel-creme-ultra-hydratant-50gr.jpg",
        description: "Gel-crème ultra-hydratant à triple action qui combine acide hyaluronique, urée et glycérine pour combler immédiatement et durablement le déficit en eau des peaux déshydratées. Sa texture aqueuse et fraîche procure une sensation de confort instantané dès la première application.",
    },
    {
        _id: "durex-preservatif-extra-safe-bt3",
        name: "Durex Préservatif Extra Safe BT3",
        brand: "Durex",
        category: "Soins & pansements",
        price: 8.5,
        imageUrl: "/uploads/parapharmacy/durex-preservatif-extra-safe-bt-3.jpg",
        description: "Préservatifs en latex naturel avec paroi plus épaisse pour une protection renforcée. Lubrifiés avec un lubrifiant à base d'eau, ils garantissent confort et fiabilité. Conformes aux normes CE et ISO, testés électroniquement un à un. Boîte de 3 préservatifs.",
    },
    {
        _id: "isdin-fusion-water-teintee-light-spf50-50ml",
        name: "ISDIN Photoprotection Fusion Water Teinté Light SPF50 50ml",
        brand: "ISDIN",
        category: "Soins & pansements",
        price: 35.0,
        originalPrice: 39.9,
        imageUrl: "/uploads/parapharmacy/isdin-photoprotection-ecran-solaire-fusion-water-teintee-light-spf50-50ml.jpg",
        description: "Écran solaire à texture eau ultra-légère avec teinte light pour un fini naturel sans effet masque. Protection très haute SPF50 contre les UVA et UVB. Sa formule hydratante et non comédogène fusionne avec la peau en quelques secondes, idéale pour un usage quotidien en milieu urbain.",
    },
    {
        _id: "la-roche-posay-toleriane-sensitive-40ml",
        name: "La Roche-Posay Toleriane Sensitive Soin Hydratant Apaisant 40ml",
        brand: "La Roche-Posay",
        category: "Soins & pansements",
        price: 33.0,
        imageUrl: "/uploads/parapharmacy/la-roche-posay-toleriane-sensitive-soin-hydratant-apaisant-40ml.jpg",
        description: "Soin hydratant apaisant pour les peaux sensibles et réactives, enrichi en Niacinamide et en eau thermale de La Roche-Posay. Renforce la barrière cutanée, soulage les sensations d'inconfort et procure une hydratation longue durée de 48 heures. Testé sur peaux allergiques et réactives.",
    },
    {
        _id: "le-petit-olivier-savon-marseille-fleur-pecher-300ml",
        name: "Le Petit Olivier Savon Liquide de Marseille Fleur de Pêcher 300ml",
        brand: "Le Petit Olivier",
        category: "Soins & pansements",
        price: 9.9,
        imageUrl: "/uploads/parapharmacy/le-petit-olivier-pur-savon-liquide-de-marseille-fleur-de-pecher-300-ml.jpg",
        description: "Savon liquide de Marseille certifié, enrichi au parfum délicat de fleur de pêcher. Fabriqué selon la tradition marseillaise avec 72 % d'huile végétale, il nettoie efficacement les mains tout en les laissant douces et parfumées. Flacon de 300 ml, sans paraben ni colorant.",
    },
    {
        _id: "le-petit-olivier-savon-marseille-lavande-300ml",
        name: "Le Petit Olivier Savon Liquide de Marseille Parfum Lavande 300ml",
        brand: "Le Petit Olivier",
        category: "Soins & pansements",
        price: 9.9,
        imageUrl: "/uploads/parapharmacy/le-petit-olivier-pur-savon-liquide-de-marseille-parfum-lavande-300ml.jpg",
        description: "Savon liquide de Marseille traditionnel au parfum de lavande de Provence. Formulé avec 72 % d'huile végétale, il respecte la peau tout en la nettoyant en profondeur. Son parfum frais et apaisant de lavande en fait un incontournable de la salle de bain. Sans SLS ni paraben.",
    },
    {
        _id: "orthofix-attelle-immobilisation-genou",
        name: "Orthofix Attelle d'Immobilisation de Genou",
        brand: "Orthofix",
        category: "Orthopédie",
        price: 58.0,
        imageUrl: "/uploads/parapharmacy/orthofix-attelle-d-immobilisation-de-genou.jpg",
        description: "Attelle rigide d'immobilisation du genou en extension, indiquée après traumatisme ligamentaire, entorse grave ou en post-opératoire. Légère et aérée, elle assure un maintien ferme tout en permettant une mobilisation partielle. Réglable en taille pour s'adapter à l'anatomie du patient.",
    },
    {
        _id: "orthomed-ceinture-lombaire-renforcee",
        name: "Orthomed Ceinture Lombaire Renforcée",
        brand: "Orthomed",
        category: "Orthopédie",
        price: 42.0,
        imageUrl: "/uploads/parapharmacy/orthomed-ceinture-lombaire-renforcee.jpg",
        description: "Ceinture lombaire avec baleines rigides amovibles pour un soutien renforcé du bas du dos. Recommandée en cas de lombalgie, lumbago ou hernie discale légère, elle soulage la douleur et améliore la posture. Sa matière respirante garantit un confort optimal lors d'un port prolongé.",
    },
    {
        _id: "orthomed-collier-cervical-souple-noir-taille1",
        name: "Orthomed Collier Cervical Souple Noir Taille 1",
        brand: "Orthomed",
        category: "Orthopédie",
        price: 22.0,
        imageUrl: "/uploads/parapharmacy/orthomed-collier-cervical-souple-noir-taille-1.jpg",
        description: "Collier cervical souple en mousse à mémoire de forme, indiqué pour les cervicalgies, torticolis et suites de traumatismes cervicaux légers. Limite les mouvements douloureux, soulage les tensions musculaires et favorise la récupération. Taille 1 (petite), fermeture velcro réglable.",
    },
    {
        _id: "orthomed-support-bras-filet",
        name: "Orthomed Support de Bras Filet",
        brand: "Orthomed",
        category: "Orthopédie",
        price: 16.5,
        imageUrl: "/uploads/parapharmacy/orthomed-support-de-bras-filet.jpg",
        description: "Écharpe de soutien en filet aéré pour immobiliser et soulager le bras après une fracture, une luxation de l'épaule ou en post-opératoire. Sa conception légère en filet respirant réduit la transpiration et améliore le confort lors d'un port journalier. Réglable et facile à mettre.",
    },
    {
        _id: "phyteal-tartrex-dentifrice-fluor-sels-mineraux-80ml",
        name: "Phyteal Tartrex Dentifrice Soin Complet Fluor et Sels Minéraux 80ml",
        brand: "Phyteal",
        category: "Soins & pansements",
        price: 8.5,
        imageUrl: "/uploads/parapharmacy/phyteal-tartrex-dentifrice-soin-complet-aux-fluor-et-sels-mineraux-80ml.jpg",
        description: "Dentifrice à soin complet enrichi en fluor et en sels minéraux naturels. Lutte efficacement contre le tartre, les caries et la plaque dentaire tout en renforçant l'émail. Sa formule apaisante réduit la sensibilité dentaire et assure une haleine fraîche durable. Tube de 80 ml.",
    },
    {
        _id: "protis-vixpro-baume-baby-40g",
        name: "Protis Vixpro Baume Baby 40g",
        brand: "Protis",
        category: "Matériel bébé",
        price: 11.0,
        imageUrl: "/uploads/parapharmacy/protis-vixpro-baume-baby-40g.jpg",
        description: "Baume protecteur et apaisant pour bébé, formulé pour prévenir et traiter les irritations du siège et les rougeurs. Enrichi en oxyde de zinc et en huile de calendula, il crée une barrière protectrice sur la peau tout en favorisant la cicatrisation. Sans paraben ni alcool.",
    },
    {
        _id: "sensifine-ar-creme-50ml",
        name: "Sensifine AR Crème 50ml",
        brand: "Sensifine",
        category: "Soins & pansements",
        price: 27.0,
        imageUrl: "/uploads/parapharmacy/sensifine-ar-creme-50ml.jpg",
        description: "Crème apaisante anti-rougeurs pour peaux sensibles à tendance couperosique. Sa formule concentrée en actifs vasoconstricteurs atténue visiblement les rougeurs diffuses et les érythèmes. Texture légère et non grasse, idéale en soin quotidien matin et soir pour unifier et calmer le teint.",
    },
    {
        _id: "svr-spirial-deo-douche-400ml",
        name: "SVR Spirial Déo Douche 400ml",
        brand: "SVR",
        category: "Soins & pansements",
        price: 15.9,
        imageUrl: "/uploads/parapharmacy/svr-spirial-deo-douche-400ml.jpg",
        description: "Gel douche déodorant à action anti-transpirant longue durée, formulé pour les peaux qui transpirent abondamment. Nettoie en douceur tout en régulant la transpiration et en neutralisant les odeurs corporelles. Sans alcool, sans paraben, convient aux peaux sensibles et réactives.",
    },
    {
        _id: "svr-sun-secure-brume-spf50-200ml",
        name: "SVR Sun Secure Brume SPF50 200ml",
        brand: "SVR",
        category: "Soins & pansements",
        price: 26.5,
        imageUrl: "/uploads/parapharmacy/svr-sun-secure-brume-spf50-200ml.jpg",
        description: "Brume solaire invisible à vaporisation facile pour une application rapide et uniforme sur le visage et le corps. Protection SPF50 à large spectre UVA/UVB avec formule résistante à l'eau et à la transpiration. Idéale pour les renouvellements d'application tout au long de la journée.",
    },
    {
        _id: "svr-sun-secure-fluide-photo-age-spf50-40ml",
        name: "SVR Sun Secure Fluide Photo-Age SPF50 40ml",
        brand: "SVR",
        category: "Soins & pansements",
        price: 24.9,
        imageUrl: "/uploads/parapharmacy/svr-sun-secure-fluide-photo-age-spf50-40ml.jpg",
        description: "Fluide solaire anti-âge SPF50 enrichi en antioxydants pour protéger la peau du vieillissement photo-induit. Combat les rides, la perte d'élasticité et les taches liées à l'exposition solaire répétée. Texture ultra-légère, non grasse, parfaite pour un usage quotidien sur le visage.",
    },
    {
        _id: "svr-sun-secure-lait-hydratant-invisible-spf50-250ml",
        name: "SVR Sun Secure Lait Hydratant Invisible SPF50 250ml",
        brand: "SVR",
        category: "Soins & pansements",
        price: 29.9,
        originalPrice: 33.0,
        imageUrl: "/uploads/parapharmacy/svr-sun-secure-lait-hydratant-invisible-spf50-250ml.jpg",
        description: "Lait solaire corps à texture légère et invisible pour une protection SPF50 sur tout le corps. Sa formule hydratante 48h laisse la peau douce et soyeuse sans effet collant. Résistant à l'eau et à la sueur, il convient à toute la famille dès 3 ans. Grand flacon de 250 ml.",
    },
    {
        _id: "uriage-bebe-1ere-senteur-eau-soin-50ml",
        name: "Uriage Bébé 1ère Senteur Eau de Soin Parfumée 50ml",
        brand: "Uriage",
        category: "Matériel bébé",
        price: 13.5,
        imageUrl: "/uploads/parapharmacy/uriage-bebe-1ere-senteur-eau-de-soin-parfumee-50ml.jpg",
        description: "Eau de soin parfumée pour bébé, enrichie en eau thermale d'Uriage apaisante et en actifs hydratants. Son parfum délicat et hypoallergénique enveloppe bébé d'une fragrance douce dès le bain. Formulée sans alcool, sans paraben, testée sous contrôle dermatologique et pédiatrique.",
    },
    {
        _id: "uriage-eau-thermale-serum-booster-ha-30ml",
        name: "Uriage Eau Thermale Sérum Booster HA 30ml",
        brand: "Uriage",
        category: "Soins & pansements",
        price: 28.0,
        imageUrl: "/uploads/parapharmacy/uriage-eau-thermale-serum-booster-ha-30ml.jpg",
        description: "Sérum booster concentré en acide hyaluronique multi-poids et en eau thermale d'Uriage pour une hydratation intense et repulpante. Comble les rides de surface, lisse le grain de peau et renforce la barrière cutanée. À utiliser seul ou en booster sous votre soin habituel, matin et soir.",
    },
];

// ─── Run ───────────────────────────────────────────────────────────────────────
async function run() {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB:", MONGO_URI);

    const db = mongoose.connection.db;
    const col = db.collection("paramedicalproducts");

    // Drop all existing products
    const { deletedCount } = await col.deleteMany({});
    console.log(`🗑  Dropped ${deletedCount} existing parapharmacy products`);

    // Build documents with defaults
    const now = new Date();
    const docs = products.map((p) => ({
        _id: p._id,
        catalogItemId: "",
        userId: "",
        name: p.name,
        brand: p.brand || "",
        category: p.category || "",
        price: p.price,
        originalPrice: p.originalPrice ?? null,
        rating: 4.5,
        reviews: 0,
        inStock: true,
        stockQty: 50,
        prescription: false,
        imageUrl: p.imageUrl,
        images: [p.imageUrl],
        shortDesc: "",
        description: p.description || "",
        usage: "",
        compatibility: "",
        features: [],
        deliveryDays: "48h",
        createdAt: now,
        updatedAt: now,
    }));

    const result = await col.insertMany(docs);
    console.log(`✅ Inserted ${result.insertedCount} parapharmacy products`);

    // Summary by category
    const summary = {};
    docs.forEach((d) => {
        summary[d.category] = (summary[d.category] || 0) + 1;
    });
    console.log("\nProducts by category:");
    Object.entries(summary).forEach(([cat, count]) => {
        console.log(`  ${cat}: ${count}`);
    });

    await mongoose.disconnect();
    console.log("\nDone.");
}

run().catch((err) => {
    console.error("❌ Error:", err.message);
    process.exit(1);
});
