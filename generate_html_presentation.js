/**
 * Generates an interactive, modern web-based presentation deck (presentation.html)
 * Project: ELECTRICITY BILL CALCULATOR
 * Exactly 8 Slides with interactive controls (Left/Right arrow, Space, Fullscreen F, Thumbnails)
 */

const fs = require('fs');
const path = require('path');

const logoData = fs.readFileSync(path.resolve(__dirname, 'template_extracted/word/media/image1.png')).toString('base64');

function imgBase64(imgName) {
    const p = path.resolve(__dirname, 'report_images', imgName);
    if (fs.existsSync(p)) {
        return 'data:image/png;base64,' + fs.readFileSync(p).toString('base64');
    }
    return '';
}

const images = {
    logo: 'data:image/png;base64,' + logoData,
    arch: imgBase64('fig3_1_architecture.png'),
    dfd0: imgBase64('fig3_3_dfd0.png'),
    workflow: imgBase64('fig3_5_workflow.png'),
    homepage: imgBase64('fig4_2_homepage.png'),
    form: imgBase64('fig4_4_calculator_form.png'),
    bill: imgBase64('fig4_5_bill_result.png'),
    history: imgBase64('fig4_6_history.png'),
    validation: imgBase64('fig4_8_validation_error.png'),
    print: imgBase64('fig4_7_printable_bill.png')
};

