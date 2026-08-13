const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

// Load models
const User = require('./models/User');
const Service = require('./models/Service');
const Gallery = require('./models/Gallery');
const Testimonial = require('./models/Testimonial');
const Career = require('./models/Career');

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/logistics-manpower');
    console.log('MongoDB Connected for Seeding...');

    // Clear existing data
    await User.deleteMany();
    await Service.deleteMany();
    await Gallery.deleteMany();
    await Testimonial.deleteMany();
    await Career.deleteMany();
    console.log('Existing collections cleared.');

    // Seed Admin
    // const salt = await bcrypt.genSalt(10);
    // 

    const admin = await User.create({
     name: process.env.ADMIN_NAME || 'Corporate Admin',
  email: process.env.ADMIN_EMAIL,
  password: hashedPassword,
  role: 'admin',
    });
   

    // Seed Services
    const services = [
      {
        title: 'Road & Rail Freight Logistics',
        description: 'Comprehensive heavy hauling and overland transportation services across nationwide freight networks.',
        details: [
          'Full Truckload (FTL) & Less-Than-Truckload (LTL) services',
          'Temperature-controlled shipping containers',
          'GPS real-time cargo tracking and geo-fencing solutions',
          'Express door-to-door deliveries with flexible schedules',
        ],
        icon: 'Truck',
        imageUrl: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&q=80&w=600',
        category: 'Logistics',
      },
      {
        title: 'Warehousing & Distribution Management',
        description: 'State-of-the-art secure distribution centers with intelligent inventory tracking systems.',
        details: [
          'Climate-controlled warehouse options',
          'Cross-docking and inventory optimization audits',
          'Barcode scanning and automated order sorting',
          '24/7 security monitoring with secure checkpoints',
        ],
        icon: 'Warehouse',
        imageUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=600',
        category: 'Logistics',
      },
      {
        title: 'Contract Staffing & Recruitment',
        description: 'Providing highly skilled temporary, permanent, and seasonal manpower tailored to enterprise requirements.',
        details: [
          'Vetted and compliance-verified technical professionals',
          'Rapid mobilization for seasonal demand spikes',
          'Comprehensive background, medical, and skill assessments',
          'Scalable crew sizing from small projects to massive plants',
        ],
        icon: 'Users',
        imageUrl: 'https://images.unsplash.com/photo-1521791136368-1a8682707636?auto=format&fit=crop&q=80&w=600',
        category: 'Manpower',
      },
      {
        title: 'Industrial Skill Development Programs',
        description: 'Accredited training and certification programs for machine operator and warehouse safety personnel.',
        details: [
          'Forklift and heavy machinery operating certificates',
          'OSHA, safety rules, and emergency guidelines compliance',
          'Vocational training modules for assembly line personnel',
          'On-site custom training tailored to company facilities',
        ],
        icon: 'GraduationCap',
        imageUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=600',
        category: 'Manpower',
      },
      {
        title: 'Last-Mile E-commerce Fulfillment',
        description: 'Dedicated delivery networks optimized for swift, reliable customer package dispatch and returns.',
        details: [
          'Dense city-center routing optimization software',
          'Dedicated parcel delivery drivers and vehicle fleets',
          'Electronic Proof of Delivery (ePOD) and signature tracking',
          'Reverse logistics management and inventory restock services',
        ],
        icon: 'Activity',
        imageUrl: 'https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?auto=format&fit=crop&q=80&w=600',
        category: 'Logistics',
      },
    ];

    await Service.insertMany(services);
    console.log('Services seeded successfully.');

    // Seed Gallery
    const galleryItems = [
      {
        title: 'Modern Transport Fleet Ready for Dispatch',
        imageUrl: 'https://images.unsplash.com/photo-1516576885230-101c7414ddf2?auto=format&fit=crop&q=80&w=600',
        category: 'Logistics',
      },
      {
        title: 'Vast Warehouse and Distribution Center Operations',
        imageUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=600',
      category: 'Warehouse',
      },
      {
        title: 'Logistics Center Inventory Sorting Line',
        imageUrl: 'https://images.unsplash.com/photo-1530047625168-4b18fa25d2cf?auto=format&fit=crop&q=80&w=600',
        category: 'Warehouse',
      },
      {
        title: 'Professional Manpower Training Session',
        imageUrl: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=600',
        category: 'Manpower',
      },
      {
        title: 'On-site Industrial Team Collaboration',
        imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=600',
        category: 'Manpower',
      },
    ];

    await Gallery.insertMany(galleryItems);
    console.log('Gallery items seeded successfully.');

    // Seed Testimonials
    const testimonials = [
      {
        clientName: 'Sarah Jenkins',
        company: 'Prime Retail Group, COO',
        feedback: 'Partnering with this team has completely streamlined our supply chain. Their delivery timelines are rock-solid, and their e-commerce fulfillment error rate is practically non-existent. Highly recommended!',
        rating: 5,
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
      },
      {
        clientName: 'David Chen',
        company: 'Apex Manufacturing, Director of Operations',
        feedback: 'We rely heavily on their contract manpower solutions. During peak manufacturing seasons, they provided 120 certified assembly line personnel within 72 hours. Their compliance checks and safety training are exceptional.',
        rating: 5,
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
      },
      {
        clientName: 'Robert Martinez',
        company: 'Global Import-Export Corp, Logistics Manager',
        feedback: 'The freight services are top-tier. GPS tracking gives us absolute peace of mind for high-value cargo. Their team is extremely professional and manages border clearances smoothly.',
        rating: 4,
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150',
      },
    ];

    await Testimonial.insertMany(testimonials);
    console.log('Testimonials seeded successfully.');

    // Seed Careers
    const careers = [
      {
        title: 'Logistics Route Coordinator',
        department: 'Operations & Route Management',
        location: 'Chicago, IL',
        type: 'Full-time',
        description: 'We are seeking a detail-oriented Logistics Coordinator to supervise transport routing, coordinate driver schedules, and analyze freight lanes.',
        requirements: [
          '2+ years of experience in logistics coordination or fleet management',
          'Proficiency with transportation management system (TMS) software',
          'Strong problem-solving skills and capability to operate in fast-paced scenarios',
          'Bachelor’s degree in Supply Chain Management, Business, or related credentials preferred',
        ],
        active: true,
      },
      {
        title: 'Industrial Warehouse Supervisor',
        department: 'Warehouse Management',
        location: 'Houston, TX',
        type: 'Full-time',
        description: 'Responsible for oversight of inventory audits, loading bays, safety compliance (OSHA), and warehouse worker teams.',
        requirements: [
          '3+ years of experience supervising teams in a manufacturing or distribution environment',
          'Certified in forklift training and material handling safety practices',
          'Experience with warehouse inventory systems (WMS) and SAP',
          'Outstanding organizational skills and team leadership qualities',
        ],
        active: true,
      },
      {
        title: 'Forklift Operator & Materials Handler',
        department: 'Manpower Supply',
        location: 'Los Angeles, CA',
        type: 'Contract',
        description: 'Multiple openings for certified forklift operators to support client warehousing depots. Shift-based schedule with overtime options.',
        requirements: [
          'Valid Forklift Operator license/certification (Reach Truck or Counterbalance)',
          'High School diploma or equivalent basic qualifications',
          'Capability to lift up to 50 lbs safely',
          'Reliable transportation and solid safety record',
        ],
        active: true,
      },
    ];

    await Career.insertMany(careers);
    console.log('Careers seeded successfully.');

    console.log('All sample data seeded successfully!');
    mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
