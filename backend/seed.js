const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const owners = [
  { id: "owner-1", name: "Somchai Jai-dee", phone: "081-xxx-1234", email: "somchai@example.com" },
  { id: "owner-2", name: "Suda Rakdee", phone: "089-xxx-5678", email: "suda@example.com" },
  { id: "owner-3", name: "Pornchai Mankhong", phone: "095-xxx-9012", email: "pornchai@example.com" }
];

const cars = [
  {
    registrationNumber: "1กข 1234",
    province: "กรุงเทพมหานคร",
    brand: "Toyota",
    model: "Yaris Ativ",
    carType: "sedan",
    engineType: "fuel",
    transmission: "automatic",
    year: 2023,
    seat: 5,
    pricePerDay: 1200,
    isCompanyOwned: true,
    imageUrls: ["https://placehold.co/800x600/e2e8f0/0048b3?text=Toyota+Yaris"]
  },
  {
    registrationNumber: "2ขค 5678",
    province: "ชลบุรี",
    brand: "Honda",
    model: "HR-V",
    carType: "suv",
    engineType: "hybrid",
    transmission: "automatic",
    year: 2024,
    seat: 5,
    pricePerDay: 1800,
    isCompanyOwned: false,
    ownerId: "owner-1",
    imageUrls: ["https://placehold.co/800x600/e2e8f0/0048b3?text=Honda+HR-V"]
  },
  {
    registrationNumber: "3คฆ 9012",
    province: "เชียงใหม่",
    brand: "MG",
    model: "EP Plus",
    carType: "hatchback",
    engineType: "ev",
    transmission: "automatic",
    year: 2023,
    seat: 5,
    pricePerDay: 1500,
    isCompanyOwned: false,
    ownerId: "owner-2",
    imageUrls: ["https://placehold.co/800x600/e2e8f0/0048b3?text=MG+EP+Plus"]
  },
  {
    registrationNumber: "4งง 3456",
    province: "ขอนแก่น",
    brand: "Toyota",
    model: "Fortuner",
    carType: "suv",
    engineType: "fuel",
    transmission: "automatic",
    year: 2021,
    seat: 7,
    pricePerDay: 2500,
    isCompanyOwned: true,
    imageUrls: ["https://placehold.co/800x600/e2e8f0/0048b3?text=Toyota+Fortuner"]
  },
  {
    registrationNumber: "5จฉ 7890",
    province: "ภูเก็ต",
    brand: "Nissan",
    model: "Almera",
    carType: "sedan",
    engineType: "fuel",
    transmission: "automatic",
    year: 2020,
    seat: 5,
    pricePerDay: 1000,
    isCompanyOwned: false,
    ownerId: "owner-3",
    imageUrls: ["https://placehold.co/800x600/e2e8f0/0048b3?text=Nissan+Almera"]
  },
  {
    registrationNumber: "6ชซ 1122",
    province: "กรุงเทพมหานคร",
    brand: "Honda",
    model: "Civic",
    carType: "sedan",
    engineType: "hybrid",
    transmission: "automatic",
    year: 2024,
    seat: 5,
    pricePerDay: 2000,
    isCompanyOwned: true,
    imageUrls: ["https://placehold.co/800x600/e2e8f0/0048b3?text=Honda+Civic"]
  },
  {
    registrationNumber: "7ดต 3344",
    province: "กรุงเทพมหานคร",
    brand: "BMW",
    model: "iX3",
    carType: "suv",
    engineType: "ev",
    transmission: "automatic",
    year: 2023,
    seat: 5,
    pricePerDay: 4500,
    isCompanyOwned: true,
    imageUrls: ["https://placehold.co/800x600/e2e8f0/0048b3?text=BMW+iX3"]
  },
  {
    registrationNumber: "8ทธ 5566",
    province: "สงขลา",
    brand: "Mazda",
    model: "2",
    carType: "hatchback",
    engineType: "fuel",
    transmission: "automatic",
    year: 2022,
    seat: 5,
    pricePerDay: 1100,
    isCompanyOwned: true,
    imageUrls: ["https://placehold.co/800x600/e2e8f0/0048b3?text=Mazda+2"]
  },
  {
    registrationNumber: "9นบ 7788",
    province: "นครราชสีมา",
    brand: "Toyota",
    model: "Hilux Revo",
    carType: "pick-up",
    engineType: "fuel",
    transmission: "manual",
    year: 2019,
    seat: 2,
    pricePerDay: 1300,
    isCompanyOwned: true,
    imageUrls: ["https://placehold.co/800x600/e2e8f0/0048b3?text=Toyota+Hilux+Revo"]
  },
  {
    registrationNumber: "10ปผ 9900",
    province: "กรุงเทพมหานคร",
    brand: "BYD",
    model: "Atto 3",
    carType: "suv",
    engineType: "ev",
    transmission: "automatic",
    year: 2024,
    seat: 5,
    pricePerDay: 1900,
    isCompanyOwned: true,
    imageUrls: ["https://placehold.co/800x600/e2e8f0/0048b3?text=BYD+Atto+3"]
  },
  {
    registrationNumber: "11ลว 1234",
    province: "กรุงเทพมหานคร",
    brand: "BYD",
    model: "Dolphin",
    carType: "hatchback",
    engineType: "ev",
    transmission: "automatic",
    year: 2024,
    seat: 5,
    pricePerDay: 1300,
    isCompanyOwned: true,
    imageUrls: ["https://placehold.co/800x600/e2e8f0/0048b3?text=BYD+Dolphin"]
  },
  {
    registrationNumber: "12สก 5678",
    province: "เชียงใหม่",
    brand: "GWM",
    model: "ORA Good Cat",
    carType: "hatchback",
    engineType: "ev",
    transmission: "automatic",
    year: 2023,
    seat: 5,
    pricePerDay: 1500,
    isCompanyOwned: false,
    ownerId: "owner-1",
    imageUrls: ["https://placehold.co/800x600/e2e8f0/0048b3?text=ORA+Good+Cat"]
  },
  {
    registrationNumber: "13สส 9999",
    province: "กรุงเทพมหานคร",
    brand: "Mercedes-Benz",
    model: "EQE",
    carType: "sedan",
    engineType: "ev",
    transmission: "automatic",
    year: 2024,
    seat: 5,
    pricePerDay: 8000,
    isCompanyOwned: true,
    imageUrls: ["https://placehold.co/800x600/e2e8f0/0048b3?text=Mercedes+EQE"]
  },
  {
    registrationNumber: "14กค 1111",
    province: "ชลบุรี",
    brand: "Toyota",
    model: "Corolla Cross",
    carType: "suv",
    engineType: "hybrid",
    transmission: "automatic",
    year: 2023,
    seat: 5,
    pricePerDay: 1700,
    isCompanyOwned: false,
    ownerId: "owner-2",
    imageUrls: ["https://placehold.co/800x600/e2e8f0/0048b3?text=Toyota+Cross"]
  },
  {
    registrationNumber: "15ฮฮ 5555",
    province: "กรุงเทพมหานคร",
    brand: "Tesla",
    model: "Model 3", // Although not in list, it's fine for seed
    carType: "sedan",
    engineType: "ev",
    transmission: "automatic",
    year: 2024,
    seat: 5,
    pricePerDay: 3500,
    isCompanyOwned: true,
    imageUrls: ["https://placehold.co/800x600/e2e8f0/0048b3?text=Tesla+Model+3"]
  }
];

async function main() {
  console.log('Clearing old cars...');
  await prisma.car.deleteMany({});

  console.log('Start seeding owners...');
  for (const owner of owners) {
    try {
      await prisma.owner.upsert({
        where: { id: owner.id },
        update: owner,
        create: owner,
      });
      console.log(`Upserted owner: ${owner.name}`);
    } catch (e) {
      console.error(`Failed to create owner ${owner.name}:`, e);
    }
  }

  console.log('Start seeding cars...');
  for (const carData of cars) {
    try {
      const car = await prisma.car.upsert({
        where: { registrationNumber: carData.registrationNumber },
        update: carData,
        create: carData,
      });
      console.log(`Upserted car with reg: ${carData.registrationNumber}`);
    } catch (e) {
      console.error(`Failed to create car ${carData.registrationNumber}:`, e);
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
