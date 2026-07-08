require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const CAR_BRANDS = {
  "Toyota": ["Yaris", "Yaris Ativ", "Vios", "Corolla Altis", "Camry", "C-HR", "Corolla Cross", "Fortuner", "Hilux Revo", "Majesty", "Alphard", "Veloz", "Innova"],
  "Honda": ["Brio", "City", "Civic", "Accord", "HR-V", "CR-V", "BR-V", "WR-V"],
  "Nissan": ["Almera", "March", "Kicks", "Navara", "Terra", "Leaf", "Sylphy", "Teana"],
  "Mazda": ["2", "3", "CX-3", "CX-30", "CX-5", "CX-8", "BT-50"],
  "MG": ["MG3", "MG5", "ZS", "HS", "EP Plus", "MG4", "Maxus 9", "VS"],
  "BYD": ["Atto 3", "Dolphin", "Seal", "Seagull", "Sealion"],
  "BMW": ["X1", "X3", "X4", "X5", "Series 2", "Series 3", "Series 4", "Series 5", "Series 7", "iX3", "i4", "iX"],
  "Mercedes-Benz": ["A-Class", "C-Class", "E-Class", "S-Class", "GLA", "GLB", "GLC", "GLE", "EQB", "EQE", "EQS"],
  "Tesla": ["Model 3", "Model Y", "Model S", "Model X"],
  "GWM": ["Haval H6", "Haval Jolion", "ORA Good Cat", "ORA 07", "Tank 500", "Tank 300"],
};

const MODEL_CAR_TYPE_MAPPING = {
  "Yaris": { type: "hatchback", engine: "fuel" }, "Yaris Ativ": { type: "sedan", engine: "fuel" }, "Vios": { type: "sedan", engine: "fuel" }, "Corolla Altis": { type: "sedan", engine: "fuel" }, "Camry": { type: "sedan", engine: "fuel" }, "C-HR": { type: "suv", engine: "hybrid" }, "Corolla Cross": { type: "suv", engine: "hybrid" }, "Fortuner": { type: "suv", engine: "fuel" }, "Hilux Revo": { type: "pick-up", engine: "fuel" }, "Majesty": { type: "van", engine: "fuel" }, "Alphard": { type: "van", engine: "hybrid" }, "Veloz": { type: "suv", engine: "fuel" }, "Innova": { type: "van", engine: "hybrid" },
  "Brio": { type: "hatchback", engine: "fuel" }, "City": { type: "sedan", engine: "fuel" }, "Civic": { type: "sedan", engine: "fuel" }, "Accord": { type: "sedan", engine: "hybrid" }, "HR-V": { type: "suv", engine: "hybrid" }, "CR-V": { type: "suv", engine: "hybrid" }, "BR-V": { type: "suv", engine: "fuel" }, "WR-V": { type: "suv", engine: "fuel" },
  "Almera": { type: "sedan", engine: "fuel" }, "March": { type: "hatchback", engine: "fuel" }, "Kicks": { type: "suv", engine: "hybrid" }, "Navara": { type: "pick-up", engine: "fuel" }, "Terra": { type: "suv", engine: "fuel" }, "Leaf": { type: "hatchback", engine: "ev" }, "Sylphy": { type: "sedan", engine: "fuel" }, "Teana": { type: "sedan", engine: "fuel" },
  "2": { type: "hatchback", engine: "fuel" }, "3": { type: "sedan", engine: "fuel" }, "CX-3": { type: "suv", engine: "fuel" }, "CX-30": { type: "suv", engine: "fuel" }, "CX-5": { type: "suv", engine: "fuel" }, "CX-8": { type: "suv", engine: "fuel" }, "BT-50": { type: "pick-up", engine: "fuel" },
  "MG3": { type: "hatchback", engine: "fuel" }, "MG5": { type: "sedan", engine: "fuel" }, "ZS": { type: "suv", engine: "fuel" }, "HS": { type: "suv", engine: "hybrid" }, "EP Plus": { type: "hatchback", engine: "ev" }, "MG4": { type: "hatchback", engine: "ev" }, "Maxus 9": { type: "van", engine: "ev" }, "VS": { type: "suv", engine: "hybrid" },
  "Atto 3": { type: "suv", engine: "ev" }, "Dolphin": { type: "hatchback", engine: "ev" }, "Seal": { type: "sedan", engine: "ev" }, "Seagull": { type: "hatchback", engine: "ev" }, "Sealion": { type: "suv", engine: "ev" },
  "X1": { type: "suv", engine: "fuel" }, "X3": { type: "suv", engine: "hybrid" }, "X4": { type: "suv", engine: "fuel" }, "X5": { type: "suv", engine: "hybrid" }, "Series 2": { type: "sedan", engine: "fuel" }, "Series 3": { type: "sedan", engine: "hybrid" }, "Series 4": { type: "sedan", engine: "fuel" }, "Series 5": { type: "sedan", engine: "hybrid" }, "Series 7": { type: "sedan", engine: "hybrid" }, "iX3": { type: "suv", engine: "ev" }, "i4": { type: "sedan", engine: "ev" }, "iX": { type: "suv", engine: "ev" },
  "A-Class": { type: "sedan", engine: "fuel" }, "C-Class": { type: "sedan", engine: "hybrid" }, "E-Class": { type: "sedan", engine: "hybrid" }, "S-Class": { type: "sedan", engine: "hybrid" }, "GLA": { type: "suv", engine: "fuel" }, "GLB": { type: "suv", engine: "fuel" }, "GLC": { type: "suv", engine: "hybrid" }, "GLE": { type: "suv", engine: "hybrid" }, "EQB": { type: "suv", engine: "ev" }, "EQE": { type: "sedan", engine: "ev" }, "EQS": { type: "sedan", engine: "ev" },
  "Model 3": { type: "sedan", engine: "ev" }, "Model Y": { type: "suv", engine: "ev" }, "Model S": { type: "sedan", engine: "ev" }, "Model X": { type: "suv", engine: "ev" },
  "Haval H6": { type: "suv", engine: "hybrid" }, "Haval Jolion": { type: "suv", engine: "hybrid" }, "ORA Good Cat": { type: "hatchback", engine: "ev" }, "ORA 07": { type: "sedan", engine: "ev" }, "Tank 500": { type: "suv", engine: "hybrid" }, "Tank 300": { type: "suv", engine: "hybrid" }
};

