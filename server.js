const http = require('http');
const fs = require('fs');
const path = require('path');
const { analyzeAndGenerate } = require('./ai_service');
const { loadPricingDatabase, calculateProjectEstimate } = require('./cost_engine');
const { processAgentChat, loadAgentConfig, saveAgentConfig } = require('./agent_service');
const {
  getDatabase,
  initDatabase,
  getProjectsSummary,
  getWorkersSummary,
  getBusinessOverviewKPIs
} = require('./database');
const { processProjectAiQuery } = require('./project_ai');

// Ensure database is initialized
initDatabase();

const PORT = process.env.PORT || 3000;
const DATA_DIR = process.env.VERCEL ? '/tmp' : __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.mp4': 'video/mp4',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf'
};

function readJsonBody(req, maxBytes = 12 * 1024 * 1024) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
      if (body.length > maxBytes) {
        req.destroy();
        reject(new Error('Payload too large'));
      }
    });
    req.on('end', () => {
      try {
        resolve(JSON.parse(body || '{}'));
      } catch (err) {
        reject(err);
      }
    });
    req.on('error', reject);
  });
}

function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
}

const server = http.createServer(async (req, res) => {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-User-Role');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const host = req.headers.host || `localhost:${PORT}`;
  const parsedUrl = new URL(req.url, `http://${host}`);
  const pathname = parsedUrl.pathname;
  const db = getDatabase();

  // ==========================================
  // 1. PUBLIC AI DESIGN STUDIO & ESTIMATION
  // ==========================================
  if (pathname === '/api/ai-design/analyze' && req.method === 'POST') {
    try {
      const inputs = await readJsonBody(req);
      const result = await analyzeAndGenerate(inputs);
      return sendJson(res, 200, result);
    } catch (err) {
      console.error('Error in /api/ai-design/analyze:', err);
      return sendJson(res, 500, {
        success: false,
        error: 'Architectural analysis error. Please ensure the image is a valid room photo.'
      });
    }
  }

  // ==========================================
  // 2. LEAD CONVERSION -> CREATES DB PROJECT
  // ==========================================
  if (pathname === '/api/consultation' && req.method === 'POST') {
    try {
      const lead = await readJsonBody(req);
      lead.timestamp = new Date().toISOString();

      // 1. Save to leads.json for record
      const leadsFile = path.join(DATA_DIR, 'leads.json');
      let existingLeads = [];
      if (fs.existsSync(leadsFile)) {
        try { existingLeads = JSON.parse(fs.readFileSync(leadsFile, 'utf8')); } catch (e) {}
      }
      existingLeads.push(lead);
      fs.writeFileSync(leadsFile, JSON.stringify(existingLeads, null, 2), 'utf8');

      // 2. Convert directly into an unassigned project in SQLite database!
      const projectName = lead.projectName || (lead.aiDesignData ? `${lead.aiDesignData.roomType || 'Interior'} - ${lead.name || 'Client'}` : `Project for ${lead.name || 'New Client'}`);
      const estBudget = lead.aiDesignData?.estimateExpected
        ? parseFloat(lead.aiDesignData.estimateExpected.replace(/[^0-9.]/g, '')) * 100000 || 500000
        : 500000;
      const contractVal = Math.round(estBudget * 1.2);
      const startDate = new Date().toISOString().split('T')[0];
      const completionDate = new Date(Date.now() + 60 * 86400000).toISOString().split('T')[0];

      const insertProj = db.prepare(`
        INSERT INTO projects (
          name, client_name, client_email, client_phone, location, city,
          project_type, start_date, expected_completion, contract_value,
          estimated_budget, status, notes
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      const clientCity = lead.city || (lead.aiDesignData && lead.aiDesignData.city) || 'Bengaluru';
      const projectType = lead.projectType || 'Interior';

      const result = insertProj.run(
        projectName,
        lead.name || 'Website Lead',
        lead.email || '',
        lead.phone || '',
        lead.address || clientCity,
        clientCity,
        projectType,
        startDate,
        completionDate,
        contractVal,
        estBudget,
        'Planning',
        `Lead created via AI Design Studio consultation. Notes: ${lead.notes || 'None'}. Estimate: ${lead.aiDesignData?.estimateExpected || 'N/A'}`
      );

      // Also record in audit log
      db.prepare(`
        INSERT INTO audit_logs (user_name, action, entity_type, entity_id, details)
        VALUES (?, ?, ?, ?, ?)
      `).run('System', 'CONVERT_LEAD_TO_PROJECT', 'projects', Number(result.lastInsertRowid), `Lead from ${lead.name} converted to Project #${result.lastInsertRowid}`);

      return sendJson(res, 200, {
        success: true,
        projectId: Number(result.lastInsertRowid),
        message: 'Consultation request received! Project created in Construction Management OS.'
      });
    } catch (e) {
      console.error('Error in /api/consultation:', e);
      return sendJson(res, 500, { success: false, error: e.message });
    }
  }

  // ==========================================
  // 3. CONSTRUCTION OS: OVERVIEW & USERS
  // ==========================================
  if (pathname === '/api/portal/overview' && req.method === 'GET') {
    try {
      const kpis = getBusinessOverviewKPIs();
      return sendJson(res, 200, { success: true, kpis });
    } catch (e) {
      return sendJson(res, 500, { success: false, error: e.message });
    }
  }

  if (pathname === '/api/portal/users' && req.method === 'GET') {
    try {
      const users = db.prepare('SELECT id, username, full_name, email, role, phone FROM users ORDER BY id ASC').all();
      return sendJson(res, 200, { success: true, users });
    } catch (e) {
      return sendJson(res, 500, { success: false, error: e.message });
    }
  }

  // ==========================================
  // 4. CONSTRUCTION OS: PROJECTS (CRUD)
  // ==========================================
  if (pathname === '/api/portal/projects' && req.method === 'GET') {
    try {
      const projects = getProjectsSummary();
      return sendJson(res, 200, { success: true, projects });
    } catch (e) {
      return sendJson(res, 500, { success: false, error: e.message });
    }
  }

  if (pathname === '/api/portal/projects' && req.method === 'POST') {
    try {
      const data = await readJsonBody(req);
      const insert = db.prepare(`
        INSERT INTO projects (
          name, client_name, client_email, client_phone, location, city,
          project_type, start_date, expected_completion, contract_value,
          estimated_budget, project_manager_id, status, completion_percentage, notes
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      const result = insert.run(
        data.name,
        data.client_name,
        data.client_email || '',
        data.client_phone || '',
        data.location || '',
        data.city || 'Bengaluru',
        data.project_type || 'Residential',
        data.start_date || new Date().toISOString().split('T')[0],
        data.expected_completion || new Date(Date.now() + 90 * 86400000).toISOString().split('T')[0],
        parseFloat(data.contract_value) || 0,
        parseFloat(data.estimated_budget) || 0,
        parseInt(data.project_manager_id, 10) || null,
        data.status || 'Active',
        parseFloat(data.completion_percentage) || 0,
        data.notes || ''
      );

      return sendJson(res, 200, {
        success: true,
        projectId: Number(result.lastInsertRowid),
        message: 'Project created successfully.'
      });
    } catch (e) {
      return sendJson(res, 500, { success: false, error: e.message });
    }
  }

  if (pathname.startsWith('/api/portal/projects/') && req.method === 'GET') {
    const id = pathname.split('/')[4];
    try {
      const projects = getProjectsSummary();
      const project = projects.find(p => p.id == id);
      if (!project) return sendJson(res, 404, { success: false, error: 'Project not found' });

      // Fetch related records
      const workItems = db.prepare('SELECT * FROM work_items WHERE project_id = ? ORDER BY id DESC').all(id);
      const workers = db.prepare(`
        SELECT w.* FROM workers w
        WHERE w.assigned_project_id = ?
        ORDER BY w.id ASC
      `).all(id);
      const attendance = db.prepare(`
        SELECT a.*, w.worker_name, w.role
        FROM attendance a
        JOIN workers w ON a.worker_id = w.id
        WHERE a.project_id = ?
        ORDER BY a.date DESC LIMIT 30
      `).all(id);
      const materialPurchases = db.prepare('SELECT * FROM material_purchases WHERE project_id = ? ORDER BY date DESC').all(id);
      const expenses = db.prepare('SELECT * FROM expenses WHERE project_id = ? ORDER BY date DESC').all(id);
      const dailyReports = db.prepare('SELECT * FROM daily_reports WHERE project_id = ? ORDER BY date DESC').all(id);

      return sendJson(res, 200, {
        success: true,
        project,
        workItems,
        workers,
        attendance,
        materialPurchases,
        expenses,
        dailyReports
      });
    } catch (e) {
      return sendJson(res, 500, { success: false, error: e.message });
    }
  }

  // ==========================================
  // 5. CONSTRUCTION OS: WORKFORCE (CRUD)
  // ==========================================
  if (pathname === '/api/portal/workers' && req.method === 'GET') {
    try {
      const role = parsedUrl.searchParams.get('role');
      const project = parsedUrl.searchParams.get('project');
      const workers = getWorkersSummary(role, project);
      return sendJson(res, 200, { success: true, workers });
    } catch (e) {
      return sendJson(res, 500, { success: false, error: e.message });
    }
  }

  if (pathname === '/api/portal/workers' && req.method === 'POST') {
    try {
      const data = await readJsonBody(req);
      const nextCode = 'WRK-' + String(Math.floor(100 + Math.random() * 900));

      const insert = db.prepare(`
        INSERT INTO workers (
          worker_name, worker_code, role, phone, skill_level,
          daily_wage, hourly_wage, joining_date, assigned_project_id, assigned_work, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      const daily = parseFloat(data.daily_wage) || 800;
      const hourly = parseFloat(data.hourly_wage) || Math.round(daily / 8);

      const result = insert.run(
        data.worker_name,
        data.worker_code || nextCode,
        data.role || 'Painter',
        data.phone || '',
        data.skill_level || 'Skilled',
        daily,
        hourly,
        data.joining_date || new Date().toISOString().split('T')[0],
        parseInt(data.assigned_project_id, 10) || null,
        data.assigned_work || '',
        data.status || 'Active'
      );

      return sendJson(res, 200, {
        success: true,
        workerId: Number(result.lastInsertRowid),
        message: 'Worker registered successfully.'
      });
    } catch (e) {
      return sendJson(res, 500, { success: false, error: e.message });
    }
  }

  // ==========================================
  // 6. CONSTRUCTION OS: ATTENDANCE & WAGES
  // ==========================================
  if (pathname === '/api/portal/attendance' && req.method === 'GET') {
    try {
      const date = parsedUrl.searchParams.get('date');
      const projectId = parsedUrl.searchParams.get('project_id');

      let query = `
        SELECT a.*, w.worker_name, w.worker_code, w.role, p.name as project_name
        FROM attendance a
        JOIN workers w ON a.worker_id = w.id
        JOIN projects p ON a.project_id = p.id
        WHERE 1=1
      `;
      const params = [];
      if (date) { query += ' AND a.date = ?'; params.push(date); }
      if (projectId) { query += ' AND a.project_id = ?'; params.push(projectId); }
      query += ' ORDER BY a.date DESC, a.id DESC LIMIT 100';

      const records = db.prepare(query).all(...params);
      return sendJson(res, 200, { success: true, attendance: records });
    } catch (e) {
      return sendJson(res, 500, { success: false, error: e.message });
    }
  }

  if (pathname === '/api/portal/attendance' && req.method === 'POST') {
    try {
      const data = await readJsonBody(req);
      const worker = db.prepare('SELECT daily_wage, hourly_wage FROM workers WHERE id = ?').get(data.worker_id);
      if (!worker) return sendJson(res, 404, { success: false, error: 'Worker not found' });

      const status = data.status || 'PRESENT';
      const regHours = status === 'PRESENT' ? 8 : (status === 'HALF DAY' ? 4 : 0);
      const otHours = parseFloat(data.overtime_hours) || 0;

      // Overtime configurable rule: 1.5x multiplier on hourly rate
      const otRate = (worker.hourly_wage || 100) * 1.5;

      let calcWage = 0;
      if (status === 'PRESENT') {
        calcWage = worker.daily_wage + (otHours * otRate);
      } else if (status === 'HALF DAY') {
        calcWage = (worker.daily_wage / 2) + (otHours * otRate);
      }

      const upsert = db.prepare(`
        INSERT INTO attendance (
          date, worker_id, project_id, status, regular_hours,
          overtime_hours, daily_wage_rate, overtime_rate, calculated_wage, work_completed
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(date, worker_id, project_id) DO UPDATE SET
          status = excluded.status,
          regular_hours = excluded.regular_hours,
          overtime_hours = excluded.overtime_hours,
          calculated_wage = excluded.calculated_wage,
          work_completed = excluded.work_completed
      `);

      upsert.run(
        data.date || new Date().toISOString().split('T')[0],
        data.worker_id,
        data.project_id,
        status,
        regHours,
        otHours,
        worker.daily_wage,
        otRate,
        calcWage,
        data.work_completed || ''
      );

      return sendJson(res, 200, {
        success: true,
        calculatedWage: calcWage,
        message: 'Attendance & wage calculated successfully.'
      });
    } catch (e) {
      return sendJson(res, 500, { success: false, error: e.message });
    }
  }

  // ==========================================
  // 7. CONSTRUCTION OS: WORK ITEMS (TASKS)
  // ==========================================
  if (pathname === '/api/portal/work-items' && req.method === 'GET') {
    try {
      const projectId = parsedUrl.searchParams.get('project_id');
      let query = `
        SELECT w.*, p.name as project_name
        FROM work_items w
        JOIN projects p ON w.project_id = p.id
      `;
      const params = [];
      if (projectId) {
        query += ' WHERE w.project_id = ?';
        params.push(projectId);
      }
      query += ' ORDER BY w.id DESC';
      const items = db.prepare(query).all(...params);
      return sendJson(res, 200, { success: true, workItems: items });
    } catch (e) {
      return sendJson(res, 500, { success: false, error: e.message });
    }
  }

  if (pathname === '/api/portal/work-items' && req.method === 'POST') {
    try {
      const data = await readJsonBody(req);
      const code = 'WI-' + String(Math.floor(100 + Math.random() * 900));

      const insert = db.prepare(`
        INSERT INTO work_items (
          project_id, item_code, title, description, assigned_worker_ids,
          start_date, deadline, estimated_labor, actual_labor, completion_percentage, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      const result = insert.run(
        data.project_id,
        data.item_code || code,
        data.title,
        data.description || '',
        JSON.stringify(data.assigned_worker_ids || []),
        data.start_date || new Date().toISOString().split('T')[0],
        data.deadline || new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
        parseFloat(data.estimated_labor) || 0,
        parseFloat(data.actual_labor) || 0,
        parseInt(data.completion_percentage, 10) || 0,
        data.status || 'NOT STARTED'
      );

      return sendJson(res, 200, {
        success: true,
        itemId: Number(result.lastInsertRowid),
        message: 'Work item created successfully.'
      });
    } catch (e) {
      return sendJson(res, 500, { success: false, error: e.message });
    }
  }

  if (pathname.startsWith('/api/portal/work-items/') && req.method === 'PUT') {
    const id = pathname.split('/')[4];
    try {
      const data = await readJsonBody(req);
      db.prepare(`
        UPDATE work_items
        SET completion_percentage = ?, status = ?, actual_labor = ?
        WHERE id = ?
      `).run(
        parseInt(data.completion_percentage, 10) || 0,
        data.status || 'IN PROGRESS',
        parseFloat(data.actual_labor) || 0,
        id
      );
      return sendJson(res, 200, { success: true, message: 'Work item updated.' });
    } catch (e) {
      return sendJson(res, 500, { success: false, error: e.message });
    }
  }

  // ==========================================
  // 8. CONSTRUCTION OS: PAYMENTS (SETTLEMENT)
  // ==========================================
  if (pathname === '/api/portal/payments' && req.method === 'GET') {
    try {
      const workerId = parsedUrl.searchParams.get('worker_id');
      let query = `
        SELECT p.*, w.worker_name, w.worker_code, w.role, proj.name as project_name
        FROM payments p
        JOIN workers w ON p.worker_id = w.id
        LEFT JOIN projects proj ON p.project_id = proj.id
      `;
      const params = [];
      if (workerId) {
        query += ' WHERE p.worker_id = ?';
        params.push(workerId);
      }
      query += ' ORDER BY p.date DESC, p.id DESC';
      const payments = db.prepare(query).all(...params);
      return sendJson(res, 200, { success: true, payments });
    } catch (e) {
      return sendJson(res, 500, { success: false, error: e.message });
    }
  }

  if (pathname === '/api/portal/payments' && req.method === 'POST') {
    try {
      const data = await readJsonBody(req);
      const insert = db.prepare(`
        INSERT INTO payments (worker_id, project_id, amount, date, payment_type, notes, recorded_by_user_id)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `);

      const result = insert.run(
        data.worker_id,
        data.project_id || null,
        parseFloat(data.amount) || 0,
        data.date || new Date().toISOString().split('T')[0],
        data.payment_type || 'Wage',
        data.notes || '',
        data.recorded_by_user_id || 1
      );

      // Return updated balance for worker
      const workerSummary = getWorkersSummary().find(w => w.id == data.worker_id);

      return sendJson(res, 200, {
        success: true,
        paymentId: Number(result.lastInsertRowid),
        newBalance: workerSummary ? workerSummary.balance : 0,
        message: 'Payment recorded. Worker balance updated.'
      });
    } catch (e) {
      return sendJson(res, 500, { success: false, error: e.message });
    }
  }

  // ==========================================
  // 9. CONSTRUCTION OS: MATERIALS & PURCHASES
  // ==========================================
  if (pathname === '/api/portal/materials' && req.method === 'GET') {
    try {
      const projectId = parsedUrl.searchParams.get('project_id');
      let query = `
        SELECT mp.*, p.name as project_name
        FROM material_purchases mp
        JOIN projects p ON mp.project_id = p.id
      `;
      const params = [];
      if (projectId) {
        query += ' WHERE mp.project_id = ?';
        params.push(projectId);
      }
      query += ' ORDER BY mp.date DESC, mp.id DESC';
      const purchases = db.prepare(query).all(...params);
      return sendJson(res, 200, { success: true, materialPurchases: purchases });
    } catch (e) {
      return sendJson(res, 500, { success: false, error: e.message });
    }
  }

  if (pathname === '/api/portal/materials' && req.method === 'POST') {
    try {
      const data = await readJsonBody(req);
      const qty = parseFloat(data.quantity) || 1;
      const unitCost = parseFloat(data.unit_cost) || 0;
      const total = qty * unitCost;

      const insert = db.prepare(`
        INSERT INTO material_purchases (
          project_id, material_name, category, quantity, unit,
          unit_cost, total_cost, supplier, date, invoice_no, notes
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      const result = insert.run(
        data.project_id,
        data.material_name,
        data.category || 'Flooring',
        qty,
        data.unit || 'sq.ft',
        unitCost,
        total,
        data.supplier || '',
        data.date || new Date().toISOString().split('T')[0],
        data.invoice_no || '',
        data.notes || ''
      );

      return sendJson(res, 200, {
        success: true,
        purchaseId: Number(result.lastInsertRowid),
        totalCost: total,
        message: 'Material purchase recorded.'
      });
    } catch (e) {
      return sendJson(res, 500, { success: false, error: e.message });
    }
  }

  // ==========================================
  // 10. CONSTRUCTION OS: EXPENSES
  // ==========================================
  if (pathname === '/api/portal/expenses' && req.method === 'GET') {
    try {
      const projectId = parsedUrl.searchParams.get('project_id');
      let query = `
        SELECT e.*, p.name as project_name
        FROM expenses e
        JOIN projects p ON e.project_id = p.id
      `;
      const params = [];
      if (projectId) {
        query += ' WHERE e.project_id = ?';
        params.push(projectId);
      }
      query += ' ORDER BY e.date DESC, e.id DESC';
      const expenses = db.prepare(query).all(...params);
      return sendJson(res, 200, { success: true, expenses });
    } catch (e) {
      return sendJson(res, 500, { success: false, error: e.message });
    }
  }

  if (pathname === '/api/portal/expenses' && req.method === 'POST') {
    try {
      const data = await readJsonBody(req);
      const insert = db.prepare(`
        INSERT INTO expenses (project_id, category, description, amount, date, vendor, payment_method, receipt_url)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `);

      const result = insert.run(
        data.project_id,
        data.category || 'Miscellaneous',
        data.description,
        parseFloat(data.amount) || 0,
        data.date || new Date().toISOString().split('T')[0],
        data.vendor || '',
        data.payment_method || 'Bank Transfer',
        data.receipt_url || ''
      );

      return sendJson(res, 200, {
        success: true,
        expenseId: Number(result.lastInsertRowid),
        message: 'Project expense recorded.'
      });
    } catch (e) {
      return sendJson(res, 500, { success: false, error: e.message });
    }
  }

  // ==========================================
  // 11. CONSTRUCTION OS: DAILY SITE REPORTS
  // ==========================================
  if (pathname === '/api/portal/reports' && req.method === 'GET') {
    try {
      const projectId = parsedUrl.searchParams.get('project_id');
      let query = `
        SELECT r.*, p.name as project_name
        FROM daily_reports r
        JOIN projects p ON r.project_id = p.id
      `;
      const params = [];
      if (projectId) {
        query += ' WHERE r.project_id = ?';
        params.push(projectId);
      }
      query += ' ORDER BY r.date DESC, r.id DESC';
      const reports = db.prepare(query).all(...params);
      return sendJson(res, 200, { success: true, reports });
    } catch (e) {
      return sendJson(res, 500, { success: false, error: e.message });
    }
  }

  if (pathname === '/api/portal/reports' && req.method === 'POST') {
    try {
      const data = await readJsonBody(req);
      const photos = Array.isArray(data.photos) ? JSON.stringify(data.photos) : '[]';

      const insert = db.prepare(`
        INSERT INTO daily_reports (
          project_id, date, workers_present_count, work_completed,
          materials_used, problems, safety_issues, photos_json,
          ai_observations, supervisor_name, notes
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      const result = insert.run(
        data.project_id,
        data.date || new Date().toISOString().split('T')[0],
        parseInt(data.workers_present_count, 10) || 0,
        data.work_completed,
        data.materials_used || '',
        data.problems || 'None',
        data.safety_issues || 'Zero incidents reported',
        photos,
        data.ai_observations || 'AI Note: Daily craft progress recorded in database.',
        data.supervisor_name || 'Ramesh Patel',
        data.notes || ''
      );

      return sendJson(res, 200, {
        success: true,
        reportId: Number(result.lastInsertRowid),
        message: 'Daily site report recorded successfully.'
      });
    } catch (e) {
      return sendJson(res, 500, { success: false, error: e.message });
    }
  }

  // ==========================================
  // 12. CONSTRUCTION OS: AI PROJECT ASSISTANT
  // ==========================================
  if (pathname === '/api/portal/ai-assistant' && req.method === 'POST') {
    try {
      const payload = await readJsonBody(req);
      const response = processProjectAiQuery(payload.query, payload.project_id);
      return sendJson(res, 200, { success: true, ...response });
    } catch (e) {
      return sendJson(res, 500, { success: false, error: e.message });
    }
  }

  // ==========================================
  // 13. PRICING DATABASE API
  // ==========================================
  if (pathname === '/api/admin/pricing' && req.method === 'GET') {
    try {
      const pDb = loadPricingDatabase();
      return sendJson(res, 200, { success: true, database: pDb });
    } catch (e) {
      return sendJson(res, 500, { success: false, error: e.message });
    }
  }

  if (pathname === '/api/admin/pricing' && req.method === 'POST') {
    try {
      const payload = await readJsonBody(req);
      if (payload.database) {
        fs.writeFileSync(path.join(DATA_DIR, 'pricing_database.json'), JSON.stringify(payload.database, null, 2), 'utf8');
        return sendJson(res, 200, { success: true, message: 'Pricing database updated.' });
      }
      return sendJson(res, 400, { success: false, error: 'Invalid database payload' });
    } catch (e) {
      return sendJson(res, 500, { success: false, error: e.message });
    }
  }

  // 14. Static File Serving with Byte Range Support for Videos
  let reqUrl = pathname;
  if (reqUrl === '/stack-spread') reqUrl = '/stack-spread.html';
  if (reqUrl === '/intake' || reqUrl === '/ai' || reqUrl === '/ai-intake') reqUrl = '/ai-intake.html';
  if (reqUrl === '/os' || reqUrl === '/construction-os' || reqUrl === '/operational-clarity' || reqUrl === '/portal') reqUrl = '/construction-os.html';
  let filePath = path.join(__dirname, reqUrl === '/' ? 'index.html' : reqUrl);
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'text/plain';

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      return res.end('Not Found');
    }

    const range = req.headers.range;
    if (ext === '.mp4' && range) {
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : stats.size - 1;
      const chunksize = (end - start) + 1;
      const file = fs.createReadStream(filePath, { start, end });
      res.writeHead(206, {
        'Content-Range': `bytes ${start}-${end}/${stats.size}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': contentType,
      });
      file.pipe(res);
      return;
    }

    res.writeHead(200, {
      'Content-Length': stats.size,
      'Content-Type': contentType,
      'Accept-Ranges': 'bytes'
    });
    fs.createReadStream(filePath).pipe(res);
  });
});

if (require.main === module) {
  server.listen(PORT, () => {
    console.log('Sweety Colour Decora AI Platform & Construction OS running on http://localhost:' + PORT);
  });
}

module.exports = server;
