const vehicleTypeSegments = [
  { th: "รถยนต์", en: "Car", value: 58, color: "#3B6D11" },
  { th: "รถบรรทุก", en: "Truck", value: 22, color: "#BA7517" },
  { th: "จักรยานยนต์", en: "Motorcycle", value: 14, color: "#185FA5" },
  { th: "รถโดยสาร", en: "Bus", value: 6, color: "#A32D2D" },
];

const incidents = [
  { time: "08:20", location: "Rama IV - Gate A", type: "Rear-end", severity: "medium", status: "Investigating" },
  { time: "09:05", location: "Sathorn North", type: "Blocked lane", severity: "high", status: "Open" },
  { time: "11:40", location: "Asoke Junction", type: "Minor crash", severity: "low", status: "Resolved" },
  { time: "14:15", location: "Ratchada Tunnel", type: "Stalled truck", severity: "medium", status: "Open" },
  { time: "17:35", location: "Phahon Yothin", type: "Side collision", severity: "high", status: "Investigating" },
];

const accidentCards = [
  { id: "INC-2401", severity: "high", location: "Sathorn North", time: "08:45", type: "Multi-vehicle collision", vehicles: "4", status: "open" },
  { id: "INC-2402", severity: "medium", location: "Rama IV - Gate A", time: "09:20", type: "Rear-end", vehicles: "2", status: "investigating" },
  { id: "INC-2403", severity: "low", location: "Asoke Junction", time: "10:05", type: "Minor crash", vehicles: "2", status: "resolved" },
  { id: "INC-2404", severity: "high", location: "Ratchada Tunnel", time: "12:30", type: "Blocked lane", vehicles: "3", status: "open" },
  { id: "INC-2405", severity: "medium", location: "Bangna Inbound", time: "15:10", type: "Side collision", vehicles: "2", status: "investigating" },
  { id: "INC-2406", severity: "low", location: "Vibhavadi Main", time: "18:05", type: "Stalled vehicle", vehicles: "1", status: "resolved" },
];

const cameraFeeds = [
  { id: "CAM-01", name: "Gate A North", location: "Rama IV - Entrance", zone: "Central", live: true },
  { id: "CAM-02", name: "Sathorn Ramp", location: "Sathorn North", zone: "Central", live: true },
  { id: "CAM-03", name: "Asoke Junction", location: "Asoke - Sukhumvit", zone: "East", live: true },
  { id: "CAM-04", name: "Ratchada Tunnel", location: "Ratchadaphisek", zone: "North", live: false },
  { id: "CAM-05", name: "Bangna Inbound", location: "Bangna-Trad", zone: "East", live: true },
  { id: "CAM-06", name: "Vibhavadi Main", location: "Vibhavadi Road", zone: "North", live: true },
  { id: "CAM-07", name: "Rama IX Exit", location: "Rama IX", zone: "Central", live: true },
  { id: "CAM-08", name: "Phahon Yothin", location: "Phahon Yothin", zone: "North", live: false },
];

const trafficRecords = [
  { time: "06:12:14", location: "Rama IV - Gate A", camera: "CAM-01", plate: "1กข-4821", model: "Toyota Yaris", type: "รถยนต์", color: "ขาว", speed: 42, direction: "Inbound" },
  { time: "06:45:39", location: "Sathorn Ramp", camera: "CAM-02", plate: "8กท-1407", model: "Honda City", type: "รถยนต์", color: "ดำ", speed: 36, direction: "Outbound" },
  { time: "07:08:22", location: "Asoke Junction", camera: "CAM-03", plate: "2ขว-7815", model: "Yamaha NMAX", type: "จักรยานยนต์", color: "น้ำเงิน", speed: 48, direction: "Inbound" },
  { time: "07:31:05", location: "Bangna Inbound", camera: "CAM-05", plate: "70-9182", model: "Isuzu N-Series", type: "รถบรรทุก", color: "ขาว", speed: 31, direction: "Inbound" },
  { time: "08:16:47", location: "Rama IV - Gate A", camera: "CAM-01", plate: "3กน-2260", model: "Toyota Fortuner", type: "รถยนต์", color: "เทา", speed: 29, direction: "Inbound" },
  { time: "08:52:18", location: "Ratchada Tunnel", camera: "CAM-04", plate: "10-5524", model: "Hino 500", type: "รถบรรทุก", color: "แดง", speed: 24, direction: "Outbound" },
  { time: "09:24:31", location: "Phahon Yothin", camera: "CAM-08", plate: "5ขล-9031", model: "Honda Civic", type: "รถยนต์", color: "ดำ", speed: 44, direction: "Inbound" },
  { time: "10:03:56", location: "Vibhavadi Main", camera: "CAM-06", plate: "กท-7781", model: "Mercedes-Benz C-Class", type: "รถยนต์", color: "เงิน", speed: 52, direction: "Outbound" },
  { time: "11:18:09", location: "Asoke Junction", camera: "CAM-03", plate: "4กม-6508", model: "Toyota Hiace", type: "รถโดยสาร", color: "ขาว", speed: 38, direction: "Inbound" },
  { time: "12:41:22", location: "Rama IX Exit", camera: "CAM-07", plate: "6ขจ-3145", model: "Mazda 2", type: "รถยนต์", color: "แดง", speed: 46, direction: "Outbound" },
  { time: "13:07:15", location: "Sathorn Ramp", camera: "CAM-02", plate: "1ขบ-7189", model: "Honda Wave", type: "จักรยานยนต์", color: "ดำ", speed: 41, direction: "Inbound" },
  { time: "14:35:42", location: "Bangna Inbound", camera: "CAM-05", plate: "72-4061", model: "Isuzu D-Max", type: "รถบรรทุก", color: "เทา", speed: 34, direction: "Inbound" },
  { time: "15:22:08", location: "Ratchada Tunnel", camera: "CAM-04", plate: "7กพ-5092", model: "Nissan Almera", type: "รถยนต์", color: "ขาว", speed: 33, direction: "Outbound" },
  { time: "16:04:27", location: "Rama IV - Gate A", camera: "CAM-01", plate: "3ขธ-8820", model: "Toyota Corolla Cross", type: "รถยนต์", color: "เทา", speed: 28, direction: "Inbound" },
  { time: "16:49:11", location: "Asoke Junction", camera: "CAM-03", plate: "11-7804", model: "Mitsubishi Fuso", type: "รถบรรทุก", color: "น้ำเงิน", speed: 22, direction: "Outbound" },
  { time: "17:12:50", location: "Sathorn Ramp", camera: "CAM-02", plate: "2กต-4426", model: "Honda City", type: "รถยนต์", color: "ขาว", speed: 27, direction: "Inbound" },
  { time: "18:36:33", location: "Phahon Yothin", camera: "CAM-08", plate: "9กศ-1358", model: "Kawasaki Ninja", type: "จักรยานยนต์", color: "เขียว", speed: 54, direction: "Outbound" },
  { time: "19:20:06", location: "Vibhavadi Main", camera: "CAM-06", plate: "30-2256", model: "Toyota Commuter", type: "รถโดยสาร", color: "ขาว", speed: 35, direction: "Inbound" },
  { time: "20:08:44", location: "Rama IX Exit", camera: "CAM-07", plate: "8ขม-7710", model: "Tesla Model 3", type: "รถยนต์", color: "ดำ", speed: 49, direction: "Outbound" },
  { time: "21:46:19", location: "Bangna Inbound", camera: "CAM-05", plate: "4กฮ-6127", model: "Ford Ranger", type: "รถยนต์", color: "น้ำเงิน", speed: 45, direction: "Inbound" },
];