const PROVINCES = ["กรุงเทพมหานคร", "เชียงใหม่", "ชลบุรี", "ภูเก็ต", "ขอนแก่น", "นครราชสีมา", "ระยอง"];
const COLORS = ["White", "Black", "Silver", "Gray", "Red", "Blue"];

function getRandomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateRandomReg() {
  const chars = 'กขฃคฅฆงจฉชซฌญฎฏฐฑฒณดตถทธนบปผฝพฟภมยรลวศษสหฬอฮ';
  const c1 = chars[Math.floor(Math.random() * chars.length)];
  const c2 = chars[Math.floor(Math.random() * chars.length)];
  const num = Math.floor(1000 + Math.random() * 9000);
  return `${c1}${c2} ${num}`;
}

async function main() {
  console.log('Start seeding 100 random cars...');
  
  const allBrands = Object.keys(CAR_BRANDS);
  
  for (let i = 0; i < 100; i++) {
    const brand = getRandomItem(allBrands);
    const model = getRandomItem(CAR_BRANDS[brand]);
    const mapping = MODEL_CAR_TYPE_MAPPING[model] || { type: 'sedan', engine: 'fuel' };
    
    let basePrice = 800;
    if (mapping.type === 'suv') basePrice += 500;
    if (mapping.type === 'van') basePrice += 1000;
    if (mapping.engine === 'ev') basePrice += 400;
    if (brand === 'BMW' || brand === 'Mercedes-Benz' || brand === 'Tesla') basePrice += 1500;
    
    const pricePerDay = basePrice + Math.floor(Math.random() * 5) * 100;
    const year = 2018 + Math.floor(Math.random() * 7); // 2018 to 2024
    
    const isCompanyOwned = Math.random() > 0.3; // 70% company owned
    
    const encodedBrand = encodeURIComponent(brand);
    const encodedModel = encodeURIComponent(model);
    const imageUrl = `https://placehold.co/800x600/e2e8f0/0048b3?text=${encodedBrand}+${encodedModel}`;

    const carData = {
      registrationNumber: generateRandomReg(),
      province: getRandomItem(PROVINCES),
      brand,
      model,
      color: getRandomItem(COLORS),
      carType: mapping.type,
      engineType: mapping.engine,
      transmission: mapping.engine === 'ev' ? 'automatic' : getRandomItem(['automatic', 'automatic', 'manual']),
      year,
      seat: mapping.type === 'van' ? 7 : (mapping.type === 'pick-up' ? 2 : 5),
      pricePerDay,
      isCompanyOwned,
      imageUrls: [imageUrl],
    };

    try {
      await prisma.car.upsert({
        where: { registrationNumber: carData.registrationNumber },
        update: carData,
        create: carData,
      });
      console.log(`[${i+1}/100] Upserted: ${carData.brand} ${carData.model} (${carData.registrationNumber})`);
    } catch (e) {
      console.error(`Failed: ${carData.registrationNumber}`, e.message);
    }
  }
  console.log('Seeding finished.');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
