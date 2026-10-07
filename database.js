/**
 * SWEETY COLOUR DECORA — RELATIONAL DATABASE LAYER
 * Powered by Node.js built-in `node:sqlite` (ACID synchronous transactions)
 * Zero external compilation dependencies. File: construction.sqlite
 */

const { DatabaseSync } = require('node:sqlite');
const path = require('path');
const fs = require('fs');

const DB_PATH = process.env.VERCEL
  ? path.join('/tmp', 'construction.sqlite')
  : path.join(__dirname, 'construction.sqlite');
let dbInstance = null;

function getDatabase() {
  if (!dbInstance) {
    dbInstance = new DatabaseSync(DB_PATH);
    dbInstance.exec('PRAGMA foreign_keys = ON;');
  }
  return dbInstance;
}

function initDatabase() {
  const db = getDatabase();

  // 1. Users Table (Role-Based Access Control)
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      full_name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      role TEXT CHECK(role IN ('OWNER', 'ADMIN', 'PROJECT_MANAGER', 'SITE_SUPERVISOR', 'ACCOUNTANT')) NOT NULL,
      phone TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 2. Projects Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      client_name TEXT NOT NULL,
      client_email TEXT,
      client_phone TEXT,
      location TEXT NOT NULL,
      city TEXT NOT NULL DEFAULT 'Bengaluru',
      project_type TEXT CHECK(project_type IN ('Residential', 'Commercial', 'Interior', 'Renovation', 'New Construction', 'Repair', 'Other')) NOT NULL,
      start_date DATE NOT NULL,
      expected_completion DATE NOT NULL,
      contract_value REAL DEFAULT 0,
      estimated_budget REAL NOT NULL,
      project_manager_id INTEGER,
      status TEXT CHECK(status IN ('Planning', 'Active', 'In Progress', 'On Hold', 'Completed', 'Cancelled')) DEFAULT 'Active',
      completion_percentage REAL DEFAULT 0,
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(project_manager_id) REFERENCES users(id) ON DELETE SET NULL
    );
  `);

  // 3. Workers Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS workers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      worker_name TEXT NOT NULL,
      worker_code TEXT UNIQUE NOT NULL,
      role TEXT CHECK(role IN (
        'Mason', 'Carpenter', 'Electrician', 'Plumber', 'Painter',
        'Welder', 'Tile Worker', 'False Ceiling Worker', 'Helper',
        'Supervisor', 'Site Engineer', 'Interior Installer', 'Other'
      )) NOT NULL,
      phone TEXT,
      skill_level TEXT CHECK(skill_level IN ('Master', 'Skilled', 'Semi-Skilled', 'Helper')) DEFAULT 'Skilled',
      daily_wage REAL NOT NULL DEFAULT 800,
      hourly_wage REAL NOT NULL DEFAULT 100,
      joining_date DATE DEFAULT (DATE('now')),
      assigned_project_id INTEGER,
      assigned_work TEXT,
      status TEXT CHECK(status IN ('Active', 'Inactive', 'On Leave')) DEFAULT 'Active',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(assigned_project_id) REFERENCES projects(id) ON DELETE SET NULL
    );
  `);

  // 4. Worker Assignments
  db.exec(`
    CREATE TABLE IF NOT EXISTS worker_assignments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      worker_id INTEGER NOT NULL,
      project_id INTEGER NOT NULL,
      role TEXT,
      assigned_date DATE DEFAULT (DATE('now')),
      notes TEXT,
      FOREIGN KEY(worker_id) REFERENCES workers(id) ON DELETE CASCADE,
      FOREIGN KEY(project_id) REFERENCES projects(id) ON DELETE CASCADE
    );
  `);

  // 5. Daily Attendance Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS attendance (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date DATE NOT NULL,
      worker_id INTEGER NOT NULL,
      project_id INTEGER NOT NULL,
      status TEXT CHECK(status IN ('PRESENT', 'ABSENT', 'HALF DAY', 'LEAVE')) NOT NULL DEFAULT 'PRESENT',
      regular_hours REAL DEFAULT 8,
      overtime_hours REAL DEFAULT 0,
      daily_wage_rate REAL NOT NULL,
      overtime_rate REAL NOT NULL,
      calculated_wage REAL NOT NULL,
      work_completed TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(date, worker_id, project_id),
      FOREIGN KEY(worker_id) REFERENCES workers(id) ON DELETE CASCADE,
      FOREIGN KEY(project_id) REFERENCES projects(id) ON DELETE CASCADE
    );
  `);

  // 6. Work Items (Assignments) Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS work_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      project_id INTEGER NOT NULL,
      item_code TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      assigned_worker_ids TEXT, -- JSON array of worker IDs
      start_date DATE NOT NULL,
      deadline DATE NOT NULL,
      estimated_labor REAL DEFAULT 0,
      actual_labor REAL DEFAULT 0,
      completion_percentage INTEGER DEFAULT 0,
      status TEXT CHECK(status IN ('NOT STARTED', 'IN PROGRESS', 'ON HOLD', 'COMPLETED', 'CANCELLED')) DEFAULT 'NOT STARTED',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(project_id) REFERENCES projects(id) ON DELETE CASCADE
    );
  `);

  // 7. Payments Table (Worker Wages, Advances, Overtime)
  db.exec(`
    CREATE TABLE IF NOT EXISTS payments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      worker_id INTEGER NOT NULL,
      project_id INTEGER,
      amount REAL NOT NULL,
      date DATE NOT NULL,
      payment_type TEXT CHECK(payment_type IN ('Wage', 'Advance', 'Overtime', 'Bonus', 'Other')) NOT NULL,
      notes TEXT,
      recorded_by_user_id INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(worker_id) REFERENCES workers(id) ON DELETE CASCADE,
      FOREIGN KEY(project_id) REFERENCES projects(id) ON DELETE SET NULL,
      FOREIGN KEY(recorded_by_user_id) REFERENCES users(id) ON DELETE SET NULL
    );
  `);

  // 8. Materials Catalog & Purchases
  db.exec(`
    CREATE TABLE IF NOT EXISTS materials (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      unit TEXT NOT NULL,
      default_unit_cost REAL DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS material_purchases (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      project_id INTEGER NOT NULL,
      material_name TEXT NOT NULL,
      category TEXT NOT NULL,
      quantity REAL NOT NULL,
      unit TEXT NOT NULL,
      unit_cost REAL NOT NULL,
      total_cost REAL NOT NULL,
      supplier TEXT,
      date DATE NOT NULL,
      invoice_no TEXT,
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(project_id) REFERENCES projects(id) ON DELETE CASCADE
    );
  `);

  // 9. Project Expenses Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS expenses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      project_id INTEGER NOT NULL,
      category TEXT CHECK(category IN (
        'Labor', 'Materials', 'Transport', 'Equipment',
        'Subcontractor', 'Permits', 'Waste', 'Miscellaneous'
      )) NOT NULL,
      description TEXT NOT NULL,
      amount REAL NOT NULL,
      date DATE NOT NULL,
      vendor TEXT,
      payment_method TEXT DEFAULT 'Bank Transfer',
      receipt_url TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(project_id) REFERENCES projects(id) ON DELETE CASCADE
    );
  `);

  // 10. Daily Site Reports Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS daily_reports (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      project_id INTEGER NOT NULL,
      date DATE NOT NULL,
      workers_present_count INTEGER DEFAULT 0,
      work_completed TEXT NOT NULL,
      materials_used TEXT,
      problems TEXT,
      safety_issues TEXT,
      photos_json TEXT, -- JSON array of image URLs
      ai_observations TEXT,
      supervisor_name TEXT,
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(project_id) REFERENCES projects(id) ON DELETE CASCADE
    );
  `);

  // 11. Project Estimates (Saved from AI Studio)
  db.exec(`
    CREATE TABLE IF NOT EXISTS project_estimates (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      project_id INTEGER,
      room_type TEXT NOT NULL,
      style TEXT NOT NULL,
      area_sqft REAL,
      city TEXT NOT NULL,
      budget_tier TEXT,
      low_estimate REAL NOT NULL,
      expected_estimate REAL NOT NULL,
      high_estimate REAL NOT NULL,
      breakdown_json TEXT,
      disclaimer TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(project_id) REFERENCES projects(id) ON DELETE SET NULL
    );
  `);

  // 12. City Pricing Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS pricing (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      city TEXT NOT NULL,
      category TEXT NOT NULL,
      material_grade TEXT CHECK(material_grade IN ('Basic', 'Standard', 'Premium', 'Luxury')) NOT NULL,
      unit TEXT NOT NULL,
      material_rate REAL NOT NULL,
      labor_rate REAL NOT NULL,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(city, category, material_grade)
    );
  `);

  // 13. Audit Logs Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS audit_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_name TEXT,
      action TEXT NOT NULL,
      entity_type TEXT NOT NULL,
      entity_id INTEGER,
      details TEXT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Seed default data if empty
  seedInitialData(db);
}

function seedInitialData(db) {
  // 1. Seed Users (All 5 RBAC Roles)
  const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get().count;
  if (userCount === 0) {
    const insertUser = db.prepare(`
      INSERT INTO users (username, full_name, email, role, phone)
      VALUES (?, ?, ?, ?, ?)
    `);

    insertUser.run('owner', 'Srushti Shah (Owner)', 'owner@sweetycolourdecora.com', 'OWNER', '+91 98250 12345');
    insertUser.run('admin', 'Bhavin Shah (General Manager)', 'admin@sweetycolourdecora.com', 'ADMIN', '+91 98250 12346');
    insertUser.run('pm', 'Arjun Mehta (Lead Project Manager)', 'pm@sweetycolourdecora.com', 'PROJECT_MANAGER', '+91 98250 12347');
    insertUser.run('supervisor', 'Ramesh Patel (Senior Site Engineer)', 'ramesh@sweetycolourdecora.com', 'SITE_SUPERVISOR', '+91 98250 12348');
    insertUser.run('accountant', 'Kavita Joshi (Financial Controller)', 'kavita@sweetycolourdecora.com', 'ACCOUNTANT', '+91 98250 12349');
  }

  // 2. Seed Projects
  const projectCount = db.prepare('SELECT COUNT(*) as count FROM projects').get().count;
  if (projectCount === 0) {
    const insertProject = db.prepare(`
      INSERT INTO projects (
        name, client_name, client_email, client_phone, location, city,
        project_type, start_date, expected_completion, contract_value,
        estimated_budget, project_manager_id, status, completion_percentage, notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertProject.run(
      'Emerald Heights Penthouse Finish',
      'Vikram Singhania',
      'vikram@singhaniagroup.com',
      '+91 98240 88990',
      'Bodakdev, SG Highway',
      'Ahmedabad',
      'Residential',
      '2026-07-01',
      '2026-10-15',
      2450000,
      1980000,
      3,
      'Active',
      68,
      'Full turnkey finishing: Italian marble flooring, gypsum coves, PU wardrobes, textured accent walls.'
    );

    insertProject.run(
      'Surat Diamond Bourse Suite Fitout',
      'Shreeji Gems Consortium',
      'director@shreejigems.in',
      '+91 98790 55443',
      'Khajod, DREAM City',
      'Surat',
      'Commercial',
      '2026-08-10',
      '2026-11-30',
      4200000,
      3450000,
      3,
      'Active',
      45,
      'Acoustic false ceilings, vitrified tile cladding, fire-rated modular partition glass, zero-VOC acrylic painting.'
    );

    insertProject.run(
      'Indiranagar Villa Contemporary Redesign',
      'Ananya & Rohan Deshmukh',
      'rohan.deshmukh@gmail.com',
      '+91 99001 22334',
      '12th Main, Indiranagar',
      'Bengaluru',
      'Interior',
      '2026-05-15',
      '2026-08-30',
      1850000,
      1520000,
      3,
      'Completed',
      100,
      'Japandi aesthetic: micro-cement walls, teak floor inlays, concealed profile lighting, modular Blum kitchen.'
    );
  }

  // 3. Seed Workers
  const workerCount = db.prepare('SELECT COUNT(*) as count FROM workers').get().count;
  if (workerCount === 0) {
    const insertWorker = db.prepare(`
      INSERT INTO workers (
        worker_name, worker_code, role, phone, skill_level,
        daily_wage, hourly_wage, joining_date, assigned_project_id, assigned_work, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertWorker.run('Rajesh Sharma', 'WRK-001', 'Painter', '+91 91234 56701', 'Master', 1200, 150, '2024-01-10', 1, 'Italian Stucco & PU Finish', 'Active');
    insertWorker.run('Suresh Kumar', 'WRK-002', 'Tile Worker', '+91 91234 56702', 'Master', 1400, 175, '2023-11-05', 1, 'Book-match Marble & Large Slabs', 'Active');
    insertWorker.run('Mohammad Salim', 'WRK-003', 'Carpenter', '+91 91234 56703', 'Master', 1350, 170, '2024-02-14', 1, 'Modular Wardrobes & Fluted Paneling', 'Active');
    insertWorker.run('Dinesh Vaghela', 'WRK-004', 'False Ceiling Worker', '+91 91234 56704', 'Skilled', 1100, 140, '2024-03-20', 2, 'Gypsum Framing & LED Coves', 'Active');
    insertWorker.run('Manoj Prajapati', 'WRK-005', 'Electrician', '+91 91234 56705', 'Skilled', 1150, 145, '2024-04-12', 2, 'DB Cabling & Magnetic Track Light', 'Active');
    insertWorker.run('Gopal Barot', 'WRK-006', 'Helper', '+91 91234 56706', 'Helper', 650, 80, '2025-01-08', 1, 'Surface Sanding & Material Hauling', 'Active');
    insertWorker.run('Sunil Yadav', 'WRK-007', 'Helper', '+91 91234 56707', 'Helper', 650, 80, '2025-02-01', 2, 'Site Clearing & Staging', 'Active');
    insertWorker.run('Ramesh Patel', 'WRK-008', 'Site Engineer', '+91 98250 12348', 'Master', 2200, 275, '2022-06-01', 1, 'Quality Laser Audits & Coordination', 'Active');
  }

  // 4. Seed Attendance Records
  const attCount = db.prepare('SELECT COUNT(*) as count FROM attendance').get().count;
  if (attCount === 0) {
    const insertAtt = db.prepare(`
      INSERT INTO attendance (
        date, worker_id, project_id, status, regular_hours,
        overtime_hours, daily_wage_rate, overtime_rate, calculated_wage, work_completed
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    // Yesterday Attendance
    insertAtt.run(yesterday, 1, 1, 'PRESENT', 8, 2, 1200, 225, 1650, 'Completed living room acrylic base coat and 2h overtime masking');
    insertAtt.run(yesterday, 2, 1, 'PRESENT', 8, 1, 1400, 262.5, 1662.5, 'Laid 180 sq.ft Italian marble slab with zero lippage');
    insertAtt.run(yesterday, 3, 1, 'PRESENT', 8, 0, 1350, 255, 1350, 'Assembled master bedroom wardrobe carcase');
    insertAtt.run(yesterday, 6, 1, 'PRESENT', 8, 0, 650, 120, 650, 'Assisted tile layer with adhesive mix and cleaning');
    insertAtt.run(yesterday, 4, 2, 'PRESENT', 8, 1.5, 1100, 210, 1415, 'Erected grid channels for executive suite ceiling');
    insertAtt.run(yesterday, 5, 2, 'PRESENT', 8, 0, 1150, 217.5, 1150, 'Pulled low-voltage lighting wires to main distribution box');

    // Today Attendance
    insertAtt.run(today, 1, 1, 'PRESENT', 8, 0, 1200, 225, 1200, 'Applying second coat micro-texture on feature wall');
    insertAtt.run(today, 2, 1, 'PRESENT', 8, 0, 1400, 262.5, 1400, 'Grouting marble joints with epoxy resin');
    insertAtt.run(today, 3, 1, 'HALF DAY', 4, 0, 1350, 255, 675, 'Installed drawer runners; half-day approved leave');
    insertAtt.run(today, 6, 1, 'PRESENT', 8, 0, 650, 120, 650, 'Site cleaning, masking floor perimeter');
    insertAtt.run(today, 4, 2, 'PRESENT', 8, 0, 1100, 210, 1100, 'Fixing Saint-Gobain gypsum boards');
    insertAtt.run(today, 5, 2, 'PRESENT', 8, 0, 1150, 217.5, 1150, 'Connecting LED strip drivers and dimmer testing');
  }

  // 5. Seed Work Items
  const workCount = db.prepare('SELECT COUNT(*) as count FROM work_items').get().count;
  if (workCount === 0) {
    const insertWork = db.prepare(`
      INSERT INTO work_items (
        project_id, item_code, title, description, assigned_worker_ids,
        start_date, deadline, estimated_labor, actual_labor, completion_percentage, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertWork.run(1, 'WI-101', 'Italian Marble Slab Flooring & Polishing', 'Install 800 sq.ft book-matched Statuario marble in living & dining areas', '[2, 6]', '2026-07-15', '2026-08-20', 145000, 128000, 92, 'IN PROGRESS');
    insertWork.run(1, 'WI-102', 'Architectural Stucco & Polyurethane Painting', 'Level-5 skim coating, primer, and luxury Italian stucco on accent walls', '[1, 6]', '2026-08-01', '2026-09-10', 110000, 84000, 75, 'IN PROGRESS');
    insertWork.run(1, 'WI-103', 'Master Suite Wardrobes & Wall Paneling', 'Floor-to-ceiling acrylic laminate wardrobes with Blum soft-close sliders', '[3]', '2026-08-15', '2026-09-25', 180000, 115000, 60, 'IN PROGRESS');
    insertWork.run(2, 'WI-201', 'Acoustic Drop Ceiling & Concealed Track Channel', 'Install Armstrong acoustic boards and recessed black magnetic lighting tracks', '[4, 5]', '2026-08-15', '2026-09-30', 220000, 105000, 50, 'IN PROGRESS');
    insertWork.run(2, 'WI-202', 'Heavy Commercial Vitrified Tile Cladding', '1200x1800mm full-body vitrified tiles on main lobby and reception walls', '[2, 7]', '2026-09-01', '2026-10-15', 280000, 60000, 25, 'IN PROGRESS');
  }

  // 6. Seed Payments
  const payCount = db.prepare('SELECT COUNT(*) as count FROM payments').get().count;
  if (payCount === 0) {
    const insertPay = db.prepare(`
      INSERT INTO payments (worker_id, project_id, amount, date, payment_type, notes, recorded_by_user_id)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    insertPay.run(1, 1, 15000, '2026-08-31', 'Wage', 'Bi-weekly wage settlement for Aug 16-31', 5);
    insertPay.run(1, 1, 5000, '2026-09-05', 'Advance', 'Festive advance requested by worker', 5);
    insertPay.run(2, 1, 20000, '2026-08-31', 'Wage', 'Bi-weekly wage settlement for Aug 16-31', 5);
    insertPay.run(3, 1, 16000, '2026-08-31', 'Wage', 'Bi-weekly wage settlement for Aug 16-31', 5);
    insertPay.run(4, 2, 14000, '2026-08-31', 'Wage', 'August settlement', 5);
    insertPay.run(5, 2, 14500, '2026-08-31', 'Wage', 'August settlement', 5);
  }

  // 7. Seed Material Purchases
  const matPurchasesCount = db.prepare('SELECT COUNT(*) as count FROM material_purchases').get().count;
  if (matPurchasesCount === 0) {
    const insertPurchase = db.prepare(`
      INSERT INTO material_purchases (
        project_id, material_name, category, quantity, unit,
        unit_cost, total_cost, supplier, date, invoice_no, notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertPurchase.run(1, 'Italian Statuario Marble Slabs', 'Flooring', 850, 'sq.ft', 420, 357000, 'Classic Marble Company, Mumbai', '2026-07-10', 'INV-CMC-8821', 'First lot inspected and dry-laid');
    insertPurchase.run(1, 'Asian Paints Royale Aspira & Stucco', 'Painting', 40, 'Litres', 620, 24800, 'Gujarat Paint Agency', '2026-07-28', 'INV-GPA-1049', 'Base primer and finishing emulsion');
    insertPurchase.run(1, 'Marine Grade BWP Plywood (18mm)', 'Carpentry', 35, 'Sheets', 2450, 85750, 'Greenply Industries', '2026-08-05', 'INV-GRN-4491', 'Wardrobe carcasses');
    insertPurchase.run(2, 'Saint-Gobain Gyproc Gypsum Boards', 'False Ceiling', 120, 'Sheets', 380, 45600, 'Shree Ram Building Materials', '2026-08-12', 'INV-SRB-9912', 'Ceiling framing and ceiling board lot');
    insertPurchase.run(2, 'Kajaria 1200x1800mm Vitrified Slabs', 'Flooring', 450, 'sq.ft', 165, 74250, 'Kajaria World Surat', '2026-08-22', 'INV-KAJ-0231', 'Wall cladding reception area');
  }

  // 8. Seed Expenses
  const expCount = db.prepare('SELECT COUNT(*) as count FROM expenses').get().count;
  if (expCount === 0) {
    const insertExp = db.prepare(`
      INSERT INTO expenses (project_id, category, description, amount, date, vendor, payment_method)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    insertExp.run(1, 'Labor', 'Direct craft labor payout (Aug 1 - Aug 31)', 65000, '2026-08-31', 'Direct Workforce', 'Bank Transfer');
    insertExp.run(1, 'Materials', 'Statuario Marble & Adhesives invoice tranche', 357000, '2026-07-15', 'Classic Marble Co.', 'NEFT');
    insertExp.run(1, 'Transport', 'Hydraulic flatbed crane delivery for 850 sqft slabs to 14th floor', 18500, '2026-07-12', 'Apex Logistics', 'Cheque');
    insertExp.run(1, 'Equipment', 'Rotary floor buffer and industrial diamond polishing pads rental', 14200, '2026-08-25', 'Hilti Tool Hire', 'UPI');
    insertExp.run(1, 'Waste', 'Debris chute clearance & municipal dump disposal (3 trucks)', 9600, '2026-08-29', 'CleanCity Waste Management', 'Cash');
    insertExp.run(2, 'Labor', 'Commercial site false ceiling gang advance payout', 42500, '2026-08-31', 'Surat Workforce', 'Bank Transfer');
    insertExp.run(2, 'Materials', 'Saint-Gobain framing channels and gypsum boards', 45600, '2026-08-14', 'Shree Ram Materials', 'NEFT');
    insertExp.run(2, 'Permits', 'Commercial interior renovation fire safety audit & permit fee', 12000, '2026-08-18', 'Surat Municipal Corp', 'Bank Transfer');
  }

  // 9. Seed Daily Site Reports
  const reportCount = db.prepare('SELECT COUNT(*) as count FROM daily_reports').get().count;
  if (reportCount === 0) {
    const insertReport = db.prepare(`
      INSERT INTO daily_reports (
        project_id, date, workers_present_count, work_completed,
        materials_used, problems, safety_issues, photos_json,
        ai_observations, supervisor_name, notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const today = new Date().toISOString().split('T')[0];
    insertReport.run(
      1,
      today,
      4,
      'Statuario marble joints grouted with resin. Living room accent wall micro-stucco 2nd coat completed.',
      '12kg epoxy resin grout, 5L Italian micro-stucco',
      'Slight moisture reading on east balcony corner; postponed exterior paint application by 24 hours for curing.',
      'Zero safety incidents. Mandatory PPE & dust extraction vacuum in active use.',
      JSON.stringify(['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=900&auto=format&fit=crop&q=85']),
      'AI Analysis Estimate: Flooring installation appears ~92% completed with tight flush tolerances. Wall prep at Level-4 smoothness.',
      'Ramesh Patel',
      'Client visited site at 3 PM and approved stucco color swatch.'
    );
  }

  // 10. Seed Pricing from pricing_database.json if empty
  const pricingCount = db.prepare('SELECT COUNT(*) as count FROM pricing').get().count;
  if (pricingCount === 0) {
    const jsonPath = path.join(__dirname, 'pricing_database.json');
    if (fs.existsSync(jsonPath)) {
      try {
        const pData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
        const cities = Object.keys(pData.cities || {});
        const rates = pData.rates || {};
        const insertPricing = db.prepare(`
          INSERT OR REPLACE INTO pricing (city, category, material_grade, unit, material_rate, labor_rate)
          VALUES (?, ?, ?, ?, ?, ?)
        `);

        for (const city of cities) {
          const cityConfig = pData.cities[city];
          const matMult = cityConfig.materialMultiplier || 1.0;
          const labMult = cityConfig.laborMultiplier || 1.0;

          for (const [catKey, catVal] of Object.entries(rates)) {
            for (const grade of ['basic', 'standard', 'premium', 'luxury']) {
              const baseRate = catVal[grade] || 100;
              const materialRate = Math.round(baseRate * 0.65 * matMult);
              const laborRate = Math.round(baseRate * 0.35 * labMult);
              const capitalizedGrade = grade.charAt(0).toUpperCase() + grade.slice(1);

              insertPricing.run(
                city,
                catVal.name || catKey,
                capitalizedGrade,
                catVal.unit || 'sq.ft',
                materialRate,
                laborRate
              );
            }
          }
        }
      } catch (e) {
        console.error('Error importing pricing_database.json into SQLite:', e);
      }
    }
  }
}

// Helper Queries for Business OS & Calculations
function getProjectsSummary() {
  const db = getDatabase();
  const projects = db.prepare('SELECT * FROM projects ORDER BY id DESC').all();

  return projects.map(proj => {
    // Total labor cost from attendance
    const laborRow = db.prepare(`
      SELECT COALESCE(SUM(calculated_wage), 0) as total_labor
      FROM attendance WHERE project_id = ?
    `).get(proj.id);

    // Total material cost from material purchases
    const matRow = db.prepare(`
      SELECT COALESCE(SUM(total_cost), 0) as total_materials
      FROM material_purchases WHERE project_id = ?
    `).get(proj.id);

    // Other expenses
    const expRow = db.prepare(`
      SELECT COALESCE(SUM(amount), 0) as total_other
      FROM expenses WHERE project_id = ? AND category NOT IN ('Labor', 'Materials')
    `).get(proj.id);

    // Direct recorded expenses
    const allExpRow = db.prepare(`
      SELECT COALESCE(SUM(amount), 0) as total_expenses
      FROM expenses WHERE project_id = ?
    `).get(proj.id);

    const actualLabor = laborRow.total_labor;
    const actualMaterial = matRow.total_materials;
    const actualOther = expRow.total_other;
    const actualCost = Math.max(actualLabor + actualMaterial + actualOther, allExpRow.total_expenses);
    const remainingBudget = proj.estimated_budget - actualCost;
    const contractVal = proj.contract_value || proj.estimated_budget * 1.25;
    const actualProfit = contractVal - actualCost;
    const profitMargin = contractVal > 0 ? ((actualProfit / contractVal) * 100).toFixed(1) : 0;

    return {
      ...proj,
      financials: {
        contractValue: contractVal,
        estimatedBudget: proj.estimated_budget,
        actualCost,
        remainingBudget,
        actualLabor,
        actualMaterial,
        actualOther,
        actualProfit,
        profitMargin: parseFloat(profitMargin),
        completionPercentage: proj.completion_percentage
      }
    };
  });
}

function getWorkersSummary(filterRole = null, filterProject = null) {
  const db = getDatabase();
  let query = 'SELECT * FROM workers WHERE 1=1';
  const params = [];

  if (filterRole) {
    query += ' AND role = ?';
    params.push(filterRole);
  }
  if (filterProject) {
    query += ' AND assigned_project_id = ?';
    params.push(filterProject);
  }
  query += ' ORDER BY id ASC';

  const workers = db.prepare(query).all(...params);

  return workers.map(w => {
    // Days worked & total earned from attendance
    const attStats = db.prepare(`
      SELECT 
        COUNT(CASE WHEN status IN ('PRESENT', 'HALF DAY') THEN 1 END) as days_worked,
        COALESCE(SUM(regular_hours + overtime_hours), 0) as total_hours,
        COALESCE(SUM(overtime_hours), 0) as total_overtime_hours,
        COALESCE(SUM(calculated_wage), 0) as total_earned
      FROM attendance WHERE worker_id = ?
    `).get(w.id);

    // Total payments made
    const payStats = db.prepare(`
      SELECT 
        COALESCE(SUM(CASE WHEN payment_type = 'Advance' THEN amount ELSE 0 END), 0) as total_advance,
        COALESCE(SUM(amount), 0) as total_paid
      FROM payments WHERE worker_id = ?
    `).get(w.id);

    const totalEarned = attStats.total_earned || 0;
    const totalPaid = payStats.total_paid || 0;
    const balance = totalEarned - totalPaid;

    // Get assigned project name
    let projectName = 'Unassigned';
    if (w.assigned_project_id) {
      const proj = db.prepare('SELECT name FROM projects WHERE id = ?').get(w.assigned_project_id);
      if (proj) projectName = proj.name;
    }

    return {
      ...w,
      projectName,
      daysWorked: attStats.days_worked || 0,
      totalHours: attStats.total_hours || 0,
      totalOvertimeHours: attStats.total_overtime_hours || 0,
      totalEarned,
      totalAdvance: payStats.total_advance || 0,
      totalPaid,
      balance
    };
  });
}

function getBusinessOverviewKPIs() {
  const db = getDatabase();
  const projects = getProjectsSummary();

  const totalContractValue = projects.reduce((acc, p) => acc + (p.financials.contractValue || 0), 0);
  const totalLaborCost = projects.reduce((acc, p) => acc + (p.financials.actualLabor || 0), 0);
  const totalMaterialCost = projects.reduce((acc, p) => acc + (p.financials.actualMaterial || 0), 0);
  const totalActualCost = projects.reduce((acc, p) => acc + (p.financials.actualCost || 0), 0);
  const totalBudget = projects.reduce((acc, p) => acc + (p.financials.estimatedBudget || 0), 0);
  const totalActualProfit = projects.reduce((acc, p) => acc + (p.financials.actualProfit || 0), 0);

  const workers = getWorkersSummary();
  const totalOutstandingWages = workers.reduce((acc, w) => acc + Math.max(0, w.balance), 0);

  const activeProjectsCount = projects.filter(p => p.status === 'Active' || p.status === 'In Progress').length;
  const completedProjectsCount = projects.filter(p => p.status === 'Completed').length;

  return {
    activeProjects: activeProjectsCount,
    completedProjects: completedProjectsCount,
    totalProjects: projects.length,
    totalContractValue,
    totalBudget,
    totalLaborCost,
    totalMaterialCost,
    totalActualCost,
    totalOutstandingWages,
    totalActualProfit,
    budgetVariance: totalBudget - totalActualCost,
    overallProfitMargin: totalContractValue > 0 ? ((totalActualProfit / totalContractValue) * 100).toFixed(1) : 0
  };
}

function parseTargetBudget(budgetRange) {
  if (!budgetRange) return 1500000;
  const str = budgetRange.toString();
  if (str.includes('5–10') || str.includes('5-10')) return 750000;
  if (str.includes('10–20') || str.includes('10-20')) return 1500000;
  if (str.includes('20–40') || str.includes('20-40')) return 3000000;
  if (str.includes('40–75') || str.includes('40-75')) return 5500000;
  if (str.includes('75') || str.includes('above')) return 8500000;
  return 1500000;
}

/**
 * Retrieve closest reference projects for RAG grounding
 * @param {Object} newProject - { roomType, areaSqFt, style, city, budgetRange, changeScope }
 * @param {number} limit - Maximum reference projects to return (default 4)
 */
function getSimilarReferenceProjects(newProject, limit = 4) {
  const db = getDatabase();
  const city = newProject.city || 'Bengaluru';
  const roomType = newProject.roomType || 'Living Room';
  const targetBudget = parseTargetBudget(newProject.budgetRange || newProject.budget);

  const query = `
    SELECT 
      id,
      name,
      city,
      project_type,
      contract_value,
      estimated_budget,
      status,
      notes,
      (CASE WHEN LOWER(city) = LOWER(?) THEN 4 ELSE 0 END) +
      (CASE WHEN LOWER(name) LIKE LOWER(?) OR LOWER(notes) LIKE LOWER(?) THEN 3 ELSE 0 END) +
      (CASE WHEN LOWER(project_type) LIKE LOWER(?) THEN 2 ELSE 0 END) AS match_score
    FROM projects
    WHERE status IN ('Completed', 'Active')
    ORDER BY match_score DESC, ABS(estimated_budget - ?) ASC
    LIMIT ?
  `;

  const typeParam = `%${roomType}%`;
  const projTypeParam = `%${newProject.projectType || 'Interior'}%`;

  let rows = db.prepare(query).all(city, typeParam, typeParam, projTypeParam, targetBudget, limit);

  // If fewer than limit, fetch any other completed projects
  if (rows.length < limit) {
    const existingIds = rows.map(r => r.id);
    const placeholders = existingIds.length > 0 ? existingIds.join(',') : '0';
    const fallbackRows = db.prepare(`
      SELECT id, name, city, project_type, contract_value, estimated_budget, status, notes
      FROM projects
      WHERE status IN ('Completed', 'Active') AND id NOT IN (${placeholders})
      LIMIT ?
    `).all(limit - rows.length);
    rows = rows.concat(fallbackRows);
  }

  return rows.map(r => ({
    project_id: r.id,
    project_name: r.name,
    city: r.city,
    project_type: r.project_type,
    final_cost_inr: r.contract_value || r.estimated_budget,
    scope_and_finishes: r.notes || '',
    status: r.status
  }));
}

module.exports = {
  getDatabase,
  initDatabase,
  getProjectsSummary,
  getWorkersSummary,
  getBusinessOverviewKPIs,
  getSimilarReferenceProjects
};

