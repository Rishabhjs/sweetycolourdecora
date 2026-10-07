const fs = require('fs');

const noticeHtml = `            <!-- Prominent Approximate AI Estimation Notice Box -->
            <div class="ai-approximate-notice-box" id="aiApproximateNoticeBox" style="margin-bottom: 20px; padding: 14px 18px; border-radius: 6px; background: rgba(201, 136, 56, 0.12); border: 1px solid rgba(201, 136, 56, 0.35); display: flex; align-items: flex-start; gap: 12px;">
              <div style="font-size: 1.25rem; line-height: 1;">⚠️</div>
              <div>
                <strong style="color: #DDA15E; font-size: 0.86rem; text-transform: uppercase; letter-spacing: 0.04em; display: block; margin-bottom: 3px;">Approximate Estimation Based On AI</strong>
                <span style="font-size: 0.82rem; color: var(--ink-secondary, #CCCCCC); line-height: 1.5;" id="aiApproximateNoticeText">
                  This preliminary estimate is an AI approximation calculated from audited unit rates and closest past projects in our database. Actual contract pricing requires an on-site physical laser survey.
                </span>
              </div>
            </div>

            <!-- Reference Projects Grounding Strip -->
            <div class="rag-references-strip" id="ragReferencesStrip" style="margin-bottom: 24px; padding: 14px 18px; border-radius: 6px; background: rgba(255, 255, 255, 0.03); border: 1px solid var(--decora-line-strong, rgba(255, 255, 255, 0.12));">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; flex-wrap: wrap; gap: 8px;">
                <span style="font-size: 0.78rem; font-weight: 700; color: #DDA15E; text-transform: uppercase; letter-spacing: 0.05em; display: flex; align-items: center; gap: 6px;">
                  <span>📌 Grounded In Company Reference Projects</span>
                </span>
                <span id="ragConfidenceBadge" class="grade-badge standard" style="font-size: 0.72rem; padding: 3px 10px; background: rgba(16, 185, 129, 0.15); border: 1px solid #10B981; color: #10B981; font-weight: 700;">HIGH CONFIDENCE</span>
              </div>
              <div id="ragReferenceProjectsList" style="display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 8px;">
                <!-- Populated dynamically with reference project chips -->
              </div>
              <div id="ragConfidenceNote" style="font-size: 0.78rem; color: var(--ink-secondary, #94A3B8); line-height: 1.45;"></div>
              <div id="ragTimelineText" style="font-size: 0.78rem; color: var(--decora-ink, #E2E8F0); font-weight: 600; margin-top: 6px;"></div>
            </div>
`;

// 1. Update index.html
const indexPath = 'C:\\Users\\SRUSHTI SHAH\\.gemini\\antigravity\\scratch\\sweety-colour-decora\\index.html';
let indexContent = fs.readFileSync(indexPath, 'utf8');

const targetInIndex = `            <!-- KPI Cards Grid (Low, Expected, High) -->
            <div class="cost-kpi-grid">`;

if (indexContent.includes(targetInIndex) && !indexContent.includes('ai-approximate-notice-box')) {
  indexContent = indexContent.replace(targetInIndex, noticeHtml + '\n' + targetInIndex);
  fs.writeFileSync(indexPath, indexContent, 'utf8');
  console.log('Updated index.html with notice and grounding strip');
}

// 2. Update ai-intake.html
const intakePath = 'C:\\Users\\SRUSHTI SHAH\\.gemini\\antigravity\\scratch\\sweety-colour-decora\\ai-intake.html';
let intakeContent = fs.readFileSync(intakePath, 'utf8');

const targetInIntake = `      <div class="cost-kpi-grid">`;

if (intakeContent.includes(targetInIntake) && !intakeContent.includes('ai-approximate-notice-box')) {
  intakeContent = intakeContent.replace(targetInIntake, noticeHtml + '\n' + targetInIntake);
  fs.writeFileSync(intakePath, intakeContent, 'utf8');
  console.log('Updated ai-intake.html with notice and grounding strip');
}

// 3. Update ai_studio.js to render RAG basis, approximate notice, confidence, timeline
const studioPath = 'C:\\Users\\SRUSHTI SHAH\\.gemini\\antigravity\\scratch\\sweety-colour-decora\\ai_studio.js';
let studioContent = fs.readFileSync(studioPath, 'utf8');

