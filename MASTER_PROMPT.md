# Sweety Colour Decora — Master Build Specification & Prompt

```markdown
Design and build a single-page website for SWEETY COLOUR DECORA that serves two 
audiences in one continuous document: first, a public-facing company site (for clients 
evaluating the contractor); then, seamlessly, the internal digital transformation 
and patent opportunity proposal for "Sweety SiteFlow" (for the owner and stakeholders). 
Sweety Colour Decora is an established construction finishing contractor — painting, 
flooring, POP, putty, granite, marble — founded in 2003, GST registered, with a daily 
workforce of ~100 skilled tradespeople operating across multiple sites.

This is a dense, content-rich document — treat it like a digital deck / technical 
monograph, not a lightweight marketing landing page. Include every section and every 
piece of content listed below in full; do not compress, cut, or summarize anything away.

═══════════════════════════════════════════
DESIGN DIRECTION & AESTHETICS
═══════════════════════════════════════════

EDITORIAL / ATELIER: Classic, restrained, and minimal despite the density — achieved 
through generous vertical whitespace BETWEEN sections (not within them), strict 12-column 
grid discipline, and a disciplined four-color palette, never by cutting content. 

AVOID EVERY GENERIC CLICHÉ:
- No gradient hero backgrounds
- No rounded card grids with drop shadows
- No stock photography of people at laptops or generic construction workers
- No carousel / slider components
- No bold / heavy sans-serif headlines
Think of a boutique architecture studio publishing an authoritative technical monograph, 
not a generic contractor template or a SaaS pitch deck.

EXACT COLOR PALETTE (Strictly these, nothing else):
- Background / paper: #F5F1E8 (warm plaster off-white)
- Primary text / ink: #16233F (deep architectural navy)
- Accent: #C1592B (burnt terracotta / orange)
- Secondary text: #6B655C (warm stone gray)
Navy and plaster off-white carry the page. Terracotta is strictly reserved for section 
numerals, one hairline rule per section, hover states, and small labels — never large fills 
or solid button backgrounds where navy belongs.

TYPOGRAPHY:
- Display / Headlines: Fraunces (optical serif, large sizes, tightened tracking -0.025em, 
  light / regular weights only)
- Body / UI / Data: Inter (or General Sans), small size range (14–15px), generous 
  line-height (1.65–1.75)
- Numbered Section Hierarchy: Every proposal section opens with a large serif section 
  number + title (e.g. "01 — The Opportunity") in terracotta and navy. Sections 1–5 
  (the public site part) use section titles without numbers, reading visually as "the site"; 
  sections 6 onward (the proposal part) use the 01–13 numbering system, reading visually 
  as "the document."

SIGNATURE MOTIF:
- Thin single-weight architectural line-icons (1.25px stroke, blueprint / drafting style) 
  for services and modules.
- A slim horizontal terracotta rule precedes every proposal section — this rule + number 
  pairing is the repeated motif tying the proposal sections together.
- Hairline 1px navy rules at low opacity (rgba(22, 35, 63, 0.12)) separate list items, 
  table rows, workflow steps, and role matrices.

REFERENCE DIRECTION & CALIBRATION:
1. createtoday.io — architect examples (numbered-section convention, "01 about / 02 portfolio")
2. CodeFronts — artisanal SaaS hero (eyebrow + serif headline + terracotta CTA, closest palette match)
3. Desert Star Construction (real contractor site, serif elegance, proof this reads credibly in-sector)
   - Sector-credibility check: see desertstarconstruction.com for proof that elegant serif 
     typography and generous whitespace read as credible and trustworthy within the 
     construction/contracting sector itself, not just in adjacent fields like architecture. 
     Note: unlike that reference, we have no real project photography, so typography, the 
     blueprint line-icon motif, and whitespace must carry the page on their own — do not 
     compensate for the lack of photos by adding stock imagery or illustration filler.
4. Awwwards — Minimal collection (general whitespace and restraint calibration)
5. 21st.dev — Hero / Typography component categories (structural component types, not visual style)

NAVIGATION:
Sticky, minimal anchor navigation with two visual groups separated by a hairline divider:
- Left Cluster: "SWEETY COLOUR DECORA" (Wordmark) · About · Services · How We Work · Why Us
- Divider / Gap
- Right Cluster: "PROPOSAL" (Terracotta pill) · 01 Opp · 04 Solution · 05 Modules · 06 Flow · 08 Roadmap · 12 Metrics · [Enquire] (Navy CTA button)

PROPOSAL SECTION RUNNING FOOT:
Every proposal section (01 to 13) features a quiet, small-caps running-foot line:
"Sweety Colour Decora — Digital Transformation & Patent Proposal — Since 2003 — GST Registered"

═══════════════════════════════════════════
PART ONE — THE COMPANY SITE
═══════════════════════════════════════════

HERO
  Wordmark: SWEETY COLOUR DECORA
  Subline: Finishing & Construction Contractors
  Headline: "Quality at every layer."
  Supporting line: Painting, flooring, POP, putty, granite and marble — since 2003
  CTA: "Our services" (scrolls to services) + "Enquire" (jumps to contact form)

ABOUT / CREDIBILITY
  Founded 2003 · ~100 daily workers across multiple sites · GST registered
  Narrative paragraph: An established finishing contractor serving builders, developers, 
  institutions and homeowners — B2B, project-based, full-scope finishing work from 
  surface prep to final polish.

SERVICES
  Six-item grid, blueprint line icon + trade name + short line each:
  1. Painting — Interior, exterior, texture & protective architectural coatings.
  2. Flooring — Vitrified tile, natural stone, screed & industrial epoxy flooring.
  3. POP (False Ceiling) — Gypsum board, decorative cove lighting & acoustic suspended grids.
  4. Putty & Surface Prep — Base leveling, high-finish skim coating & primer bonding.
  5. Granite — Custom slab cutting, stair treads, exterior facade cladding & honing.
  6. Marble — Italian & Indian marble laying, precision grouting & diamond polishing.

HOW WE WORK
  Four-step client-facing process, typography-led, thin rule connectors:
  01 Site visit & scope → Comprehensive spatial inspection, substrate evaluation, and clear scope definition.
  02 Material & schedule planning → BOQ preparation, logistics synchronization, and timeline commitment.
  03 Execution with on-site supervision → Dedicated daily supervisor oversight, skilled trade deployment, and quality checkpoints.
  04 Handover & quality check → Joint punch-list verification, measurement reconciliation, and formal project handover.

WHY SWEETY COLOUR DECORA
  Minimal list separated by hairline dividers:
  01 Established since 2003 — Over two decades of proven contractor reliability and reputation across high-value finishing projects.
  02 Full-service across six trades — Single-source coordination across painting, civil prep, stone, and ceilings eliminates multi-vendor friction.
  03 GST registered, transparent billing — Fully compliant commercial accounting, measured quantity bills, formal work orders, and statutory reliability.
  04 Workforce of ~100 skilled tradespeople — A deep roster of trusted, disciplined artisans capable of parallel multi-site execution without compromising craft quality.

═══════════════════════════════════════════
THE HINGE — TRANSITION DIVIDER
═══════════════════════════════════════════

Full-width, distinct architectural moment setting the tone for the proposal document:
  Eyebrow: "Beyond the site"
  Headline: "A Digital Transformation & Patent Opportunity Proposal"
  Line: "How Sweety Colour Decora can run every site on one connected system — and protect what it builds."
  Seal / Tag: "Sweety SiteFlow Architecture · Operational Control & Patent Opportunity"

═══════════════════════════════════════════
PART TWO — THE PROPOSAL (SWEETY SITEFLOW)
═══════════════════════════════════════════

01 — THE OPPORTUNITY
  Current reality: Multiple sites, ~100 workers, records on paper and phone, owner-dependent operations.
  Core opportunity: One mobile-first platform for attendance, labour, materials, progress, costs and documents.
  Expected outcome: Faster decisions, fewer disputes, better payment control, stronger client trust and scalable growth.
  Notes: This is an operational-control project, not only a website or logo project. Start with one or two sites, validate the workflow, then expand. Use the existing company as the first real-world testing environment.

02 — SECTOR & POSITIONING
  Primary sector: Construction and real-estate services
  Industry subsector: Building finishing and specialty contracting
  Service categories: Painting, flooring, POP, putty, granite and marble
  Business type: B2B, project-based construction service contractor.
  Customers: builders, developers, institutions, homeowners and main contractors.
  Product category: construction workforce and project-operations management platform.

03 — THE PROBLEMS TODAY
  Single-column list with hairline dividers, all 8 field friction points:
  1. Attendance recorded manually or inconsistently.
  2. Owner cannot always know who is present at each site in real time.
  3. Wages, overtime, advances and deductions require repeated manual calculations.
  4. Material usage is not clearly linked to a site, activity or responsible person.
  5. Progress is difficult to compare with labour days and material consumption.
  6. Client approvals, measurements, photos, bills and payments are scattered.
  7. When the owner is absent, there is no single reliable source of truth.
  8. Past records are difficult to search and use for future quotations.
  
  "WHY IT MATTERS" SUBSECTION (set apart with extra vertical spacing, hairline rule, terracotta small-caps label):
  - Every unrecorded hour = wage dispute.
  - Every untracked material = silent loss.
  - Every scattered bill = delayed payment.
  (Format the first few words of each line in large serif display style).
  Closing line below (secondary-gray, smaller):
  "These are daily, small problems — exactly the kind a purpose-built digital system can eliminate, and exactly the kind competitors in this segment have not solved."

04 — THE SOLUTION: SWEETY SITEFLOW
  Intro: A mobile-first operating system for finishing contractors.
  6-Item Card Grid (matching the Core Modules card treatment with 1.25px blueprint line-icons):
  - Multi-Site Workspaces — One company account, separate workspace per site.
  - Supervisor App — Attendance, progress, photos, material requests, incidents.
  - Owner Dashboard — Headcount, labour cost, project status, approvals, cash exposure.
  - Worker Profiles — Trade, wage rate, contact, documents, payment history.
  - Offline-First Design — Low-connectivity operation with later sync, a hard requirement on sites.
  - Local-Language Friendly — Simple UI for non-technical daily workers.
  Pull-Quote (large serif, terracotta accent quote mark):
  "Record once at the site, reuse the data everywhere — wages, materials, client reports, and billing."

05 — CORE MODULES
  6-item blueprint grid (line-icon + title + description):
  - Site & Project — Client, address, scope, BOQ, dates, supervisor and contract value.
  - Workforce — Profiles, trade, rate, documents, attendance, leave, advances and wages.
  - Attendance — Time, location/photo options, overtime, approvals and correction history.
  - Work Progress — Activity, quantity, photos, measurements, snags and client approval.
  - Materials — Request, purchase, receipt, issue, consumption, balance and wastage.
  - Finance & Reports — Wage sheet, cost vs budget, expenses, invoice status and exports.

06 — DAILY WORKFLOW
  6-step sequential pipeline with thin rule connectors (no icons):
  1. Supervisor opens site → 2. Workers check in → 3. Tasks and material needs recorded → 4. Progress and photos submitted → 5. Owner reviews exceptions → 6. Wage and cost report generated
  Worked Field Example (small/italic callout box):
  "18 painters at Site A → attendance verified → 420 sq. ft. completed → 12 litres issued → progress and cost visible."
  Closing Line (same small/italic style):
  "What previously took phone calls, paper registers and end-of-day reconciliation now happens in real time."

07 — USER ROLES & CONTROLS
  Intro: Make the company manageable even when the owner is absent.
  5-row list with hairline dividers:
  - Owner / Admin — all sites, approvals, reports, access and audit history.
  - Site Supervisor — assigned site only; attendance, progress, materials and issues.
  - Accountant — wages, advances, invoices, expenses, exports and payments.
  - Store Coordinator — stock, purchases, receipts, issues and closing balance.
  - Worker — optional view of attendance, wage statement and advances.
  Tag Row: Permissions · Approval workflow · Edit history · Daily backup · Excel / PDF export

08 — MVP ROADMAP
  Three-phase timeline:
  - Phase 1 — 30 Days: Worker profiles, site list, attendance, daily progress, basic wage sheet, owner dashboard and pilot at 1–2 sites.
  - Phase 2 — 60–90 Days: Materials, BOQ and measurements, client approvals, expense tracking, invoice/payment status and notifications.
  - Phase 3 — Scale: Offline sync, analytics, supplier portal, worker self-service, multi-company SaaS and anomaly alerts.
  Gate Callout: "Pilot success gate: supervisors use it daily and the owner can answer site questions without calling everyone."

09 — BRAND FOUNDATION
  Brand Name: SWEETY COLOUR DECORA — Finishing & Construction Contractors
  Logo Direction: Wordmark plus building/brush/tile symbol. Navy for trust and orange for finishing.
  Tagline Options: "Built with finish." / "From surface to signature." / "Quality at every layer."
  Foundational Collateral: Domain and professional email · One-page website with services, projects, GST details and enquiry form · Google Business Profile and WhatsApp Business catalogue · Standard quotation, invoice, work-order and completion-certificate templates.

10 — DATA & IMPLEMENTATION PLAN
  Intro: What must be collected before development.
  Checklist (hairline rows):
  01 Create a master list of sites, clients, supervisors and contract scopes.
  02 Digitise worker records with consent and access controls.
  03 Define standard codes for sites, activities, units, materials and wage types.
  04 Map who marks attendance, corrects it, approves wages and releases payment.
  05 Set up backups, permissions, retention rules and correction procedures.
  Callout: "First field activity: interview the owner, accountant and two supervisors and observe one full workday."

11 — IP & PATENT STRATEGY
  Heading: Protect the genuine invention, not only the business idea.
  Body: An app for contractor management is generally not enough by itself for a patent. 
  Software-related patent analysis in India focuses on novelty, inventive step, industrial 
  applicability and technical effect; business methods and computer programs as such face 
  statutory exclusions. Document any unique technical architecture, offline synchronization, 
  security method or measurable technical improvement. Conduct a prior-art search and consult 
  a registered Indian patent agent before public disclosure. Also consider trademark 
  registration, copyright for code/design, confidentiality and developer ownership agreements.
  Disclaimer (small italic): "General information only; obtain professional legal advice."

12 — PILOT SUCCESS METRICS
  6-item precision grid (number-led, no icons):
  01 Attendance Reconciliation — Time and corrections per pay cycle.
  02 Wage Disputes — Count before and after pilot.
  03 Daily Visibility — Time from site close to owner report.
  04 Material Variance — Issued vs consumed vs balance.
  05 Progress Evidence — Activities with approved photos.
  06 Owner Dependency — Questions resolved without owner.
  Footer Line: "Measure for two weeks before the pilot and compare with four to six weeks after implementation."

13 — RECOMMENDED NEXT STEPS
  Numbered 1–6 with generous spacing and large terracotta numerals:
  1. Confirm the problem through interviews and site observation.
  2. Create worker, site and material master data.
  3. Sketch MVP screens and test them with supervisors.
  4. Run a 30-day pilot at one or two sites.
  5. Measure results and document the technical invention.
  6. Then decide: internal tool, SaaS product, trademark filing and patent consultation.

AUTHOR / PREPARED-BY CREDIT
  Understated credit line centered between Section 13 and the Enquiry section with a single hairline rule above:
  "Prepared by Group 9 — Sweety Jha · Shivani · Dhruv Shah · Akash · Naveen"
  (Secondary-gray, small caps, 0.14em tracking, 500 weight).

═══════════════════════════════════════════
CLOSING (SHARED)
═══════════════════════════════════════════

ENQUIRY / CONTACT
  Editorial underline-style form (no boxed inputs, no drop shadows, 1px bottom borders):
  - Name *
  - Phone *
  - Company / Organization
  - Interested in * (Dropdown: Company services / Pilot program / Full platform / General enquiry)
  - Message (Underline-style textarea)
  - Button: "Submit Enquiry" (Navy fill, transitions to terracotta on hover) with inline feedback status.

FOOTER
  Shared architectural footer:
  - Left: "SWEETY COLOUR DECORA" · "Finishing & Construction Contractors — 'Quality at every layer.'"
  - Right: GST Registered: 24AAAAA0000A1Z5 · Founded 2003 · ~100 daily workers · Direct contact info
  - Bottom bar: "© 2026 Sweety Colour Decora. All rights reserved." + Smooth "Back to top ↑" anchor.

INTERACTION & TECH:
- Stack: Semantic HTML5 + Modern CSS3 (CSS Variables, 12-col Grid) + Vanilla ES6 JavaScript.
- IntersectionObserver scroll-spy updates active states in the sticky dual-group nav as sections pass.
- Subtle entrance transitions on scroll; slightly more pronounced entrance on the transition divider.
- No heavy parallax, no carousels, no autoplay video, no third-party bloated libraries.
- 100% responsive: 12-column desktop down to single-column mobile.
```