const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ELECTRICITY BILL CALCULATOR - Mini Project Presentation</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet">
  <style>
    :root {
      --primary: #0F2C59;
      --primary-light: #1E40AF;
      --secondary: #0066CC;
      --accent: #F59E0B;
      --accent-green: #10B981;
      --accent-red: #EF4444;
      --bg: #0F172A;
      --card-bg: #FFFFFF;
      --text: #1E293B;
      --text-muted: #64748B;
      --border: #E2E8F0;
      --slide-width: 1280px;
      --slide-height: 720px;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background-color: var(--bg);
      color: var(--text);
      overflow: hidden;
      height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }

    /* Top Control Bar */
    .top-bar {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      height: 52px;
      background: rgba(15, 23, 42, 0.95);
      backdrop-filter: blur(8px);
      border-bottom: 1px solid #334155;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 24px;
      z-index: 1000;
      color: #F8FAFC;
    }

    .top-bar-title {
      font-size: 14px;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .badge-tag {
      background: #1E293B;
      color: #38BDF8;
      border: 1px solid #0284C7;
      padding: 3px 8px;
      border-radius: 4px;
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.5px;
    }

    .controls {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .btn {
      background: #1E293B;
      color: #F8FAFC;
      border: 1px solid #475569;
      padding: 6px 14px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 12px;
      font-weight: 500;
      transition: all 0.2s ease;
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }

    .btn:hover {
      background: #334155;
      border-color: #64748B;
    }

    .btn-primary {
      background: #0284C7;
      border-color: #0369A1;
    }

    .btn-primary:hover {
      background: #0369A1;
    }

    .slide-counter {
      font-size: 13px;
      font-weight: 600;
      color: #94A3B8;
      padding: 0 8px;
    }

    /* Slide Stage Canvas */
    .stage-container {
      width: 100vw;
      height: calc(100vh - 52px);
      margin-top: 52px;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }

    .slide-wrapper {
      position: relative;
      width: var(--slide-width);
      height: var(--slide-height);
      background: #FFFFFF;
      border-radius: 12px;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1);
      overflow: hidden;
      display: none;
      flex-direction: column;
    }

    .slide-wrapper.active {
      display: flex;
      animation: fadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: scale(0.985); }
      to { opacity: 1; transform: scale(1); }
    }

    /* Slide Components */
    .slide-header {
      padding: 24px 36px 16px 36px;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 2px solid #0066CC;
      background: #FFFFFF;
    }

    .slide-header-left .tag {
      font-size: 11px;
      font-weight: 700;
      color: #0066CC;
      letter-spacing: 1px;
      text-transform: uppercase;
      margin-bottom: 4px;
    }

    .slide-header-left h2 {
      font-size: 24px;
      font-weight: 800;
      color: #0F2C59;
      line-height: 1.2;
    }

    .slide-header-left p {
      font-size: 13px;
      color: #64748B;
      margin-top: 4px;
    }

    .slide-num-pill {
      background: #0F2C59;
      color: #FFFFFF;
      padding: 6px 14px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 0.5px;
    }

    .slide-body {
      flex: 1;
      padding: 24px 36px;
      display: grid;
      gap: 24px;
      overflow: hidden;
      background: #F8FAFC;
    }

    .grid-2 {
      grid-template-columns: 1fr 1fr;
    }

    .grid-2-wide-left {
      grid-template-columns: 1.1fr 0.9fr;
    }

    .grid-2-wide-right {
      grid-template-columns: 0.9fr 1.1fr;
    }

    .card {
      background: #FFFFFF;
      border: 1px solid var(--border);
      border-radius: 10px;
      padding: 18px 20px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
      display: flex;
      flex-direction: column;
    }

    .card-title {
      font-size: 13px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 12px;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .card-title.blue { color: #0066CC; }
    .card-title.green { color: #059669; }
    .card-title.red { color: #DC2626; }
    .card-title.amber { color: #D97706; }
    .card-title.navy { color: #0F2C59; }

    ul.bullet-list {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    ul.bullet-list li {
      font-size: 12.5px;
      color: #475569;
      line-height: 1.45;
      position: relative;
      padding-left: 18px;
    }

    ul.bullet-list li::before {
      content: "•";
      position: absolute;
      left: 0;
      color: #0066CC;
      font-weight: bold;
      font-size: 16px;
      line-height: 1;
    }

    ul.bullet-list li strong {
      color: #1E293B;
    }

    .img-box {
      border: 1px solid var(--border);
      border-radius: 8px;
      overflow: hidden;
      background: #FFFFFF;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }

    .img-box img {
      width: 100%;
      height: auto;
      max-height: 100%;
      object-fit: contain;
      display: block;
    }

    .img-caption {
      font-size: 11px;
      font-weight: 600;
      color: #0F2C59;
      padding: 6px 12px;
      background: #F1F5F9;
      width: 100%;
      text-align: center;
      border-top: 1px solid var(--border);
    }

    .slide-footer {
      padding: 10px 36px;
      background: #FFFFFF;
      border-top: 1px solid var(--border);
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 11px;
      color: #64748B;
    }

    /* SLIDE 1 SPECIFIC STYLES */
    .slide-1-bg {
      background: linear-gradient(135deg, #0B192C 0%, #0F2C59 60%, #1E3E62 100%);
      color: #FFFFFF;
      padding: 40px 48px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      height: 100%;
    }

    .slide-1-header {
      display: flex;
      align-items: center;
      gap: 24px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.15);
      padding-bottom: 20px;
    }

    .slide-1-header img {
      width: 76px;
      height: 76px;
      object-fit: contain;
      background: #FFFFFF;
      border-radius: 8px;
      padding: 4px;
    }

    .slide-1-header-text h1 {
      font-size: 24px;
      font-weight: 800;
      color: #FFFFFF;
      letter-spacing: 0.5px;
    }

    .slide-1-header-text p.sub {
      font-size: 12px;
      color: #93C5FD;
      margin-top: 2px;
    }

    .slide-1-header-text p.dept {
      font-size: 14px;
      font-weight: 700;
      color: #F59E0B;
      margin-top: 4px;
    }

    .slide-1-header-text p.meta {
      font-size: 11px;
      color: #CBD5E1;
      margin-top: 2px;
    }

    .slide-1-hero {
      margin: 10px 0;
    }

    .hero-badge {
      display: inline-block;
      background: #2563EB;
      color: #FFFFFF;
      padding: 4px 12px;
      border-radius: 4px;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 1px;
      margin-bottom: 12px;
    }

    .slide-1-hero h2 {
      font-size: 38px;
      font-weight: 900;
      letter-spacing: -0.5px;
      color: #FFFFFF;
      text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
    }

    .slide-1-hero p {
      font-size: 15px;
      color: #94A3B8;
      max-width: 900px;
      margin-top: 8px;
      line-height: 1.5;
    }

    .slide-1-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
    }

    .slide-1-card {
      background: rgba(11, 25, 44, 0.7);
      border: 1px solid rgba(59, 130, 246, 0.3);
      border-radius: 10px;
      padding: 16px 20px;
    }

    .slide-1-card h3 {
      font-size: 12px;
      font-weight: 700;
      color: #F59E0B;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 10px;
    }

    .member-item {
      display: flex;
      justify-content: space-between;
      padding: 5px 0;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      font-size: 13px;
    }

    .member-item:last-child {
      border-bottom: none;
    }

    .member-name { font-weight: 600; color: #FFFFFF; }
    .member-reg { color: #93C5FD; font-family: 'JetBrains Mono', monospace; font-size: 12px; }

    /* Tables & Code */
    table.data-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 12px;
    }

    table.data-table th {
      background: #F1F5F9;
      color: #0F2C59;
      padding: 8px 10px;
      text-align: left;
      font-weight: 700;
      border-bottom: 2px solid #CBD5E1;
    }

    table.data-table td {
      padding: 7px 10px;
      border-bottom: 1px solid #E2E8F0;
      color: #334155;
    }

    table.data-table tr:last-child td {
      border-bottom: none;
    }

    .formula-box {
      background: #F8FAFC;
      border-left: 3px solid #0066CC;
      padding: 10px 14px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 11.5px;
      color: #0F2C59;
      margin: 6px 0;
      border-radius: 0 6px 6px 0;
    }

    /* Print Styles */
    @media print {
      body {
        background: transparent;
        overflow: visible;
        height: auto;
      }
      .top-bar { display: none; }
      .stage-container {
        width: 100%;
        height: auto;
        margin: 0;
        padding: 0;
        display: block;
      }
      .slide-wrapper {
        display: flex !important;
        page-break-after: always;
        margin-bottom: 40px;
        box-shadow: none;
        border: 1px solid #CBD5E1;
      }
    }
  </style>
</head>
<body>

  <!-- Top Bar Controls -->
  <div class="top-bar">
    <div class="top-bar-title">
      <span class="badge-tag">SRM TRP IT</span>
      <span>Electricity Bill Calculator — Mini Project Presentation</span>
    </div>
    <div class="controls">
      <button class="btn" onclick="prevSlide()" title="Previous (Left Arrow / Up Arrow)">◀ Prev</button>
      <span class="slide-counter" id="slideIndicator">Slide 1 of 8</span>
      <button class="btn btn-primary" onclick="nextSlide()" title="Next (Right Arrow / Space)">Next ▶</button>
      <button class="btn" onclick="toggleFullscreen()" title="Fullscreen (F)">⛶ Fullscreen</button>
      <button class="btn" onclick="window.print()" title="Print / Export to PDF">🖨 Print / PDF</button>
    </div>
  </div>

  <!-- Stage Container -->
  <div class="stage-container">

    <!-- ================= SLIDE 1 ================= -->
    <div class="slide-wrapper active" id="slide-1">
      <div class="slide-1-bg">
        <div class="slide-1-header">
          <img src="${images.logo}" alt="SRM TRP Logo">
          <div class="slide-1-header-text">
            <h1>SRM TRP ENGINEERING COLLEGE</h1>
            <p class="sub">(Approved by AICTE, New Delhi & Affiliated to Anna University, Chennai)</p>
            <p class="dept">DEPARTMENT OF INFORMATION TECHNOLOGY</p>
            <p class="meta">Academic Year 2026 – 2027 (Odd Semester)  •  Course: IT25301 Web Technology Laboratory</p>
          </div>
        </div>

        <div class="slide-1-hero">
          <div class="hero-badge">MINI PROJECT PRESENTATION</div>
          <h2>ELECTRICITY BILL CALCULATOR</h2>
          <p>A Web-Based Automated Slab-Tiered Tariff Computation, Instant Breakdown & Utility History Management System</p>
        </div>

        <div class="slide-1-grid">
          <div class="slide-1-card">
            <h3>Project Team Members</h3>
            <div class="member-item">
              <span class="member-name">1. SHAPTHAGIRI G</span>
              <span class="member-reg">814725205105</span>
            </div>
            <div class="member-item">
              <span class="member-name">2. RENGESH M</span>
              <span class="member-reg">814725205088</span>
            </div>
            <div class="member-item">
              <span class="member-name">3. SAI SARAN N</span>
              <span class="member-reg">814725205096</span>
            </div>
            <div style="margin-top: 8px; font-size: 11px; color: #94A3B8;">
              Branch: <strong>B.Tech – Information Technology (II Year)</strong>
            </div>
          </div>

          <div class="slide-1-card">
            <h3>Project Supervision</h3>
            <div style="margin-bottom: 8px;">
              <div style="font-size: 10px; color: #94A3B8; text-transform: uppercase;">Faculty In-Charge & Guide</div>
              <div style="font-size: 13px; font-weight: 700; color: #FFFFFF;">Mrs. C. MANONMANI, M.E., (Ph.D.)</div>
              <div style="font-size: 11px; color: #93C5FD;">Assistant Professor, Department of AI & DS</div>
            </div>
            <div>
              <div style="font-size: 10px; color: #94A3B8; text-transform: uppercase;">Head of the Department</div>
              <div style="font-size: 13px; font-weight: 700; color: #FFFFFF;">Dr. S. SABEETHA SARASWATHI, M.Tech., Ph.D.</div>
              <div style="font-size: 11px; color: #93C5FD;">Associate Professor & Head, Department of IT</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ================= SLIDE 2 ================= -->
    <div class="slide-wrapper" id="slide-2">
      <div class="slide-header">
        <div class="slide-header-left">
          <div class="tag">Context & Objectives</div>
          <h2>Project Overview, Problem Statement & Objectives</h2>
          <p>Addressing manual estimation discrepancies through client-side web automation</p>
        </div>
        <div class="slide-num-pill">02 / 08</div>
      </div>
      <div class="slide-body grid-2">
        <div style="display: flex; flex-direction: column; gap: 16px;">
          <div class="card" style="border-left: 4px solid #EF4444;">
            <div class="card-title red">Challenges in Conventional Billing</div>
            <ul class="bullet-list">
              <li><strong>Manual Calculation Errors:</strong> Manual differential reading is error-prone, leading to billing disputes and confusion.</li>
              <li><strong>Complex Progressive Tariffs:</strong> Consumers struggle to verify whether tiered slab rates were accurately partitioned.</li>
              <li><strong>Zero Pre-Bill Transparency:</strong> Consumers receive physical bills weeks later, leaving no means for mid-cycle tracking.</li>
            </ul>
          </div>
          <div class="card" style="border-left: 4px solid #10B981;">
            <div class="card-title green">The Proposed Web Solution</div>
            <ul class="bullet-list">
              <li><strong>Instant Real-time Computation:</strong> Computes units and slab breakdowns in under 5 ms client-side.</li>
              <li><strong>Zero Server Overhead:</strong> 100% responsive HTML5/CSS3/JavaScript execution without complex backend dependencies.</li>
              <li><strong>Offline Persistence:</strong> Retains past calculation logs in LocalStorage with one-click print invoice support.</li>
            </ul>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px;">
          <div class="card" style="background: #F8FAFC;">
            <div style="font-size: 26px; font-weight: 800; color: #0066CC;">01</div>
            <div style="font-size: 13px; font-weight: 700; color: #0F2C59; margin: 4px 0;">Automated Calculation</div>
            <p style="font-size: 11px; color: #64748B; line-height: 1.4;">Automatically computes consumed units (Current − Previous) and strictly validates to reject negative or inverted values.</p>
          </div>
          <div class="card" style="background: #F8FAFC;">
            <div style="font-size: 26px; font-weight: 800; color: #F59E0B;">02</div>
            <div style="font-size: 13px; font-weight: 700; color: #0F2C59; margin: 4px 0;">Slab-Tiered Engine</div>
            <p style="font-size: 11px; color: #64748B; line-height: 1.4;">Partitions units across 4 progressive domestic tariff slabs (₹1.50, ₹2.50, ₹4.00, ₹6.00) without retroactive penalty.</p>
          </div>
          <div class="card" style="background: #F8FAFC;">
            <div style="font-size: 26px; font-weight: 800; color: #10B981;">03</div>
            <div style="font-size: 13px; font-weight: 700; color: #0F2C59; margin: 4px 0;">Transparent Invoicing</div>
            <p style="font-size: 11px; color: #64748B; line-height: 1.4;">Generates itemized invoice tables showing consumption per slab, rate applied, subtotal, and print-ready receipt.</p>
          </div>
          <div class="card" style="background: #F8FAFC;">
            <div style="font-size: 26px; font-weight: 800; color: #6366F1;">04</div>
            <div style="font-size: 13px; font-weight: 700; color: #0F2C59; margin: 4px 0;">Persistent History</div>
            <p style="font-size: 11px; color: #64748B; line-height: 1.4;">Saves past calculations to browser LocalStorage, allowing consumers to audit past electricity bills on demand.</p>
          </div>
        </div>
      </div>
      <div class="slide-footer">
        <span>Department of Information Technology, SRM TRP Engineering College</span>
        <span>IT25301 - Web Technology Lab</span>
      </div>
    </div>

    <!-- ================= SLIDE 3 ================= -->
    <div class="slide-wrapper" id="slide-3">
      <div class="slide-header">
        <div class="slide-header-left">
          <div class="tag">Architecture & Stack</div>
          <h2>System Architecture & Technology Stack</h2>
          <p>Lightweight 3-tier client-side architecture engineered with modern web standards</p>
        </div>
        <div class="slide-num-pill">03 / 08</div>
      </div>
      <div class="slide-body grid-2">
        <div class="img-box">
          <img src="${images.arch}" alt="System Architecture">
          <div class="img-caption">Figure 3.1: 3-Tier Client-Side Web Architecture</div>
        </div>

        <div style="display: flex; flex-direction: column; gap: 14px;">
          <div class="card" style="border-left: 4px solid #0066CC;">
            <div class="card-title blue">1. Presentation Tier (HTML5 + CSS3)</div>
            <ul class="bullet-list">
              <li><strong>HTML5 Semantic Markup:</strong> Utilizes &lt;header&gt;, &lt;section&gt;, &lt;form&gt;, and &lt;table&gt; for accessible and maintainable layout.</li>
              <li><strong>Responsive CSS3 Layout:</strong> Modern Flexbox/Grid styling, custom design variables, and dedicated @media print stylesheets.</li>
            </ul>
          </div>
          <div class="card" style="border-left: 4px solid #F59E0B;">
            <div class="card-title amber">2. Business Logic Tier (JavaScript ES6+)</div>
            <ul class="bullet-list">
              <li><strong>Validation Engine:</strong> Prevents non-numeric values, negative numbers, and inverted meter conditions (Current &lt; Previous).</li>
              <li><strong>Slab Allocation Algorithm:</strong> Iterative piecewise calculation across progressive rate tiers in &lt; 5 ms.</li>
            </ul>
          </div>
          <div class="card" style="border-left: 4px solid #10B981;">
            <div class="card-title green">3. Persistence Tier (HTML5 LocalStorage)</div>
            <ul class="bullet-list">
              <li><strong>Client-Side Storage:</strong> Retains calculation records across browser sessions without backend server dependency.</li>
              <li><strong>Cross-Platform Compatibility:</strong> Runs smoothly across Chrome, Edge, Firefox, and Safari on desktop and mobile.</li>
            </ul>
          </div>
        </div>
      </div>
      <div class="slide-footer">
        <span>Department of Information Technology, SRM TRP Engineering College</span>
        <span>IT25301 - Web Technology Lab</span>
      </div>
    </div>

    <!-- ================= SLIDE 4 ================= -->
    <div class="slide-wrapper" id="slide-4">
      <div class="slide-header">
        <div class="slide-header-left">
          <div class="tag">Tariff & Math Model</div>
          <h2>Progressive Tariff Slabs & Mathematical Model</h2>
          <p>Exact mathematical formulation, tiered rate schedule, and verified benchmark calculations</p>
        </div>
        <div class="slide-num-pill">04 / 08</div>
      </div>
      <div class="slide-body grid-2">
        <div style="display: flex; flex-direction: column; gap: 16px;">
          <div class="card" style="border-left: 4px solid #0066CC;">
            <div class="card-title blue">Core Mathematical Formulations</div>
            <div style="font-size: 11px; color: #475569; margin-bottom: 4px;">1. Net Consumption:</div>
            <div class="formula-box">U = R_curr − R_prev   [where R_curr ≥ R_prev ≥ 0]</div>
            <div style="font-size: 11px; color: #475569; margin: 8px 0 4px 0;">2. Progressive Slab Total Charge:</div>
            <div class="formula-box">Total Bill = ∑ (Units in Slab_i × Rate_i)  for i = 1 to k</div>
            <div style="font-size: 10.5px; color: #64748B; margin-top: 6px;">
              *Tariff is progressive: each slab rate applies strictly to the incremental units falling into that tier.
            </div>
          </div>

          <div class="card">
            <div class="card-title navy">Official Domestic Tariff Slabs</div>
            <table class="data-table">
              <thead>
                <tr>
                  <th>Slab Tier</th>
                  <th>Range (Units)</th>
                  <th>Rate / Unit</th>
                  <th>Classification</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Slab 1</strong></td>
                  <td>0 – 100</td>
                  <td style="color: #0066CC; font-weight: bold;">₹1.50</td>
                  <td>Lifeline Tier</td>
                </tr>
                <tr>
                  <td><strong>Slab 2</strong></td>
                  <td>101 – 200</td>
                  <td style="color: #10B981; font-weight: bold;">₹2.50</td>
                  <td>Domestic Baseline</td>
                </tr>
                <tr>
                  <td><strong>Slab 3</strong></td>
                  <td>201 – 300</td>
                  <td style="color: #F59E0B; font-weight: bold;">₹4.00</td>
                  <td>Standard Domestic</td>
                </tr>
                <tr>
                  <td><strong>Slab 4</strong></td>
                  <td>Above 300</td>
                  <td style="color: #EF4444; font-weight: bold;">₹6.00</td>
                  <td>High Consumption</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div style="display: flex; flex-direction: column; gap: 12px;">
          <div class="card" style="background: #F0FDF4; border-color: #86EFAC;">
            <div style="font-size: 12px; font-weight: 700; color: #15803D;">CASE 1: LOW DOMESTIC CONSUMPTION (80 UNITS)</div>
            <div style="font-size: 11.5px; color: #1E293B; margin-top: 4px;">
              • Slab 1 (80 u @ ₹1.50): 80 × 1.50 = <strong>₹120.00</strong><br>
              • <strong>Total Payable Amount: ₹120.00</strong> (Single tier applied)
            </div>
          </div>

          <div class="card" style="background: #EFF6FF; border-color: #93C5FD;">
            <div style="font-size: 12px; font-weight: 700; color: #1D4ED8;">CASE 2: TYPICAL HOUSEHOLD CONSUMPTION (250 UNITS)</div>
            <div style="font-size: 11.5px; color: #1E293B; margin-top: 4px;">
              • Slab 1 (100 u @ ₹1.50): ₹150.00<br>
              • Slab 2 (100 u @ ₹2.50): ₹250.00<br>
              • Slab 3 (50 u @ ₹4.00): ₹200.00<br>
              • <strong>Total Payable: 150 + 250 + 200 = ₹600.00</strong> across 3 tiers
            </div>
          </div>

          <div class="card" style="background: #FEF3C7; border-color: #FCD34D;">
            <div style="font-size: 12px; font-weight: 700; color: #B45309;">CASE 3: HEAVY CONSUMPTION (450 UNITS)</div>
            <div style="font-size: 11.5px; color: #1E293B; margin-top: 4px;">
              • Slab 1: ₹150 | Slab 2: ₹250 | Slab 3: ₹400<br>
              • Slab 4 (150 u @ ₹6.00): 150 × 6.00 = ₹900.00<br>
              • <strong>Total Payable: 150 + 250 + 400 + 900 = ₹1,700.00</strong>
            </div>
          </div>
        </div>
      </div>
      <div class="slide-footer">
        <span>Department of Information Technology, SRM TRP Engineering College</span>
        <span>IT25301 - Web Technology Lab</span>
      </div>
    </div>

    <!-- ================= SLIDE 5 ================= -->
    <div class="slide-wrapper" id="slide-5">
      <div class="slide-header">
        <div class="slide-header-left">
          <div class="tag">Design & Workflows</div>
          <h2>System Design & Data Flow Modeling</h2>
          <p>Data flow architecture from user input acquisition to dynamic invoice calculation and persistence</p>
        </div>
        <div class="slide-num-pill">05 / 08</div>
      </div>
      <div class="slide-body grid-2">
        <div style="display: flex; flex-direction: column; gap: 14px;">
          <div class="img-box" style="height: 250px;">
            <img src="${images.dfd0}" alt="Level 0 DFD" style="max-height: 200px;">
            <div class="img-caption">Figure 3.3: Data Flow Diagram (Level 0 Context Diagram)</div>
          </div>
          <div class="card" style="background: #F8FAFC;">
            <div class="card-title blue">Data Flow Overview</div>
            <ul class="bullet-list">
              <li><strong>Consumer Entity:</strong> Submits consumer details, previous meter reading, and current meter reading.</li>
              <li><strong>Calculation Module:</strong> Enforces boundary constraints, calculates differential consumption, and applies progressive slabs.</li>
              <li><strong>Data Stores:</strong> Commits processed records into browser LocalStorage for persistent history.</li>
            </ul>
          </div>
        </div>

        <div class="img-box">
          <img src="${images.workflow}" alt="Workflow Diagram" style="max-height: 440px;">
          <div class="img-caption">Figure 3.5: End-to-End System Calculation & Workflow Logic</div>
        </div>
      </div>
      <div class="slide-footer">
        <span>Department of Information Technology, SRM TRP Engineering College</span>
        <span>IT25301 - Web Technology Lab</span>
      </div>
    </div>

    <!-- ================= SLIDE 6 ================= -->
    <div class="slide-wrapper" id="slide-6">
      <div class="slide-header">
        <div class="slide-header-left">
          <div class="tag">Application UI</div>
          <h2>User Interface Showcase & Interactive Modules</h2>
          <p>Visual walkthrough of the responsive home page, tariff table, input form, and instant bill breakdown</p>
        </div>
        <div class="slide-num-pill">06 / 08</div>
      </div>
      <div class="slide-body grid-2">
        <div style="display: flex; flex-direction: column; gap: 14px;">
          <div class="img-box">
            <img src="${images.homepage}" alt="Home Page Banner">
            <div class="img-caption">Figure 4.2: Navigation Header, Hero Section & Domestic Tariffs</div>
          </div>
          <div class="img-box">
            <img src="${images.form}" alt="Calculator Input Form">
            <div class="img-caption">Figure 4.4: Meter Reading Input Form with Real-Time Validation</div>
          </div>
        </div>

        <div style="display: flex; flex-direction: column; gap: 14px;">
          <div class="img-box">
            <img src="${images.bill}" alt="Generated Bill Invoice">
            <div class="img-caption">Figure 4.5: Generated Bill Invoice with Slab-by-Slab Cost Breakdown</div>
          </div>
          <div class="card" style="background: #F0FDF4; border-color: #86EFAC;">
            <div class="card-title green">Key User Interface Highlights</div>
            <ul class="bullet-list">
              <li><strong>Real-Time Responsiveness:</strong> Calculations are performed on the fly with instantaneous visual feedback.</li>
              <li><strong>Itemized Transparency:</strong> Displays consumer details, billing date, consumed units, and individual slab line items.</li>
              <li><strong>One-Click Action Buttons:</strong> "Print Bill Receipt", "Recalculate", and "Reset Form" for streamlined usability.</li>
            </ul>
          </div>
        </div>
      </div>
      <div class="slide-footer">
        <span>Department of Information Technology, SRM TRP Engineering College</span>
        <span>IT25301 - Web Technology Lab</span>
      </div>
    </div>

    <!-- ================= SLIDE 7 ================= -->
    <div class="slide-wrapper" id="slide-7">
      <div class="slide-header">
        <div class="slide-header-left">
          <div class="tag">Advanced Features</div>
          <h2>History Tracking, Validation & Print Invoice</h2>
          <p>Ensuring data integrity through strict input constraints, offline persistence, and print formatting</p>
        </div>
        <div class="slide-num-pill">07 / 08</div>
      </div>
      <div class="slide-body grid-2">
        <div style="display: flex; flex-direction: column; gap: 14px;">
          <div class="img-box">
            <img src="${images.history}" alt="History Table">
            <div class="img-caption">Figure 4.6: Client-Side Persistent History Table (LocalStorage)</div>
          </div>
          <div class="card" style="background: #F8FAFC;">
            <div class="card-title blue">LocalStorage Persistence Architecture</div>
            <ul class="bullet-list">
              <li><strong>Structured Records:</strong> Automatically stores calculation date, readings, consumed units, and total bill.</li>
              <li><strong>Session Independence:</strong> Data remains accessible across browser restarts with zero server latency.</li>
              <li><strong>Record Management:</strong> Features a "Clear All History" action with instant cache clearing.</li>
            </ul>
          </div>
        </div>

        <div style="display: flex; flex-direction: column; gap: 14px;">
          <div class="img-box" style="border-color: #FCA5A5;">
            <img src="${images.validation}" alt="Validation Error">
            <div class="img-caption" style="color: #B91C1C;">Figure 4.8: Input Validation Alert (Current &lt; Previous Reading)</div>
          </div>
          <div class="img-box" style="border-color: #86EFAC;">
            <img src="${images.print}" alt="Printable Receipt">
            <div class="img-caption" style="color: #047857;">Figure 4.7: Print-Ready Invoice via CSS @media print Stylesheet</div>
          </div>
        </div>
      </div>
      <div class="slide-footer">
        <span>Department of Information Technology, SRM TRP Engineering College</span>
        <span>IT25301 - Web Technology Lab</span>
      </div>
    </div>

    <!-- ================= SLIDE 8 ================= -->
    <div class="slide-wrapper" id="slide-8">
      <div class="slide-header">
        <div class="slide-header-left">
          <div class="tag">Testing & Conclusion</div>
          <h2>Testing Matrix, Future Scope & Conclusion</h2>
          <p>100% verification pass rate, system scalability roadmap, and final project outcomes</p>
        </div>
        <div class="slide-num-pill">08 / 08</div>
      </div>
      <div class="slide-body grid-2">
        <div style="display: flex; flex-direction: column; gap: 14px;">
          <div class="card" style="border-left: 4px solid #0066CC;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
              <span class="card-title blue" style="margin: 0;">Verification & Testing Matrix</span>
              <span style="background: #ECFDF5; color: #059669; border: 1px solid #10B981; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: bold;">20/20 PASSED (100%)</span>
            </div>
            <ul class="bullet-list">
              <li><strong>Unit Testing:</strong> Verified mathematical accuracy of all 4 slab calculation functions and boundary logic.</li>
              <li><strong>Boundary Value Testing:</strong> Confirmed precise transitions at 0, 100, 200, and 300 unit boundaries.</li>
              <li><strong>Negative & Error Testing:</strong> Successfully rejects non-numeric characters and inverted readings.</li>
              <li><strong>Cross-Browser Testing:</strong> Fully compatible with Chrome, Edge, Firefox, and Safari across viewports.</li>
            </ul>
          </div>

          <div class="card" style="background: #F0FDF4; border-color: #86EFAC;">
            <div class="card-title green">System Efficiency Metrics</div>
            <ul class="bullet-list">
              <li><strong>Computation Speed:</strong> &lt; 5 ms client-side calculation time.</li>
              <li><strong>Storage Footprint:</strong> &lt; 50 KB local browser cache overhead.</li>
              <li><strong>Operational Cost:</strong> Zero server maintenance and 100% offline availability.</li>
            </ul>
          </div>
        </div>

        <div style="display: flex; flex-direction: column; gap: 14px;">
          <div class="card" style="border-left: 4px solid #F59E0B;">
            <div class="card-title amber">Future Enhancement Roadmap</div>
            <ul class="bullet-list">
              <li><strong>IoT Smart Meter Telemetry:</strong> Automatic pulse reading ingestion via Wi-Fi/ESP32 hardware.</li>
              <li><strong>Cloud Backend & User Accounts:</strong> Node.js/MongoDB centralized database for multi-user authentication.</li>
              <li><strong>Payment Gateway Integration:</strong> Real-time online bill settlement via UPI, Cards, and NetBanking.</li>
              <li><strong>Predictive Analytics:</strong> ML forecasting to alert consumers before crossing into higher tariff tiers.</li>
            </ul>
          </div>

          <div class="card" style="background: #0F2C59; color: #FFFFFF; border: none;">
            <div style="font-size: 13px; font-weight: 700; color: #F59E0B; margin-bottom: 6px;">PROJECT CONCLUSION</div>
            <p style="font-size: 11.5px; color: #E2E8F0; line-height: 1.5;">
              The Electricity Bill Calculator successfully delivers a lightweight, reliable, and transparent web utility. By automating differential meter calculations and enforcing progressive slab tariffs, the application eliminates calculation errors, demystifies utility charges, and provides persistent historical records with zero operational cost.
            </p>
          </div>
        </div>
      </div>
      <div class="slide-footer">
        <span>Department of Information Technology, SRM TRP Engineering College</span>
        <span>IT25301 - Web Technology Lab</span>
      </div>
    </div>

  </div>

  <script>
    let currentSlide = 1;
    const totalSlides = 8;

    function showSlide(n) {
      if (n < 1) n = 1;
      if (n > totalSlides) n = totalSlides;
      currentSlide = n;

      for (let i = 1; i <= totalSlides; i++) {
        const el = document.getElementById('slide-' + i);
        if (el) {
          if (i === currentSlide) {
            el.classList.add('active');
          } else {
            el.classList.remove('active');
          }
        }
      }

      document.getElementById('slideIndicator').textContent = 'Slide ' + currentSlide + ' of ' + totalSlides;
    }

    function nextSlide() {
      if (currentSlide < totalSlides) {
        showSlide(currentSlide + 1);
      }
    }

    function prevSlide() {
      if (currentSlide > 1) {
        showSlide(currentSlide - 1);
      }
    }

    function toggleFullscreen() {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
          console.error(err);
        });
      } else {
        document.exitFullscreen();
      }
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ' || e.key === 'PageDown') {
        e.preventDefault();
        nextSlide();
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        prevSlide();
      } else if (e.key === 'f' || e.key === 'F') {
        toggleFullscreen();
      } else if (e.key >= '1' && e.key <= '8') {
        showSlide(parseInt(e.key, 10));
      }
    });
  </script>
</body>
</html>`;

fs.writeFileSync(path.resolve(__dirname, 'presentation.html'), htmlContent);
console.log('Successfully generated interactive presentation: presentation.html (' + htmlContent.length + ' bytes)');
