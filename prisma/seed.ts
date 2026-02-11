import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // === CATEGORIES ===
  const tapis = await prisma.category.create({
    data: {
      name: 'Tapis Berberes',
      slug: 'tapis-berberes',
      description: 'Tapis traditionnels tisses a la main par les femmes berberes du Haut Atlas et du Moyen Atlas.',
      position: 1,
      metaTitle: 'Tapis Berberes Authentiques | Artisanat Premium',
      metaDescription: 'Decouvrez notre collection de tapis berberes tisses a la main. Motifs traditionnels, laine naturelle.',
    },
  });

  const poterie = await prisma.category.create({
    data: {
      name: 'Poterie & Ceramique',
      slug: 'poterie-ceramique',
      description: 'Poterie artisanale de Fes, Safi et Meknes. Zellige, tajines, vases et assiettes decoratives.',
      position: 2,
      metaTitle: 'Poterie Marocaine Artisanale | Artisanat Premium',
      metaDescription: 'Poterie et ceramique marocaine faite main. Tajines, vases, zellige de Fes et Safi.',
    },
  });

  const bijoux = await prisma.category.create({
    data: {
      name: 'Bijoux & Argent',
      slug: 'bijoux-argent',
      description: 'Bijoux en argent et pierres semi-precieuses, fabriques par les maitres artisans de Tiznit et Essaouira.',
      position: 3,
      metaTitle: 'Bijoux Marocains en Argent | Artisanat Premium',
      metaDescription: 'Bijoux berberes en argent massif. Bracelets, colliers, boucles d\'oreilles de Tiznit.',
    },
  });

  const maroquinerie = await prisma.category.create({
    data: {
      name: 'Maroquinerie',
      slug: 'maroquinerie',
      description: 'Sacs, babouches et articles en cuir tannes traditionnellement dans les tanneries de Fes et Marrakech.',
      position: 4,
      metaTitle: 'Maroquinerie Marocaine | Artisanat Premium',
      metaDescription: 'Articles en cuir marocain : sacs, babouches, portefeuilles. Cuir tanne naturellement.',
    },
  });

  const bois = await prisma.category.create({
    data: {
      name: 'Bois & Thuya',
      slug: 'bois-thuya',
      description: 'Objets en bois de thuya et cedre sculptes a la main. Boites, plateaux et objets decoratifs d\'Essaouira.',
      position: 5,
      metaTitle: 'Bois de Thuya Essaouira | Artisanat Premium',
      metaDescription: 'Objets en bois de thuya d\'Essaouira. Boites, plateaux, sculptures faites main.',
    },
  });

  const textile = await prisma.category.create({
    data: {
      name: 'Textile & Broderie',
      slug: 'textile-broderie',
      description: 'Coussins, couvertures, caftans et textiles brodes a la main selon les traditions de Fes et Rabat.',
      position: 6,
      metaTitle: 'Textiles Marocains | Artisanat Premium',
      metaDescription: 'Textiles et broderies marocaines. Coussins, caftans, couvertures handira.',
    },
  });

  console.log('Categories created.');

  // === PRODUCTS ===
  const products = [
    // Tapis
    {
      name: 'Tapis Beni Ourain Blanc et Noir',
      slug: 'tapis-beni-ourain-blanc-noir',
      description: 'Magnifique tapis Beni Ourain tisse a la main par les femmes de la tribu Beni Ourain dans le Moyen Atlas. Laine vierge 100% naturelle, motifs geometriques noirs sur fond ivoire. Chaque piece est unique et raconte une histoire ancestrale. Dimensions approximatives : 250x150cm. Ideal pour un salon ou une chambre, ce tapis apporte chaleur et authenticite a votre interieur.',
      shortDescription: 'Tapis berbere en laine vierge, motifs geometriques traditionnels',
      priceMad: 4500,
      priceEur: 420,
      compareAtPriceMad: 5500,
      compareAtPriceEur: 510,
      sku: 'TAP-BOU-001',
      stock: 8,
      isFeatured: true,
      artisan: 'Cooperative Femmes du Moyen Atlas',
      origin: 'Azrou, Moyen Atlas',
      materials: 'Laine vierge 100%',
      dimensions: '250 x 150 cm',
      weight: 12.5,
      categoryId: tapis.id,
      image: 'https://images.unsplash.com/photo-1600166898405-da9535204843?w=800',
    },
    {
      name: 'Tapis Azilal Multicolore',
      slug: 'tapis-azilal-multicolore',
      description: 'Tapis Azilal aux couleurs vives et motifs abstraits, tisse par les artisanes de la region d\'Azilal dans le Haut Atlas. Laine naturelle teintee avec des pigments vegetaux. Ce tapis contemporain allie tradition berbere et esthetique moderne. Parfait comme piece maitresse dans un salon.',
      shortDescription: 'Tapis berbere colore aux motifs abstraits modernes',
      priceMad: 3800,
      priceEur: 350,
      sku: 'TAP-AZI-002',
      stock: 5,
      isFeatured: true,
      artisan: 'Atelier Azilal Traditions',
      origin: 'Azilal, Haut Atlas',
      materials: 'Laine teintee vegetale',
      dimensions: '200 x 130 cm',
      weight: 9.0,
      categoryId: tapis.id,
      image: 'https://images.unsplash.com/photo-1581783898377-1c85bf937427?w=800',
    },
    {
      name: 'Kilim Taznakht Rouge',
      slug: 'kilim-taznakht-rouge',
      description: 'Kilim plat traditionnel de Taznakht, tisse avec des motifs geometriques rouges et oranges. Ideal comme tapis de couloir ou decoration murale. Technique de tissage a plat transmise de generation en generation.',
      shortDescription: 'Kilim plat aux motifs geometriques rouges',
      priceMad: 2200,
      priceEur: 200,
      sku: 'TAP-KIL-003',
      stock: 12,
      artisan: 'Maitre Tisserand Ahmed',
      origin: 'Taznakht, Ouarzazate',
      materials: 'Laine et coton',
      dimensions: '300 x 80 cm',
      weight: 4.5,
      categoryId: tapis.id,
      image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800',
    },

    // Poterie
    {
      name: 'Tajine en Ceramique de Fes',
      slug: 'tajine-ceramique-fes',
      description: 'Tajine decoratif et fonctionnel en ceramique de Fes, orne de motifs bleus et blancs traditionnels inspires du zellige. Fabrique et peint a la main dans les ateliers de la medina de Fes. Passe au four, ideal pour cuisiner des plats traditionnels marocains. Livré avec son brasero en terre cuite.',
      shortDescription: 'Tajine peint a la main, motifs bleus traditionnels de Fes',
      priceMad: 650,
      priceEur: 60,
      sku: 'POT-TAJ-001',
      stock: 25,
      isFeatured: true,
      artisan: 'Maitre Potier Hassan El Fassi',
      origin: 'Fes',
      materials: 'Ceramique emaillee',
      dimensions: '30 cm diametre, 25 cm hauteur',
      weight: 3.2,
      categoryId: poterie.id,
      image: 'https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?w=800',
    },
    {
      name: 'Vase Zellige Bleu de Fes',
      slug: 'vase-zellige-bleu-fes',
      description: 'Superbe vase en ceramique decore de mosaiques zellige bleu cobalt. Piece unique realisee par un maitre zelligeur de Fes. Chaque carreau de zellige est taille et pose individuellement selon la technique seculaire.',
      shortDescription: 'Vase decore de zellige bleu cobalt fait main',
      priceMad: 1200,
      priceEur: 110,
      sku: 'POT-VAS-002',
      stock: 10,
      isFeatured: true,
      artisan: 'Atelier Zellige El Bali',
      origin: 'Fes',
      materials: 'Ceramique, zellige',
      dimensions: '40 cm hauteur, 20 cm diametre',
      weight: 4.8,
      categoryId: poterie.id,
      image: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800',
    },
    {
      name: 'Set de 6 Assiettes Safi',
      slug: 'set-assiettes-safi',
      description: 'Ensemble de 6 assiettes en ceramique de Safi, chacune peinte a la main avec des motifs floraux et geometriques uniques. Couleurs vives et emaillage traditionnel. Passent au lave-vaisselle.',
      shortDescription: 'Lot de 6 assiettes peintes main, motifs varies',
      priceMad: 480,
      priceEur: 45,
      sku: 'POT-ASS-003',
      stock: 20,
      artisan: 'Cooperative Potiers de Safi',
      origin: 'Safi',
      materials: 'Ceramique emaillee',
      dimensions: '26 cm diametre chaque',
      weight: 5.4,
      categoryId: poterie.id,
      image: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=800',
    },

    // Bijoux
    {
      name: 'Bracelet Berbere Argent Massif',
      slug: 'bracelet-berbere-argent-massif',
      description: 'Bracelet manchette en argent massif 925, grave de motifs berberes traditionnels par un maitre bijoutier de Tiznit. Les symboles representent la fertilite, la protection et la nature. Piece unique, poids environ 85g d\'argent.',
      shortDescription: 'Manchette argent 925 gravee de motifs berberes',
      priceMad: 1800,
      priceEur: 165,
      compareAtPriceMad: 2200,
      compareAtPriceEur: 200,
      sku: 'BIJ-BRA-001',
      stock: 15,
      isFeatured: true,
      artisan: 'Maitre Orfèvre Moha',
      origin: 'Tiznit',
      materials: 'Argent massif 925',
      dimensions: '6 cm diametre, 4 cm largeur',
      weight: 0.085,
      categoryId: bijoux.id,
      image: 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800',
    },
    {
      name: 'Collier Fibule Amazigh',
      slug: 'collier-fibule-amazigh',
      description: 'Collier orne d\'une fibule (tizerzai) amazighe en argent, agrémentee de corail rouge et d\'email colore. La fibule servait traditionnellement a attacher les vetements et symbolise le lien entre le ciel et la terre.',
      shortDescription: 'Collier avec fibule amazighe en argent et corail',
      priceMad: 2400,
      priceEur: 220,
      sku: 'BIJ-COL-002',
      stock: 7,
      artisan: 'Atelier Bijoux Amazigh',
      origin: 'Essaouira',
      materials: 'Argent, corail rouge, email',
      dimensions: '45 cm chaine, 8 cm pendentif',
      weight: 0.065,
      categoryId: bijoux.id,
      image: 'https://images.unsplash.com/photo-1515562141589-67f0d87094a8?w=800',
    },

    // Maroquinerie
    {
      name: 'Sac en Cuir Tanne Marrakech',
      slug: 'sac-cuir-tanne-marrakech',
      description: 'Sac a main en cuir de chevre tanne naturellement dans les tanneries traditionnelles de Marrakech. Teinture vegetale, sans produits chimiques. Design classique avec fermeture a rabat et bandouliere ajustable. L\'odeur du cuir naturel s\'attenuera avec le temps.',
      shortDescription: 'Sac a main cuir naturel tanne traditionnellement',
      priceMad: 850,
      priceEur: 78,
      sku: 'MAR-SAC-001',
      stock: 18,
      isFeatured: true,
      artisan: 'Tannerie Chouara',
      origin: 'Marrakech',
      materials: 'Cuir de chevre tanne vegetale',
      dimensions: '35 x 25 x 12 cm',
      weight: 0.65,
      categoryId: maroquinerie.id,
      image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800',
    },
    {
      name: 'Babouches Cuir Jaune Safran',
      slug: 'babouches-cuir-jaune-safran',
      description: 'Paire de babouches traditionnelles en cuir souple, teintees jaune safran. Semelle en cuir resistant. Confortables et elegantes, elles sont l\'accessoire incontournable du vestiaire marocain.',
      shortDescription: 'Babouches en cuir souple teinte jaune safran',
      priceMad: 280,
      priceEur: 26,
      sku: 'MAR-BAB-002',
      stock: 30,
      artisan: 'Atelier Babouches Fes',
      origin: 'Fes',
      materials: 'Cuir de chevre',
      dimensions: 'Tailles 38-45',
      weight: 0.35,
      categoryId: maroquinerie.id,
      image: 'https://images.unsplash.com/photo-1608731267464-c0c889c02894?w=800',
    },

    // Bois
    {
      name: 'Boite a Bijoux Thuya Essaouira',
      slug: 'boite-bijoux-thuya-essaouira',
      description: 'Boite a bijoux en bois de thuya d\'Essaouira, sculptee et polie a la main. Le bois de thuya degage un parfum agreable et naturel. Interieur tapisse de velours bordeaux. Fermoir en laiton.',
      shortDescription: 'Boite sculptee en thuya avec interieur velours',
      priceMad: 450,
      priceEur: 42,
      sku: 'BOI-BTE-001',
      stock: 22,
      isFeatured: true,
      artisan: 'Cooperative Bois Essaouira',
      origin: 'Essaouira',
      materials: 'Bois de thuya, velours, laiton',
      dimensions: '20 x 15 x 10 cm',
      weight: 0.8,
      categoryId: bois.id,
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800',
    },
    {
      name: 'Plateau Cedre Sculpte',
      slug: 'plateau-cedre-sculpte',
      description: 'Grand plateau rond en bois de cedre sculpte avec des motifs arabesques. Parfait pour servir le the a la menthe ou comme piece decorative. Le cedre est reconnu pour sa durabilite et son parfum unique.',
      shortDescription: 'Plateau rond en cedre avec arabesques sculptees',
      priceMad: 680,
      priceEur: 62,
      sku: 'BOI-PLA-002',
      stock: 14,
      artisan: 'Maitre Menuisier Youssef',
      origin: 'Essaouira',
      materials: 'Bois de cedre',
      dimensions: '45 cm diametre',
      weight: 1.5,
      categoryId: bois.id,
      image: 'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=800',
    },

    // Textile
    {
      name: 'Coussin Kilim Vintage',
      slug: 'coussin-kilim-vintage',
      description: 'Coussin recouvert d\'un tissu kilim vintage recycle, chaque piece est unique avec ses propres couleurs et motifs. Rembourrage inclus. Apporte une touche boheme et authentique a votre decoration.',
      shortDescription: 'Coussin en kilim recycle, piece unique',
      priceMad: 320,
      priceEur: 30,
      sku: 'TEX-COU-001',
      stock: 35,
      artisan: 'Atelier Recycle Marrakech',
      origin: 'Marrakech',
      materials: 'Kilim laine recycle, rembourrage polyester',
      dimensions: '50 x 50 cm',
      weight: 0.8,
      categoryId: textile.id,
      image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800',
    },
    {
      name: 'Couverture Handira Paillettes',
      slug: 'couverture-handira-paillettes',
      description: 'Couverture de mariage berbere (handira) ornee de paillettes argentees. Traditionnellement offerte a la mariee, elle symbolise la prosperite. Peut servir de couvre-lit, jet de canape ou decoration murale.',
      shortDescription: 'Couverture de mariage berbere avec paillettes',
      priceMad: 2800,
      priceEur: 260,
      sku: 'TEX-HAN-002',
      stock: 6,
      isFeatured: true,
      artisan: 'Cooperative Tissage Atlas',
      origin: 'Haut Atlas',
      materials: 'Laine, coton, paillettes',
      dimensions: '220 x 130 cm',
      weight: 3.5,
      categoryId: textile.id,
      image: 'https://images.unsplash.com/photo-1616627561839-074385245ff6?w=800',
    },
  ];

  for (const product of products) {
    const { image, ...productData } = product;
    const created = await prisma.product.create({
      data: {
        ...productData,
        publishedAt: new Date(),
        images: {
          create: {
            url: image,
            alt: productData.name,
            position: 0,
            isPrimary: true,
            width: 800,
            height: 600,
          },
        },
      },
    });
    console.log(`  Product: ${created.name}`);
  }

  console.log(`\nSeeded ${products.length} products in 6 categories.`);
  console.log('Done!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
