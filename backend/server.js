require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const app = express();

app.use(cors());
app.use(express.json());

// --- OWNERS API ---
// GET: Fetch all owners
app.get('/api/owners', async (req, res) => {
  try {
    const owners = await prisma.owner.findMany({
      orderBy: { name: 'asc' },
    });
    res.json(owners);
  } catch (error) {
    console.error("Error fetching owners:", error);
    res.status(500).json({ error: "Failed to fetch owners" });
  }
});

// POST: Create a new owner
app.post('/api/owners', async (req, res) => {
  const { name, phone, email } = req.body;
  try {
    const owner = await prisma.owner.create({
      data: { name, phone, email },
    });
    res.status(201).json(owner);
  } catch (error) {
    console.error("Error creating owner:", error);
    res.status(500).json({ error: "Failed to create owner" });
  }
});

// --- CARS API ---
// 1. GET: Fetch all cars
app.get('/api/cars', async (req, res) => {
  try {
    const cars = await prisma.car.findMany({
      include: { owner: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json(cars);
  } catch (error) {
    console.error("Error fetching cars:", error);
    res.status(500).json({ error: "Failed to fetch cars" });
  }
});

// 2. POST: Create a new car
app.post('/api/cars', async (req, res) => {
  const { registrationNumber, province, brand, model, color, notes, imageUrls, isCompanyOwned, ownerId, carType, engineType, transmission, year, seat, pricePerDay } = req.body;
  try {
    const car = await prisma.car.create({
      data: {
        registrationNumber,
        province: province || 'กรุงเทพมหานคร',
        brand,
        model,
        color: color || '#FFFFFF',
        notes,
        imageUrls: imageUrls || [],
        isCompanyOwned: isCompanyOwned !== undefined ? isCompanyOwned : true,
        ownerId: isCompanyOwned ? null : ownerId,
        carType,
        engineType: engineType || 'fuel',
        transmission,
        year,
        seat,
        pricePerDay
      },
      include: { owner: true }
    });
    res.status(201).json(car);
  } catch (error) {
    console.error("Error creating car:", error);
    if (error.code === 'P2002') {
      return res.status(400).json({ error: "Registration number already exists." });
    }
    res.status(500).json({ error: "Failed to create car" });
  }
});

// 3. PUT: Update a car
app.put('/api/cars/:id', async (req, res) => {
  const { id } = req.params;
  const { registrationNumber, province, brand, model, color, notes, imageUrls, isCompanyOwned, ownerId, carType, engineType, transmission, year, seat, pricePerDay } = req.body;
  try {
    const car = await prisma.car.update({
      where: { id },
      data: {
        registrationNumber,
        province: province || 'กรุงเทพมหานคร',
        brand,
        model,
        color: color || '#FFFFFF',
        notes,
        imageUrls: imageUrls || [],
        isCompanyOwned: isCompanyOwned !== undefined ? isCompanyOwned : true,
        ownerId: isCompanyOwned ? null : ownerId,
        carType,
        engineType: engineType || 'fuel',
        transmission,
        year,
        seat,
        pricePerDay
      },
      include: { owner: true }
    });
    res.json(car);
  } catch (error) {
    console.error("Error updating car:", error);
    if (error.code === 'P2002') {
      return res.status(400).json({ error: "Registration number already exists." });
    }
    res.status(500).json({ error: "Failed to update car" });
  }
});

// 4. DELETE: Delete a car
app.delete('/api/cars/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.car.delete({
      where: { id },
    });
    res.json({ message: "Car deleted successfully" });
  } catch (error) {
    console.error("Error deleting car:", error);
    res.status(500).json({ error: "Failed to delete car" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
