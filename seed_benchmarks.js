const { getDatabase } = require('./database');
const db = getDatabase();

const benchmarkProjects = [
  {
    name: 'Prestige Silver Oak Master Living Room',
    client_name: 'Aditya & Priya Nambiar',
    client_email: 'aditya.n@gmail.com',
    client_phone: '+91 98450 33441',
    location: 'Whitefield',
    city: 'Bengaluru',
    project_type: 'Interior',
    start_date: '2025-10-01',
    expected_completion: '2025-12-15',
    contract_value: 1420000,
    estimated_budget: 1280000,
    project_manager_id: 3,
    status: 'Completed',
    completion_percentage: 100,
    notes: '280 sq.ft living room: Italian vitrified floor tiles ₹2.40L; Saint-Gobain gypsum cove with magnetic LED track ₹1.65L; Asian Paints Royale Aspira wall finish ₹1.45L; Fluted acoustic TV console ₹2.90L.'
  },
  {
    name: 'Bandra West Luxury Penthouse Suite',
    client_name: 'Farhan & Zoya Merchant',
    client_email: 'farhan@merchantproperties.in',
    client_phone: '+91 98200 44552',
    location: 'Pali Hill, Bandra West',
    city: 'Mumbai',
    project_type: 'Interior',
    start_date: '2025-08-15',
    expected_completion: '2025-11-20',
    contract_value: 2480000,
    estimated_budget: 2150000,
    project_manager_id: 3,
    status: 'Completed',
    completion_percentage: 100,
    notes: '320 sq.ft master living space: Botticino marble diamond polish ₹4.20L; Level-5 skim coat putty & Venetian stucco ₹2.60L; Hafele concealed joinery & PU wardrobes ₹6.80L; Dimmable COB lighting ₹1.90L.'
  },
  {
    name: 'DLF Cybercity Executive Suite & Lounge',
    client_name: 'Nexus Tech Global Ltd',
    client_email: 'facilities@nexustech.com',
    client_phone: '+91 98110 77889',
    location: 'Cyber City, Phase 2',
    city: 'Delhi NCR',
    project_type: 'Commercial',
    start_date: '2025-11-01',
    expected_completion: '2026-01-25',
    contract_value: 1750000,
    estimated_budget: 1540000,
    project_manager_id: 3,
    status: 'Completed',
    completion_percentage: 100,
    notes: '260 sq.ft: Anti-skid vitrified flooring ₹2.10L; Acoustic grid ceiling ₹1.80L; Smart COB lighting ₹1.30L; Modular kitchen pantry ₹3.80L; Zero-VOC painting ₹1.60L.'
  },
  {
    name: 'Jubilee Hills Master Bedroom Renovation',
    client_name: 'Dr. Suresh & Radhika Reddy',
    client_email: 'suresh.reddy@apollo.org',
    client_phone: '+91 98490 22331',
    location: 'Road No. 36, Jubilee Hills',
    city: 'Hyderabad',
    project_type: 'Interior',
    start_date: '2025-09-10',
    expected_completion: '2025-11-30',
    contract_value: 1260000,
    estimated_budget: 1120000,
    project_manager_id: 3,
    status: 'Completed',
    completion_percentage: 100,
    notes: '210 sq.ft bedroom: Teakwood flooring inlays ₹1.90L; Textured limewash walls ₹1.20L; Full height floor-to-ceiling wardrobes ₹3.90L; Concealed ambient lighting ₹1.10L.'
  },
  {
    name: 'Kalyani Nagar Scandinavian Apartment',
    client_name: 'Vikram Joshi',
    client_email: 'vikram.joshi@tcs.com',
    client_phone: '+91 98220 55667',
    location: 'East Avenue, Kalyani Nagar',
    city: 'Pune',
    project_type: 'Renovation',
    start_date: '2026-01-05',
    expected_completion: '2026-03-15',
    contract_value: 980000,
    estimated_budget: 870000,
    project_manager_id: 3,
    status: 'Completed',
    completion_percentage: 100,
    notes: '240 sq.ft living: Matte porcelain tile flooring ₹1.60L; Gypsum perimeter coves ₹0.95L; Premium acrylic emulsion walls ₹1.10L; Custom storage millwork ₹2.80L.'
  }
];

const insert = db.prepare(`
  INSERT INTO projects (
    name, client_name, client_email, client_phone, location, city,
    project_type, start_date, expected_completion, contract_value,
    estimated_budget, project_manager_id, status, completion_percentage, notes
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

let added = 0;
for (const p of benchmarkProjects) {
  const existing = db.prepare('SELECT id FROM projects WHERE name = ?').get(p.name);
  if (!existing) {
    insert.run(
      p.name, p.client_name, p.client_email, p.client_phone, p.location, p.city,
      p.project_type, p.start_date, p.expected_completion, p.contract_value,
      p.estimated_budget, p.project_manager_id, p.status, p.completion_percentage, p.notes
    );
    added++;
  }
}

console.log('Seeded benchmark reference projects:', added);
