import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import MechanicProfile from '../models/MechanicProfile.js';
import Vehicle from '../models/Vehicle.js';
import Service from '../models/Service.js';
import ServiceRequest from '../models/ServiceRequest.js';
import Review from '../models/Review.js';
import Favorite from '../models/Favorite.js';
import Notification from '../models/Notification.js';

dotenv.config();

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/fixnear';
    console.log(`[Seeder] Connecting to MongoDB: ${mongoUri}`);
    await mongoose.connect(mongoUri);

    console.log('[Seeder] Clearing old collections...');
    await Promise.all([
      User.deleteMany({}),
      MechanicProfile.deleteMany({}),
      Vehicle.deleteMany({}),
      Service.deleteMany({}),
      ServiceRequest.deleteMany({}),
      Review.deleteMany({}),
      Favorite.deleteMany({}),
      Notification.deleteMany({}),
    ]);

    console.log('[Seeder] Seeding Customer & Mechanic Accounts...');

    // 1. Customers
    const customer1 = await User.create({
      name: 'Alex Rivera',
      email: 'customer@fixnear.com',
      password: 'password123',
      role: 'CUSTOMER',
      phone: '+91 98450 23114',
      address: '104 Maple Street, Indiranagar',
      city: 'Bangalore',
      location: {
        type: 'Point',
        coordinates: [77.6405, 12.9780],
      },
    });

    const customer2 = await User.create({
      name: 'Sarah Jenkins',
      email: 'sarah@fixnear.com',
      password: 'password123',
      role: 'CUSTOMER',
      phone: '+91 97412 88301',
      address: '42 Orchid Residency, 5th Block, Koramangala',
      city: 'Bangalore',
      location: {
        type: 'Point',
        coordinates: [77.6205, 12.9340],
      },
    });

    // 2. Mechanics
    const mechUser1 = await User.create({
      name: 'Marcus Vance',
      email: 'mechanic@fixnear.com',
      password: 'password123',
      role: 'MECHANIC',
      phone: '+91 99001 44520',
      address: '42 Industrial Main Road, Near Metro Station, Indiranagar',
      city: 'Bangalore',
      location: {
        type: 'Point',
        coordinates: [77.6415, 12.9788],
      },
    });

    const mechUser2 = await User.create({
      name: 'David Chen',
      email: 'david@speedfix.com',
      password: 'password123',
      role: 'MECHANIC',
      phone: '+91 98860 11923',
      address: '128 Intermediate Ring Road, Koramangala 5th Block',
      city: 'Bangalore',
      location: {
        type: 'Point',
        coordinates: [77.6225, 12.9352],
      },
    });

    const mechUser3 = await User.create({
      name: 'Rajesh Kumar',
      email: 'rajesh@progarage.com',
      password: 'password123',
      role: 'MECHANIC',
      phone: '+91 97310 55829',
      address: '15 Outer Ring Road, Sector 1, HSR Layout',
      city: 'Bangalore',
      location: {
        type: 'Point',
        coordinates: [77.6385, 12.9121],
      },
    });

    const mechUser4 = await User.create({
      name: 'Elena Rostova',
      email: 'elena@precisionauto.com',
      password: 'password123',
      role: 'MECHANIC',
      phone: '+91 98455 33019',
      address: '88 ITPL Main Road, Near Tech Park, Whitefield',
      city: 'Bangalore',
      location: {
        type: 'Point',
        coordinates: [77.7499, 12.9698],
      },
    });

    const mechUser5 = await User.create({
      name: 'Sam Wilson',
      email: 'sam@twowheelzone.com',
      password: 'password123',
      role: 'MECHANIC',
      phone: '+91 96112 00418',
      address: '19 100ft Ring Road, 2nd Phase, JP Nagar',
      city: 'Bangalore',
      location: {
        type: 'Point',
        coordinates: [77.5855, 12.9081],
      },
    });

    console.log('[Seeder] Creating Realistic Workshop Profiles...');

    const profile1 = await MechanicProfile.create({
      user: mechUser1._id,
      businessName: 'Apex AutoCare & Diagnostics',
      description:
        'Full-service multi-brand car & SUV garage operating for 14 years. Equipped with Launch & Bosch diagnostic scanners, 4 hydraulic service bays, in-house brake lathe machine, and dedicated engine rebuild room. We provide itemized bills and show replaced parts upon customer request.',
      phone: mechUser1.phone,
      address: mechUser1.address,
      city: mechUser1.city,
      location: mechUser1.location,
      experienceYears: 14,
      emergencyService: true,
      vehicleTypesSupported: ['Car', 'SUV', 'Bike'],
      workingHours: {
        open: '08:30',
        close: '20:00',
        days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      },
      specializations: ['Computer Diagnostics', 'Brake Systems', 'Engine Repair', 'Suspension & Steering'],
      averageRating: 4.9,
      reviewCount: 38,
      isAvailable: true,
      verificationStatus: 'VERIFIED',
    });

    const profile2 = await MechanicProfile.create({
      user: mechUser2._id,
      businessName: 'SpeedFix Motors & Quick Lube',
      description:
        'Quick scheduled maintenance and express servicing garage. We specialize in 45-minute oil and filter changes, 3D laser wheel alignment, disc brake inspections, and cooling system flushes with transparent parts pricing.',
      phone: mechUser2.phone,
      address: mechUser2.address,
      city: mechUser2.city,
      location: mechUser2.location,
      experienceYears: 9,
      emergencyService: false,
      vehicleTypesSupported: ['Car', 'Bike', 'Scooter', 'SUV'],
      workingHours: {
        open: '09:00',
        close: '19:30',
        days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      },
      specializations: ['Full Synthetic Oil Change', 'Wheel Alignment', 'Brake Pads', 'AC Gas Refill'],
      averageRating: 4.8,
      reviewCount: 29,
      isAvailable: true,
      verificationStatus: 'VERIFIED',
    });

    const profile3 = await MechanicProfile.create({
      user: mechUser3._id,
      businessName: 'ProGarage 24/7 Roadside Assist',
      description:
        '24-hour breakdown and repair center. Mobile mechanic van equipped for on-site dead battery jump starts, tyre punctures, alternator tests, and towing support across South & East Bangalore.',
      phone: mechUser3.phone,
      address: mechUser3.address,
      city: mechUser3.city,
      location: mechUser3.location,
      experienceYears: 11,
      emergencyService: true,
      vehicleTypesSupported: ['Car', 'Bike', 'Scooter', 'SUV', 'Other'],
      workingHours: {
        open: '00:00',
        close: '23:59',
        days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      },
      specializations: ['24/7 Roadside Rescue', 'Battery Jump & Replacement', 'Tyre Punctures', 'Alternator Repair'],
      averageRating: 4.7,
      reviewCount: 45,
      isAvailable: true,
      verificationStatus: 'VERIFIED',
    });

    const profile4 = await MechanicProfile.create({
      user: mechUser4._id,
      businessName: 'Precision German & European Auto Tech',
      description:
        'Independent service center for German & European cars (BMW, Audi, Mercedes, Volkswagen, Skoda). We stock OEM Mann filters, Liqui Moly lubricants, and Ross-Tech VCDS / ISTA diagnostic tools for accurate fault diagnosis.',
      phone: mechUser4.phone,
      address: mechUser4.address,
      city: mechUser4.city,
      location: mechUser4.location,
      experienceYears: 16,
      emergencyService: false,
      vehicleTypesSupported: ['Car', 'SUV'],
      workingHours: {
        open: '08:30',
        close: '18:30',
        days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      },
      specializations: ['European Diagnostics', 'Dual-Clutch Gearbox', 'Turbocharger Repair', 'Suspension Overhaul'],
      averageRating: 4.95,
      reviewCount: 22,
      isAvailable: true,
      verificationStatus: 'VERIFIED',
    });

    const profile5 = await MechanicProfile.create({
      user: mechUser5._id,
      businessName: 'South Bangalore Two-Wheeler Care',
      description:
        'Dedicated motorcycle and scooter service center. Routine servicing, carburetor cleaning, chain-sprocket replacements, fork oil seals, and valve adjustments for commuter bikes and sports motorcycles.',
      phone: mechUser5.phone,
      address: mechUser5.address,
      city: mechUser5.city,
      location: mechUser5.location,
      experienceYears: 8,
      emergencyService: true,
      vehicleTypesSupported: ['Bike', 'Scooter'],
      workingHours: {
        open: '09:00',
        close: '20:00',
        days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      },
      specializations: ['Motorcycle Periodic Service', 'Chain & Sprockets', 'Carburetor & EFI', 'Front Fork Overhaul'],
      averageRating: 4.85,
      reviewCount: 31,
      isAvailable: true,
      verificationStatus: 'VERIFIED',
    });

    console.log('[Seeder] Seeding Realistic Services & Rates...');

    // Apex AutoCare Services
    const s1 = await Service.create({
      mechanic: profile1._id,
      name: 'Periodic Full Service (Car / SUV)',
      category: 'General Service',
      description:
        'Engine oil change, new OEM oil filter, air filter clean, spark plug check, coolant top-up, brake pad wear inspection, and complete 40-point safety check.',
      price: 110,
      estimatedDuration: '3-4 hours',
      vehicleTypes: ['Car', 'SUV'],
      isAvailable: true,
    });

    const s2 = await Service.create({
      mechanic: profile1._id,
      name: 'Computer Diagnostic Scan & OBD Report',
      category: 'Engine Repair',
      description:
        'OBD-II scanner diagnosis to read active and pending fault codes, live sensor data review (MAF, O2, fuel trims), and check engine light diagnosis.',
      price: 45,
      estimatedDuration: '45 mins',
      vehicleTypes: ['Car', 'SUV', 'Bike'],
      isAvailable: true,
    });

    const s3 = await Service.create({
      mechanic: profile1._id,
      name: 'Front Ceramic Brake Pad Replacement & Disc Resurfacing',
      category: 'Brake Service',
      description:
        'Removal of worn pads, disc rotor resurfacing on lathe to remove grooves, installation of ceramic pads, caliper pin lubrication, and brake fluid top-up.',
      price: 85,
      estimatedDuration: '1.5 hours',
      vehicleTypes: ['Car', 'SUV'],
      isAvailable: true,
    });

    const s4 = await Service.create({
      mechanic: profile1._id,
      name: 'AC Gas Vacuum & R134a Refill',
      category: 'AC Service',
      description:
        'Refrigerant pressure check, vacuum leak test, compressor oil top-up, R134a refrigerant recharge, and cabin duct anti-bacterial foam cleaning.',
      price: 65,
      estimatedDuration: '1.5 hours',
      vehicleTypes: ['Car', 'SUV'],
      isAvailable: true,
    });

    // SpeedFix Services
    await Service.create({
      mechanic: profile2._id,
      name: 'Express Full Synthetic Oil & Filter Service',
      category: 'Oil Change',
      description:
        '5W-30 or 5W-40 full synthetic motor oil (up to 4L), genuine OEM oil filter, windscreen washer fluid top-up, and tyre pressure calibration.',
      price: 45,
      estimatedDuration: '45 mins',
      vehicleTypes: ['Car', 'Bike', 'Scooter', 'SUV'],
      isAvailable: true,
    });

    await Service.create({
      mechanic: profile2._id,
      name: '3D Laser Wheel Alignment & Balancing',
      category: 'Tyre Service',
      description:
        'Computerized 4-wheel alignment adjustment (toe, camber), wheel balancing with alloy weights, and tyre tread depth measurement.',
      price: 35,
      estimatedDuration: '1 hour',
      vehicleTypes: ['Car', 'SUV'],
      isAvailable: true,
    });

    await Service.create({
      mechanic: profile2._id,
      name: 'Standard Scooter / Commuter Bike Service',
      category: 'General Service',
      description:
        'Engine oil change, carburetor cleaning, spark plug cleanup, brake cable tightening, battery terminal grease, and chain lubrication.',
      price: 25,
      estimatedDuration: '1.5 hours',
      vehicleTypes: ['Bike', 'Scooter'],
      isAvailable: true,
    });

    // ProGarage Services
    await Service.create({
      mechanic: profile3._id,
      name: '24/7 Roadside Dead Battery Jump-Start',
      category: 'Emergency Repair',
      description:
        'Technician dispatch to your location with heavy-duty jump booster, battery voltage reading, and alternator charging rate inspection.',
      price: 40,
      estimatedDuration: '30-45 mins',
      vehicleTypes: ['Car', 'Bike', 'Scooter', 'SUV', 'Other'],
      isAvailable: true,
    });

    await Service.create({
      mechanic: profile3._id,
      name: 'New Battery Replacement & Testing',
      category: 'Battery Service',
      description:
        'Battery CCA load test, removal of old unit, installation of new 12V maintenance-free battery with manufacturer warranty card, and terminal cleaning.',
      price: 90,
      estimatedDuration: '45 mins',
      vehicleTypes: ['Car', 'SUV', 'Bike'],
      isAvailable: true,
    });

    // Precision German Services
    await Service.create({
      mechanic: profile4._id,
      name: 'European Scheduled Major Maintenance',
      category: 'General Service',
      description:
        'Liqui Moly / Castrol Edge synthetic oil, OEM Mann oil & air filters, spark plug replacement, brake fluid flush, and full VCDS diagnostic scan.',
      price: 220,
      estimatedDuration: '4 hours',
      vehicleTypes: ['Car', 'SUV'],
      isAvailable: true,
    });

    // South Bangalore Two-Wheeler
    await Service.create({
      mechanic: profile5._id,
      name: 'Motorcycle Drive Chain & Sprocket Replacement',
      category: 'General Service',
      description:
        'Replacement of front/rear sprockets and heavy-duty O-Ring drive chain, rear wheel alignment, and Motul chain paste application.',
      price: 60,
      estimatedDuration: '2 hours',
      vehicleTypes: ['Bike'],
      isAvailable: true,
    });

    console.log('[Seeder] Seeding Customer Vehicles...');

    const v1 = await Vehicle.create({
      owner: customer1._id,
      vehicleType: 'Car',
      brand: 'Honda',
      model: 'City ZX (1.5 i-VTEC)',
      year: 2022,
      fuelType: 'Petrol',
      registrationNumber: 'KA-01-MJ-4521',
      mileage: 14200,
      notes: 'Front brake squeak noticed when coming to a complete stop.',
    });

    const v2 = await Vehicle.create({
      owner: customer1._id,
      vehicleType: 'Bike',
      brand: 'Yamaha',
      model: 'YZF-R15 V4',
      year: 2023,
      fuelType: 'Petrol',
      registrationNumber: 'KA-05-ER-8990',
      mileage: 8400,
      notes: 'Regular synthetic oil changes every 3,000 km.',
    });

    const v3 = await Vehicle.create({
      owner: customer1._id,
      vehicleType: 'SUV',
      brand: 'Toyota',
      model: 'Fortuner 4x4 AT',
      year: 2021,
      fuelType: 'Diesel',
      registrationNumber: 'KA-03-NB-1029',
      mileage: 38500,
      notes: 'Highway runner, tyre rotation done at 30,000 km.',
    });

    const v4 = await Vehicle.create({
      owner: customer2._id,
      vehicleType: 'Car',
      brand: 'Hyundai',
      model: 'i20 Asta 1.0 Turbo',
      year: 2023,
      fuelType: 'Petrol',
      registrationNumber: 'KA-04-PZ-6612',
      mileage: 9100,
      notes: 'Daily office commute.',
    });

    console.log('[Seeder] Seeding Real-World Service Requests...');

    // Request 1: In Repair (REPAIRING)
    const req1 = await ServiceRequest.create({
      customer: customer1._id,
      mechanic: profile1._id,
      vehicle: v1._id,
      service: s3._id,
      serviceName: 'Front Ceramic Brake Pad Replacement & Disc Resurfacing',
      problemDescription:
        'Loud screeching sound from front wheels when braking from 50 km/h, and slight pedal vibration.',
      preferredDate: new Date().toISOString().split('T')[0],
      preferredTime: '10:00 AM',
      status: 'REPAIRING',
      estimatedCost: 85,
      technicianNotes:
        'Front pads worn down to 2mm. Disc rotors have light surface grooves — currently mounted on the lathe machine for resurfacing. New ceramic pads ready for fitment.',
      statusHistory: [
        {
          status: 'REQUESTED',
          timestamp: new Date(Date.now() - 6 * 3600 * 1000),
          note: 'Booking requested by customer',
          updatedBy: customer1._id,
        },
        {
          status: 'ACCEPTED',
          timestamp: new Date(Date.now() - 5 * 3600 * 1000),
          note: 'Bay #2 reserved for 10:00 AM drop-off',
          updatedBy: mechUser1._id,
        },
        {
          status: 'DIAGNOSING',
          timestamp: new Date(Date.now() - 2 * 3600 * 1000),
          note: 'Inspected brake calipers, rotor runout measured at 0.04mm',
          updatedBy: mechUser1._id,
        },
        {
          status: 'REPAIRING',
          timestamp: new Date(Date.now() - 30 * 60 * 1000),
          note: 'Rotor resurfacing underway on brake lathe machine',
          updatedBy: mechUser1._id,
        },
      ],
    });

    // Request 2: Vehicle Ready (READY)
    const req2 = await ServiceRequest.create({
      customer: customer1._id,
      mechanic: profile1._id,
      vehicle: v2._id,
      service: s2._id,
      serviceName: 'Computer Diagnostic Scan & Throttle Body Cleanup',
      problemDescription:
        'Cold start idle speed fluctuating around 1000-1100 RPM.',
      preferredDate: new Date(Date.now() - 24 * 3600 * 1000).toISOString().split('T')[0],
      preferredTime: '02:00 PM',
      status: 'READY',
      estimatedCost: 55,
      finalCost: 55,
      technicianNotes:
        'Scanned OBD codes (no hard faults). Cleaned throttle body carbon deposits and calibrated idle air control. Test ride completed smoothly.',
      statusHistory: [
        {
          status: 'REQUESTED',
          timestamp: new Date(Date.now() - 24 * 3600 * 1000),
          note: 'Customer requested inspection',
          updatedBy: customer1._id,
        },
        {
          status: 'ACCEPTED',
          timestamp: new Date(Date.now() - 22 * 3600 * 1000),
          note: 'Appointment confirmed',
          updatedBy: mechUser1._id,
        },
        {
          status: 'DIAGNOSING',
          timestamp: new Date(Date.now() - 18 * 3600 * 1000),
          note: 'Throttle body carbon buildup identified',
          updatedBy: mechUser1._id,
        },
        {
          status: 'REPAIRING',
          timestamp: new Date(Date.now() - 6 * 3600 * 1000),
          note: 'Throttle body cleaned and TPS sensor reset',
          updatedBy: mechUser1._id,
        },
        {
          status: 'READY',
          timestamp: new Date(Date.now() - 1 * 3600 * 1000),
          note: 'Vehicle tested and ready for customer collection at front desk',
          updatedBy: mechUser1._id,
        },
      ],
    });

    // Request 3: Completed & Reviewed
    const req3 = await ServiceRequest.create({
      customer: customer1._id,
      mechanic: profile3._id,
      vehicle: v3._id,
      serviceName: '24/7 Roadside Dead Battery Jump-Start',
      problemDescription:
        'Battery drained overnight due to cabin light left on. Engine clicks but does not crank.',
      preferredDate: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString().split('T')[0],
      preferredTime: '08:30 AM',
      status: 'COMPLETED',
      estimatedCost: 40,
      finalCost: 40,
      technicianNotes:
        'Technician arrived in 25 minutes. Jump-started engine, tested alternator charging output at 14.2V (healthy).',
      completionDate: new Date(Date.now() - 5 * 24 * 3600 * 1000),
      ratingGiven: true,
      statusHistory: [
        {
          status: 'REQUESTED',
          timestamp: new Date(Date.now() - 5 * 24 * 3600 * 1000 - 3600 * 1000),
          note: 'Emergency request submitted',
          updatedBy: customer1._id,
        },
        {
          status: 'ACCEPTED',
          timestamp: new Date(Date.now() - 5 * 24 * 3600 * 1000 - 3000 * 1000),
          note: 'Technician dispatched to Indiranagar',
          updatedBy: mechUser3._id,
        },
        {
          status: 'REPAIRING',
          timestamp: new Date(Date.now() - 5 * 24 * 3600 * 1000 - 1800 * 1000),
          note: 'Jump booster pack connected',
          updatedBy: mechUser3._id,
        },
        {
          status: 'READY',
          timestamp: new Date(Date.now() - 5 * 24 * 3600 * 1000 - 600 * 1000),
          note: 'Engine idling steadily',
          updatedBy: mechUser3._id,
        },
        {
          status: 'COMPLETED',
          timestamp: new Date(Date.now() - 5 * 24 * 3600 * 1000),
          note: 'Bill settled',
          updatedBy: mechUser3._id,
        },
      ],
    });

    // Authentic Customer Review for Request 3
    await Review.create({
      serviceRequest: req3._id,
      customer: customer1._id,
      mechanic: profile3._id,
      rating: 5,
      comment:
        'My Fortuner battery was dead at 8 AM. Rajesh sent a mobile technician who reached my apartment in under 25 minutes with a jump pack. He also tested my alternator voltage before leaving. Really helpful service.',
    });

    // Request 4: Pending for Apex AutoCare
    await ServiceRequest.create({
      customer: customer2._id,
      mechanic: profile1._id,
      vehicle: v4._id,
      service: s4._id,
      serviceName: 'AC Gas Vacuum & R134a Refill',
      problemDescription:
        'AC cooling takes a long time in afternoon traffic. Warm air blowing on fan setting 2.',
      preferredDate: new Date(Date.now() + 24 * 3600 * 1000).toISOString().split('T')[0],
      preferredTime: '11:00 AM',
      status: 'REQUESTED',
      estimatedCost: 65,
      statusHistory: [
        {
          status: 'REQUESTED',
          timestamp: new Date(),
          note: 'Booking requested by customer',
          updatedBy: customer2._id,
        },
      ],
    });

    console.log('[Seeder] Seeding Favorites & Notifications...');

    // Favorites
    await Favorite.create({
      customer: customer1._id,
      mechanic: profile1._id,
    });

    await Favorite.create({
      customer: customer1._id,
      mechanic: profile3._id,
    });

    // Customer Notification
    await Notification.create({
      recipient: customer1._id,
      sender: mechUser1._id,
      type: 'STATUS_CHANGE',
      title: 'Vehicle Ready for Pickup',
      message:
        'Apex AutoCare finished servicing your Yamaha YZF-R15 V4. You can collect the bike anytime before 8:00 PM.',
      data: { serviceRequestId: req2._id },
      isRead: false,
    });

    // Mechanic Notification
    await Notification.create({
      recipient: mechUser1._id,
      sender: customer2._id,
      type: 'NEW_REQUEST',
      title: 'New Booking Request',
      message:
        'Sarah Jenkins requested AC service for Hyundai i20 on tomorrow at 11:00 AM.',
      data: { customerId: customer2._id },
      isRead: false,
    });

    console.log(`
============================================================
✅ FIXNEAR DATABASE SEEDED WITH REALISTIC DATA!
============================================================
Demo Logins:
- Customer: customer@fixnear.com / password123
- Mechanic: mechanic@fixnear.com / password123
============================================================
    `);

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('[Seeder Error]:', error);
    process.exit(1);
  }
};

seedData();
