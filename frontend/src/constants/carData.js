export const THAILAND_PROVINCES = [
  "กรุงเทพมหานคร", "กระบี่", "กาญจนบุรี", "กาฬสินธุ์", "กำแพงเพชร", "ขอนแก่น", "จันทบุรี", "ฉะเชิงเทรา", "ชลบุรี", "ชัยนาท", "ชัยภูมิ", "ชุมพร", "เชียงราย", "เชียงใหม่", "ตรัง", "ตราด", "ตาก", "นครนายก", "นครปฐม", "นครพนม", "นครราชสีมา", "นครศรีธรรมราช", "นครสวรรค์", "นนทบุรี", "นราธิวาส", "น่าน", "บึงกาฬ", "บุรีรัมย์", "ปทุมธานี", "ประจวบคีรีขันธ์", "ปราจีนบุรี", "ปัตตานี", "พระนครศรีอยุธยา", "พะเยา", "พังงา", "พัทลุง", "พิจิตร", "พิษณุโลก", "เพชรบุรี", "เพชรบูรณ์", "แพร่", "ภูเก็ต", "มหาสารคาม", "มุกดาหาร", "แม่ฮ่องสอน", "ยโสธร", "ยะลา", "ร้อยเอ็ด", "ระนอง", "ระยอง", "ราชบุรี", "ลพบุรี", "ลำปาง", "ลำพูน", "เลย", "ศรีสะเกษ", "สกลนคร", "สงขลา", "สตูล", "สมุทรปราการ", "สมุทรสงคราม", "สมุทรสาคร", "สระแก้ว", "สระบุรี", "สิงห์บุรี", "สุโขทัย", "สุพรรณบุรี", "สุราษฎร์ธานี", "สุรินทร์", "หนองคาย", "หนองบัวลำภู", "อ่างทอง", "อำนาจเจริญ", "อุดรธานี", "อุตรดิตถ์", "อุทัยธานี", "อุบลราชธานี"
];

export const CAR_BRANDS = {
  "Toyota": ["Yaris", "Yaris Ativ", "Vios", "Corolla Altis", "Camry", "C-HR", "Corolla Cross", "Fortuner", "Hilux Revo", "Majesty", "Alphard", "Veloz", "Innova"],
  "Honda": ["Brio", "City", "Civic", "Accord", "HR-V", "CR-V", "BR-V", "WR-V"],
  "Nissan": ["Almera", "March", "Kicks", "Navara", "Terra", "Leaf", "Sylphy", "Teana"],
  "Mazda": ["2", "3", "CX-3", "CX-30", "CX-5", "CX-8", "BT-50"],
  "MG": ["MG3", "MG5", "ZS", "HS", "EP Plus", "MG4", "Maxus 9", "VS"],
  "BYD": ["Atto 3", "Dolphin", "Seal", "Seagull", "Sealion"],
  "BMW": ["X1", "X3", "X4", "X5", "Series 2", "Series 3", "Series 4", "Series 5", "Series 7", "iX3", "i4", "iX"],
  "Mercedes-Benz": ["A-Class", "C-Class", "E-Class", "S-Class", "GLA", "GLB", "GLC", "GLE", "EQB", "EQE", "EQS"],
  "GWM": ["Haval H6", "Haval Jolion", "ORA Good Cat", "ORA 07", "Tank 500", "Tank 300"],
  "Mitsubishi": ["Attrage", "Mirage", "Xpander", "Pajero Sport", "Triton"],
  "Suzuki": ["Swift", "Celerio", "Ciaz", "XL7", "Ertiga", "Jimny"],
  "Ford": ["Ranger", "Everest", "Mustang", "Raptor"],
  "Isuzu": ["D-Max", "MU-X"],
  "Kia": ["Carnival", "Sorento", "EV6", "EV9"],
  "Hyundai": ["Staria", "Creta", "H-1", "Ioniq 5", "Ioniq 6"],
  "Tesla": ["Model 3", "Model Y", "Model S", "Model X"],
  "Neta": ["V", "U", "GT"],
  "AION": ["Y Plus", "ES"],
  "Deepal": ["L07", "S07"],
  "Volvo": ["XC40", "XC60", "XC90", "C40", "S60", "V60", "EX30"],
  "Audi": ["A3", "A4", "A5", "Q3", "Q5", "Q7", "Q8", "e-tron"],
  "Porsche": ["Macan", "Cayenne", "Panamera", "Taycan", "911"],
  "Lexus": ["UX", "NX", "RX", "IS", "ES", "LS"]
};

