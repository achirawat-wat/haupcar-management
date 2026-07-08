import React, { useState, useEffect } from 'react';
import { App as AntdApp } from 'antd';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import CarList from '../CarList';
import CarFormModal from '../CarFormModal';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import Papa from 'papaparse';
import { SarabunFont } from '../assets/SarabunFont';
import { logoBase64 } from '../assets/logoBase64';

const API_URL = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/cars` : 'http://localhost:3000/api/cars';

const CarManagement = () => {
  const { message } = AntdApp.useApp();
  const location = useLocation();
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingCar, setEditingCar] = useState(null);
  const [searchText, setSearchText] = useState(location.state?.searchText || "");
  const [sortType, setSortType] = useState("newest");

  useEffect(() => {
    if (location.state?.searchText) {
      setSearchText(location.state.searchText);
    }
  }, [location.state?.searchText]);

  const fetchCars = async () => {
    setLoading(true);
    try {
      const response = await axios.get(API_URL);
      setCars(response.data);
    } catch (error) {
      console.error(error);
      message.error("Failed to fetch cars");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCars();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAdd = () => {
    setEditingCar(null);
    setModalVisible(true);
  };

  const handleEdit = (car) => {
    setEditingCar(car);
    setModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      message.success("Car deleted successfully");
      fetchCars();
    } catch (error) {
      console.error(error);
      message.error("Failed to delete car");
    }
  };

  const handleSave = async (values) => {
    try {
      if (editingCar) {
        await axios.put(`${API_URL}/${editingCar.id}`, values);
        message.success("Car updated successfully");
      } else {
        await axios.post(API_URL, values);
        message.success("Car added successfully");
      }
      setModalVisible(false);
      fetchCars();
    } catch (error) {
      message.error(error.response?.data?.error || "Failed to save car");
    }
  };

  const filteredCars = cars.filter(car => {
    if (!searchText) return true;
    const lowerSearch = searchText.toLowerCase();
    const ownerName = car.owner ? car.owner.name.toLowerCase() : "";
    return (
      (car.brand && car.brand.toLowerCase().includes(lowerSearch)) ||
      (car.model && car.model.toLowerCase().includes(lowerSearch)) ||
      (car.registrationNumber && car.registrationNumber.toLowerCase().includes(lowerSearch)) ||
      (car.province && car.province.toLowerCase().includes(lowerSearch)) ||
      (car.year && car.year.toString().includes(lowerSearch)) ||
      (ownerName.includes(lowerSearch)) ||
      (car.carType && car.carType.toLowerCase().includes(lowerSearch)) ||
      (car.engineType && car.engineType.toLowerCase().includes(lowerSearch))
    );
  }).sort((a, b) => {
    if (sortType === 'price-high') {
      return b.pricePerDay - a.pricePerDay;
    } else if (sortType === 'price-low') {
      return a.pricePerDay - b.pricePerDay;
    }
    // Default: newest first (assuming array is already sorted by newest from backend, but fallback to ID or date string)
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  const exportToCSV = () => {
    const csvData = filteredCars.map(car => ({
      'Registration': car.registrationNumber,
      'Brand': car.brand,
      'Model': car.model,
      'Type': car.carType,
      'Engine': car.engineType,
      'Province': car.province,
      'Price/Day': car.pricePerDay,
      'Owner': car.owner ? car.owner.name : 'Haupcar',
    }));
    const csv = Papa.unparse(csvData);
    // Add BOM for Excel UTF-8 support
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', `haupcar_fleet_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    message.success("CSV Exported!");
  };

  const exportToPDF = () => {
    const doc = new jsPDF('portrait');

    // Add Thai Font
    doc.addFileToVFS("Sarabun.ttf", SarabunFont);
    doc.addFont("Sarabun.ttf", "Sarabun", "normal");
    doc.setFont("Sarabun");

    // Add Logo
    doc.addImage('data:image/png;base64,' + logoBase64, 'PNG', 14, 15, 20, 20);

    // Add Company Header
    doc.setFontSize(18);
    doc.setTextColor(0, 72, 179);
    doc.text("HAUPCAR COMPANY LIMITED", 38, 22);

    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text("128/21, 3rd Floor, Phaya Thai Plaza, Ratchathewi, Bangkok 10400", 38, 28);
    doc.text("Tel: +662-113-1155 | Email: info@haupcar.com", 38, 33);

    // Add Report Title
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text("Vehicle Fleet Report", 14, 45);

    // Prepare Table (Removed Province to fit Portrait mode better)
    const tableColumn = ["Reg No.", "Brand", "Model", "Type", "Engine", "Price(THB)", "Owner"];
    const tableRows = [];

    filteredCars.forEach(car => {
      const carData = [
        car.registrationNumber || '-',
        car.brand || '-',
        car.model || '-',
        car.carType || '-',
        car.engineType || '-',
        car.pricePerDay ? car.pricePerDay.toString() : '0',
        car.owner ? car.owner.name : 'Haupcar'
      ];
      tableRows.push(carData);
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 50,
      styles: { font: 'Sarabun', fontSize: 9, cellPadding: 3 },
      headStyles: { fillColor: [0, 72, 179], textColor: 255 },
    });

    doc.save(`haupcar_fleet_${new Date().toISOString().split('T')[0]}.pdf`);
    message.success("PDF Exported Successfully!");
  };

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-lg gap-md">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-background font-semibold">Car Management</h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1">Manage all rental vehicles</p>
        </div>
        <div className="flex flex-wrap items-center gap-sm w-full md:w-auto">
          {/* Search Filter */}
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">search</span>
            <input
              className="pl-10 pr-4 py-2 border border-outline-variant rounded-[12px] bg-surface-lowest text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors font-body-md text-body-md w-full md:w-64"
              placeholder="Search brand, model..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              type="text"
            />
          </div>

          <select
            className="border border-outline-variant rounded-[12px] px-3 py-2 bg-surface-lowest text-on-surface focus:ring-2 focus:ring-primary/20 focus:border-primary font-body-md text-body-md outline-none"
            value={sortType}
            onChange={(e) => setSortType(e.target.value)}
          >
            <option value="newest">Sort by: Newest</option>
            <option value="price-high">Price: High to Low</option>
            <option value="price-low">Price: Low to High</option>
          </select>

          {/* Export Actions */}
          <div className="flex items-center gap-sm">
            <button
              onClick={exportToCSV}
              className="bg-surface-variant text-on-surface border border-outline-variant rounded-[12px] px-3 py-2 font-label-md text-label-md hover:bg-surface-container transition-colors flex items-center gap-sm shrink-0"
            >
              <span className="material-symbols-outlined text-[18px]">download</span>
              CSV
            </button>
            <button
              onClick={exportToPDF}
              className="bg-surface-variant text-on-surface border border-outline-variant rounded-[12px] px-3 py-2 font-label-md text-label-md hover:bg-surface-container transition-colors flex items-center gap-sm shrink-0"
            >
              <span className="material-symbols-outlined text-[18px]">picture_as_pdf</span>
              PDF
            </button>
          </div>

          {/* Primary Action */}
          <button
            onClick={handleAdd}
            className="bg-primary-container text-on-primary border-none rounded-[12px] px-4 py-2 font-label-md text-label-md hover:opacity-90 transition-opacity flex items-center gap-sm ml-auto md:ml-0"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            Add Car
          </button>
        </div>
      </div>

      <div className="bg-surface-container-lowest rounded-[12px] border border-outline-variant shadow-level-1 p-4 overflow-hidden flex flex-col">
        <CarList
          cars={filteredCars}
          loading={loading}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      <CarFormModal
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onSave={handleSave}
        editingCar={editingCar}
        cars={cars}
      />
    </>
  );
};

export default CarManagement;
