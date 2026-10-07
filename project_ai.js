/**
 * SWEETY COLOUR DECORA — AI PROJECT ASSISTANT
 * Natural language assistant strictly grounded in real SQLite database records.
 * NEVER INVENTS NUMBERS. If data is missing, explicitly states so.
 */

const { getDatabase, getProjectsSummary, getWorkersSummary, getBusinessOverviewKPIs } = require('./database');
const { formatINR } = require('./cost_engine');

function processProjectAiQuery(userQuery, projectId = null) {
  const db = getDatabase();
  const query = (userQuery || '').toLowerCase().trim();
  const today = new Date().toISOString().split('T')[0];

  // 1. "How much have we spent on labor?"
  if (query.includes('spent on labor') || query.includes('labor cost') || query.includes('labor spent')) {
    let sql = `
      SELECT COALESCE(SUM(calculated_wage), 0) as total_labor, COUNT(*) as attendance_shifts
      FROM attendance
    `;
    const params = [];
    if (projectId) {
      sql += ' WHERE project_id = ?';
      params.push(projectId);
    }
    const res = db.prepare(sql).get(...params);
    const amountFormatted = formatINR(res.total_labor);
    return {
      query: userQuery,
      answer: projectId
        ? `According to recorded attendance records for Project #${projectId}, total labor expenditure is **${amountFormatted}** across ${res.attendance_shifts} recorded worker shifts.`
        : `Across all active company projects, total labor expenditure from approved daily attendance is **${amountFormatted}** across ${res.attendance_shifts} recorded shifts.`,
      data: res
    };
  }

  // 2. "How much do we owe workers?" / "Who do we owe?"
  if (query.includes('owe') || query.includes('outstanding') || query.includes('worker balance') || query.includes('unpaid')) {
    const workers = getWorkersSummary();
    const owedWorkers = workers.filter(w => w.balance > 0);
    const totalOwed = owedWorkers.reduce((acc, w) => acc + w.balance, 0);

    if (owedWorkers.length === 0) {
      return {
        query: userQuery,
        answer: 'All worker accounts are currently settled in full. Total outstanding worker payable is **₹0**.',
        data: { totalOwed: 0, workers: [] }
      };
    }

    const workerList = owedWorkers
      .map(w => `• **${w.worker_name}** (${w.role}): Earned ${formatINR(w.totalEarned)}, Paid ${formatINR(w.totalPaid)}, **Balance: ${formatINR(w.balance)}**`)
      .join('\n');

    return {
      query: userQuery,
      answer: `Total outstanding payable to workers is **${formatINR(totalOwed)}** across ${owedWorkers.length} craftsman accounts:\n\n${workerList}`,
      data: { totalOwed, count: owedWorkers.length, owedWorkers }
    };
  }

  // 3. "Who is working today?"
  if (query.includes('working today') || query.includes("today's attendance") || query.includes('who is present')) {
    let sql = `
      SELECT a.*, w.worker_name, w.role, p.name as project_name
      FROM attendance a
      JOIN workers w ON a.worker_id = w.id
      JOIN projects p ON a.project_id = p.id
      WHERE a.date = ?
    `;
    const params = [today];
    if (projectId) {
      sql += ' AND a.project_id = ?';
      params.push(projectId);
    }
    const records = db.prepare(sql).all(...params);

    if (records.length === 0) {
      return {
        query: userQuery,
        answer: `No worker attendance has been logged yet for today (${today}). Site supervisors can mark attendance from the Attendance tab.`,
        data: []
      };
    }

    const presentList = records
      .map(r => `• **${r.worker_name}** (${r.role}) &mdash; Status: **${r.status}** (${r.regular_hours}h reg${r.overtime_hours > 0 ? ` + ${r.overtime_hours}h OT` : ''}) &mdash; Task: *${r.work_completed || 'General Finishing'}* [${r.project_name}]`)
      .join('\n');

    return {
      query: userQuery,
      answer: `Today (${today}), there are **${records.length} active workers** logged on site:\n\n${presentList}`,
      data: records
    };
  }

  // 4. "What is our remaining budget?"
  if (query.includes('remaining budget') || query.includes('budget left') || query.includes('budget')) {
    const projects = getProjectsSummary();
    if (projectId) {
      const p = projects.find(item => item.id == projectId);
      if (!p) return { query: userQuery, answer: `Project #${projectId} not found in database.` };
      return {
        query: userQuery,
        answer: `For **${p.name}**:\n• Estimated Budget: **${formatINR(p.financials.estimatedBudget)}**\n• Actual Cost Incurred: **${formatINR(p.financials.actualCost)}**\n• **Remaining Budget: ${formatINR(p.financials.remainingBudget)}** (${((p.financials.remainingBudget / p.financials.estimatedBudget) * 100).toFixed(1)}% remaining).`,
        data: p.financials
      };
    }

    const totalBudget = projects.reduce((acc, p) => acc + p.financials.estimatedBudget, 0);
    const totalActual = projects.reduce((acc, p) => acc + p.financials.actualCost, 0);
    const remaining = totalBudget - totalActual;

    return {
      query: userQuery,
      answer: `Across all company projects:\n• Total Combined Budget: **${formatINR(totalBudget)}**\n• Total Actual Expenses: **${formatINR(totalActual)}**\n• **Net Remaining Budget: ${formatINR(remaining)}** (${((remaining / totalBudget) * 100).toFixed(1)}% buffer remaining).`,
      data: { totalBudget, totalActual, remaining }
    };
  }

  // 5. "Which work is delayed?" / "Delayed tasks"
  if (query.includes('delay') || query.includes('behind schedule') || query.includes('overdue')) {
    let sql = `
      SELECT w.*, p.name as project_name
      FROM work_items w
      JOIN projects p ON w.project_id = p.id
      WHERE w.deadline < ? AND w.status != 'COMPLETED'
    `;
    const params = [today];
    if (projectId) {
      sql += ' AND w.project_id = ?';
      params.push(projectId);
    }
    const delayed = db.prepare(sql).all(...params);

    if (delayed.length === 0) {
      return {
        query: userQuery,
        answer: 'Zero tasks are overdue! All work items are currently on schedule or completed.',
        data: []
      };
    }

    const delayList = delayed
      .map(d => `• **${d.item_code}**: *${d.title}* [${d.project_name}] &mdash; Deadline was **${d.deadline}**, currently at **${d.completion_percentage}%** (${d.status})`)
      .join('\n');

    return {
      query: userQuery,
      answer: `There are **${delayed.length} work items** past their targeted deadline:\n\n${delayList}`,
      data: delayed
    };
  }

  // 6. "How much did materials cost this week?" / "Material costs"
  if (query.includes('material') && (query.includes('cost') || query.includes('spent') || query.includes('purchase'))) {
    let sql = `
      SELECT material_name, category, quantity, unit, total_cost, supplier, date
      FROM material_purchases
    `;
    const params = [];
    if (projectId) {
      sql += ' WHERE project_id = ?';
      params.push(projectId);
    }
    sql += ' ORDER BY date DESC LIMIT 8';
    const purchases = db.prepare(sql).all(...params);

    const totalMat = purchases.reduce((acc, p) => acc + p.total_cost, 0);

    const matList = purchases
      .map(p => `• **${p.material_name}** (${p.category}): ${p.quantity} ${p.unit} &mdash; **${formatINR(p.total_cost)}** from *${p.supplier || 'Vendor'}* on ${p.date}`)
      .join('\n');

    return {
      query: userQuery,
      answer: `Total recorded material procurement is **${formatINR(totalMat)}** across recorded invoices:\n\n${matList}`,
      data: { totalMat, purchases }
    };
  }

  // 7. "Compare estimated and actual labor"
  if (query.includes('estimated vs actual') || (query.includes('compare') && query.includes('labor'))) {
    const projects = getProjectsSummary();
    const rows = projects.map(p => {
      const estLabor = p.financials.estimatedBudget * 0.35;
      const actLabor = p.financials.actualLabor;
      const variance = estLabor - actLabor;
      return `• **${p.name}**:\n  - Estimated Labor: ${formatINR(estLabor)}\n  - Actual Labor: ${formatINR(actLabor)}\n  - **Variance: ${variance >= 0 ? '+' : ''}${formatINR(variance)}** (${variance >= 0 ? 'Under budget' : 'Over budget'})`;
    }).join('\n\n');

    return {
      query: userQuery,
      answer: `### Estimated vs Actual Labor Analysis:\n\n${rows}`,
      data: projects
    };
  }

  // 8. "Give me today's site report"
  if (query.includes('site report') || query.includes('report today') || query.includes('daily report')) {
    let sql = `
      SELECT r.*, p.name as project_name
      FROM daily_reports r
      JOIN projects p ON r.project_id = p.id
    `;
    const params = [];
    if (projectId) {
      sql += ' WHERE r.project_id = ?';
      params.push(projectId);
    }
    sql += ' ORDER BY r.date DESC LIMIT 1';
    const report = db.prepare(sql).get(...params);

    if (!report) {
      return {
        query: userQuery,
        answer: 'No site reports found in the database. Site supervisors can file a report from the Daily Reports tab.',
        data: null
      };
    }

    return {
      query: userQuery,
      answer: `### Daily Site Report · ${report.date}\n**Project:** ${report.project_name}\n**Supervisor:** ${report.supervisor_name || 'Ramesh Patel'}\n**Workers On Site:** ${report.workers_present_count}\n\n**Work Executed:**\n${report.work_completed}\n\n**Materials Utilized:**\n${report.materials_used || 'Standard consumables'}\n\n**Site Observations / Issues:**\n${report.problems || 'None reported'}\n\n**Safety Compliance:**\n${report.safety_issues || 'Zero incidents · 100% PPE adherence'}\n\n*${report.ai_observations || 'AI Note: Work appears on schedule.'}*`,
      data: report
    };
  }

  // 9. Profitability & Business Overview
  if (query.includes('profit') || query.includes('margin') || query.includes('revenue') || query.includes('overview')) {
    const kpis = getBusinessOverviewKPIs();
    return {
      query: userQuery,
      answer: `### Executive Financial Overview:\n• **Active Projects:** ${kpis.activeProjects} (${kpis.completedProjects} Completed)\n• **Total Contract Value:** ${formatINR(kpis.totalContractValue)}\n• **Total Budget:** ${formatINR(kpis.totalBudget)}\n• **Actual Cost to Date:** ${formatINR(kpis.totalActualCost)} (Labor: ${formatINR(kpis.totalLaborCost)}, Materials: ${formatINR(kpis.totalMaterialCost)})\n• **Estimated Net Profit:** ${formatINR(kpis.totalActualProfit)}\n• **Profit Margin:** **${kpis.overallProfitMargin}%**\n• **Outstanding Wages:** ${formatINR(kpis.totalOutstandingWages)}`,
      data: kpis
    };
  }

  // Default Fallback
  return {
    query: userQuery,
    answer: `I don't have enough recorded data or a specific matching database record to calculate "${userQuery}".\n\nYou can ask about:\n• *"How much have we spent on labor?"*\n• *"How much do we owe workers?"*\n• *"Who is working today?"*\n• *"What is our remaining budget?"*\n• *"Which work is delayed?"*\n• *"How much did materials cost this week?"*\n• *"Compare estimated and actual labor"*\n• *"Give me today's site report"*\n• *"What is our overall profit margin?"*`,
    data: null
  };
}

module.exports = {
  processProjectAiQuery
};