export const MODEL_CAR_TYPE_MAPPING = {
  "Yaris": { type: "hatchback", engine: "fuel" }, "Yaris Ativ": { type: "sedan", engine: "fuel" }, "Vios": { type: "sedan", engine: "fuel" }, "Corolla Altis": { type: "sedan", engine: "fuel" }, "Camry": { type: "sedan", engine: "fuel" }, "C-HR": { type: "suv", engine: "hybrid" }, "Corolla Cross": { type: "suv", engine: "hybrid" }, "Fortuner": { type: "suv", engine: "fuel" }, "Hilux Revo": { type: "pick-up", engine: "fuel" }, "Majesty": { type: "van", engine: "fuel" }, "Alphard": { type: "van", engine: "hybrid" }, "Veloz": { type: "suv", engine: "fuel" }, "Innova": { type: "van", engine: "hybrid" },
  "Brio": { type: "hatchback", engine: "fuel" }, "City": { type: "sedan", engine: "fuel" }, "Civic": { type: "sedan", engine: "fuel" }, "Accord": { type: "sedan", engine: "hybrid" }, "HR-V": { type: "suv", engine: "hybrid" }, "CR-V": { type: "suv", engine: "hybrid" }, "BR-V": { type: "suv", engine: "fuel" }, "WR-V": { type: "suv", engine: "fuel" },
  "Almera": { type: "sedan", engine: "fuel" }, "March": { type: "hatchback", engine: "fuel" }, "Kicks": { type: "suv", engine: "hybrid" }, "Navara": { type: "pick-up", engine: "fuel" }, "Terra": { type: "suv", engine: "fuel" }, "Leaf": { type: "hatchback", engine: "ev" }, "Sylphy": { type: "sedan", engine: "fuel" }, "Teana": { type: "sedan", engine: "fuel" },
  "2": { type: "hatchback", engine: "fuel" }, "3": { type: "sedan", engine: "fuel" }, "CX-3": { type: "suv", engine: "fuel" }, "CX-30": { type: "suv", engine: "fuel" }, "CX-5": { type: "suv", engine: "fuel" }, "CX-8": { type: "suv", engine: "fuel" }, "BT-50": { type: "pick-up", engine: "fuel" },
  "MG3": { type: "hatchback", engine: "fuel" }, "MG5": { type: "sedan", engine: "fuel" }, "ZS": { type: "suv", engine: "fuel" }, "HS": { type: "suv", engine: "hybrid" }, "EP Plus": { type: "hatchback", engine: "ev" }, "MG4": { type: "hatchback", engine: "ev" }, "Maxus 9": { type: "van", engine: "ev" }, "VS": { type: "suv", engine: "hybrid" },
  "Atto 3": { type: "suv", engine: "ev" }, "Dolphin": { type: "hatchback", engine: "ev" }, "Seal": { type: "sedan", engine: "ev" }, "Seagull": { type: "hatchback", engine: "ev" }, "Sealion": { type: "suv", engine: "ev" },
  "X1": { type: "suv", engine: "fuel" }, "X3": { type: "suv", engine: "hybrid" }, "X4": { type: "suv", engine: "fuel" }, "X5": { type: "suv", engine: "hybrid" }, "Series 2": { type: "sedan", engine: "fuel" }, "Series 3": { type: "sedan", engine: "hybrid" }, "Series 4": { type: "sedan", engine: "fuel" }, "Series 5": { type: "sedan", engine: "hybrid" }, "Series 7": { type: "sedan", engine: "hybrid" }, "iX3": { type: "suv", engine: "ev" }, "i4": { type: "sedan", engine: "ev" }, "iX": { type: "suv", engine: "ev" },
  "A-Class": { type: "sedan", engine: "fuel" }, "C-Class": { type: "sedan", engine: "hybrid" }, "E-Class": { type: "sedan", engine: "hybrid" }, "S-Class": { type: "sedan", engine: "hybrid" }, "GLA": { type: "suv", engine: "fuel" }, "GLB": { type: "suv", engine: "fuel" }, "GLC": { type: "suv", engine: "hybrid" }, "GLE": { type: "suv", engine: "hybrid" }, "EQB": { type: "suv", engine: "ev" }, "EQE": { type: "sedan", engine: "ev" }, "EQS": { type: "sedan", engine: "ev" },
  "Haval H6": { type: "suv", engine: "hybrid" }, "Haval Jolion": { type: "suv", engine: "hybrid" }, "ORA Good Cat": { type: "hatchback", engine: "ev" }, "ORA 07": { type: "sedan", engine: "ev" }, "Tank 500": { type: "suv", engine: "hybrid" }, "Tank 300": { type: "suv", engine: "hybrid" },
  "Attrage": { type: "sedan", engine: "fuel" }, "Mirage": { type: "hatchback", engine: "fuel" }, "Xpander": { type: "suv", engine: "fuel" }, "Pajero Sport": { type: "suv", engine: "fuel" }, "Triton": { type: "pick-up", engine: "fuel" },
  "Swift": { type: "hatchback", engine: "fuel" }, "Celerio": { type: "hatchback", engine: "fuel" }, "Ciaz": { type: "sedan", engine: "fuel" }, "XL7": { type: "suv", engine: "fuel" }, "Ertiga": { type: "van", engine: "hybrid" }, "Jimny": { type: "suv", engine: "fuel" },
  "Ranger": { type: "pick-up", engine: "fuel" }, "Everest": { type: "suv", engine: "fuel" }, "Mustang": { type: "sedan", engine: "fuel" }, "Raptor": { type: "pick-up", engine: "fuel" },
  "D-Max": { type: "pick-up", engine: "fuel" }, "MU-X": { type: "suv", engine: "fuel" },
  "Carnival": { type: "van", engine: "fuel" }, "Sorento": { type: "suv", engine: "hybrid" }, "EV6": { type: "suv", engine: "ev" }, "EV9": { type: "suv", engine: "ev" },
  "Staria": { type: "van", engine: "fuel" }, "Creta": { type: "suv", engine: "fuel" }, "H-1": { type: "van", engine: "fuel" }, "Ioniq 5": { type: "suv", engine: "ev" }, "Ioniq 6": { type: "sedan", engine: "ev" },
  "Model 3": { type: "sedan", engine: "ev" }, "Model Y": { type: "suv", engine: "ev" }, "Model S": { type: "sedan", engine: "ev" }, "Model X": { type: "suv", engine: "ev" },
  "V": { type: "hatchback", engine: "ev" }, "U": { type: "suv", engine: "ev" }, "GT": { type: "sedan", engine: "ev" },
  "Y Plus": { type: "suv", engine: "ev" }, "ES": { type: "sedan", engine: "ev" },
  "L07": { type: "sedan", engine: "ev" }, "S07": { type: "suv", engine: "ev" },
  "XC40": { type: "suv", engine: "ev" }, "XC60": { type: "suv", engine: "hybrid" }, "XC90": { type: "suv", engine: "hybrid" }, "C40": { type: "suv", engine: "ev" }, "S60": { type: "sedan", engine: "hybrid" }, "V60": { type: "hatchback", engine: "hybrid" }, "EX30": { type: "suv", engine: "ev" },
  "A3": { type: "sedan", engine: "fuel" }, "A4": { type: "sedan", engine: "fuel" }, "A5": { type: "sedan", engine: "fuel" }, "Q3": { type: "suv", engine: "fuel" }, "Q5": { type: "suv", engine: "fuel" }, "Q7": { type: "suv", engine: "fuel" }, "Q8": { type: "suv", engine: "hybrid" }, "e-tron": { type: "suv", engine: "ev" },
  "Macan": { type: "suv", engine: "fuel" }, "Cayenne": { type: "suv", engine: "hybrid" }, "Panamera": { type: "sedan", engine: "hybrid" }, "Taycan": { type: "sedan", engine: "ev" }, "911": { type: "sedan", engine: "fuel" },
  "UX": { type: "suv", engine: "hybrid" }, "NX": { type: "suv", engine: "hybrid" }, "RX": { type: "suv", engine: "hybrid" }, "IS": { type: "sedan", engine: "hybrid" }, "ES": { type: "sedan", engine: "hybrid" }, "LS": { type: "sedan", engine: "hybrid" }
};

export const BASIC_COLORS = [
  "White", "Black", "Silver", "Gray", "Red", "Blue", "Brown", "Green", "Yellow", "Orange", 
  "Gold", "Bronze", "Navy", "Pink", "Purple", "Maroon", "Olive", "Teal", "Cyan", "Magenta", 
  "Lime", "Indigo", "Violet", "Beige", "Champagne", "Burgundy", "Charcoal", "Pearl", "Titanium"
];

const COLOR_HEX_MAP = {
  "bronze": "#CD7F32",
  "champagne": "#F7E7CE",
  "burgundy": "#800020",
  "charcoal": "#36454F",
  "pearl": "#EAE0C8",
  "titanium": "#878681"
};

export const getValidColor = (colorStr) => {
  if (!colorStr) return '#FFFFFF';
  const lower = colorStr.toLowerCase();
  return COLOR_HEX_MAP[lower] || colorStr;
};