const oldCostRender = `      // Cost Table (itemizedBreakdown or breakdown)
      const items = est.itemizedBreakdown || est.breakdown || [];
      if (el.costTableBody && items.length) {
        el.costTableBody.innerHTML = items.map(item => \`
          <tr class="cost-table-row">
            <td class="cost-td-trade">
              <strong class="trade-title">\${item.name || item.trade || 'Finishing Trade'}</strong>
              <div class="trade-sub">\${item.description || item.scope || ''}</div>
            </td>
            <td class="cost-td-grade">
              <span class="grade-badge \${item.grade || 'standard'}">\${(item.grade || 'Standard').toUpperCase()}</span>
            </td>
            <td class="cost-td-amount" style="text-align: right;">
              <strong>\${item.costFormatted || '₹' + Number(item.cost || item.expectedCost || 0).toLocaleString('en-IN')}</strong>
            </td>
          </tr>
        \`).join('');
      }

      // Disclaimer
      if (el.costDisclaimer && est.disclaimer) {
        el.costDisclaimer.textContent = est.disclaimer;
      }`;

const newCostRender = `      // Notice banner for Customer: Explicit Approx AI Estimation
      const noticeBox = document.getElementById('aiApproximateNoticeBox');
      const noticeText = document.getElementById('aiApproximateNoticeText');
      if (noticeBox) noticeBox.style.display = 'flex';
      if (noticeText && (est.approximate_notice || est.disclaimer)) {
        noticeText.textContent = est.approximate_notice || est.disclaimer;
      }

      // RAG Grounding Reference Strip
      const refList = document.getElementById('ragReferenceProjectsList');
      if (refList && est.reference_projects && est.reference_projects.length) {
        refList.innerHTML = est.reference_projects.map(r => \`
          <span style="font-size: 0.74rem; background: rgba(201, 136, 56, 0.12); border: 1px solid rgba(201, 136, 56, 0.35); border-radius: 4px; padding: 4px 10px; color: #DDA15E; display: inline-flex; align-items: center; gap: 4px;">
            <strong>\${r.project_name}</strong> (\${r.city}) &middot; ₹\${Number(r.final_cost_inr).toLocaleString('en-IN')}
          </span>
        \`).join('');
      }

      const confBadge = document.getElementById('ragConfidenceBadge');
      if (confBadge && est.confidence) {
        confBadge.textContent = \`\${est.confidence.toUpperCase()} CONFIDENCE\`;
        if (est.confidence === 'high') {
          confBadge.style.borderColor = '#10B981';
          confBadge.style.color = '#10B981';
          confBadge.style.background = 'rgba(16, 185, 129, 0.15)';
        } else if (est.confidence === 'medium') {
          confBadge.style.borderColor = '#F59E0B';
          confBadge.style.color = '#F59E0B';
          confBadge.style.background = 'rgba(245, 158, 11, 0.15)';
        } else {
          confBadge.style.borderColor = '#EF4444';
          confBadge.style.color = '#EF4444';
          confBadge.style.background = 'rgba(239, 68, 68, 0.15)';
        }
      }

      const confNote = document.getElementById('ragConfidenceNote');
      if (confNote && est.confidence_note) {
        confNote.textContent = est.confidence_note;
      }

      const timelineText = document.getElementById('ragTimelineText');
      if (timelineText && est.estimated_timeline_weeks_min) {
        timelineText.textContent = \`⏱ Estimated Execution Window: \${est.estimated_timeline_weeks_min} – \${est.estimated_timeline_weeks_max} Weeks\`;
      }

      // Cost Table with Traceable RAG Basis
      const items = est.itemizedBreakdown || est.breakdown || [];
      if (el.costTableBody && items.length) {
        el.costTableBody.innerHTML = items.map(item => \`
          <tr class="cost-table-row">
            <td class="cost-td-trade">
              <strong class="trade-title">\${item.item || item.name || item.trade || 'Finishing Trade'}</strong>
              <div class="trade-sub">\${item.description || item.scope || ''}</div>
              \${item.basis ? \`<div class="rag-basis-line" style="font-size: 0.74rem; color: #DDA15E; font-style: italic; margin-top: 4px;">📌 \${item.basis}</div>\` : ''}
            </td>
            <td class="cost-td-grade">
              <span class="grade-badge \${item.grade || 'standard'}">\${(item.grade || 'Standard').toUpperCase()}</span>
            </td>
            <td class="cost-td-amount" style="text-align: right;">
              <strong>\${item.costFormatted || (item.cost_min ? '₹' + Number(item.cost_min).toLocaleString('en-IN') + ' – ₹' + Number(item.cost_max).toLocaleString('en-IN') : '₹' + Number(item.cost || 0).toLocaleString('en-IN'))}</strong>
            </td>
          </tr>
        \`).join('');
      }

      // Disclaimer
      if (el.costDisclaimer && est.disclaimer) {
        el.costDisclaimer.textContent = est.disclaimer;
      }`;

if (studioContent.includes(oldCostRender)) {
  studioContent = studioContent.replace(oldCostRender, newCostRender);
  fs.writeFileSync(studioPath, studioContent, 'utf8');
  console.log('Updated ai_studio.js with RAG basis, approximate notice, and confidence note rendering');
}
