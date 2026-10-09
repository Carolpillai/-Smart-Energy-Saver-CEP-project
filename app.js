/* ==========================================================================
   SMART ENERGY SAVER — INTERACTIVE APPLICATION LOGIC
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // Application State
  const state = {
    tariff: 8.00,
    snapshotItems: [
      { id: '1', name: 'Air Conditioner', watts: 1500, hours: 6, days: 30, kwh: 270, cost: 2160 },
      { id: '2', name: 'Ceiling Fan (2 Fans)', watts: 150, hours: 10, days: 30, kwh: 45, cost: 360 },
      { id: '3', name: 'Smart TV', watts: 100, hours: 4, days: 30, kwh: 12, cost: 96 }
    ],
    habitAnswers: {},
    quizCurrentStep: 0,
    challengeData: null, // Initialized via loadChallengeState() below
    localityName: 'Green Valley Community',
    researcher1: 'Carol Pillai (Field Lead)',
    researcher2: 'Alex Smith (Tech Lead)'
  };

  // --------------------------------------------------------------------------
  // 1. STICKY NAVBAR & NAVIGATION
  // --------------------------------------------------------------------------
  const navbar = document.getElementById('mainNavbar');
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const navLinks = document.getElementById('navLinks');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Active Section Highlight
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 120;

    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      const id = sec.getAttribute('id');
      const link = document.querySelector(`.nav-links a[href="#${id}"]`);

      if (scrollPos >= top && scrollPos < top + height) {
        document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
        if (link) link.classList.add('active');
      }
    });
  });

  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', () => {
      navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
      if (navLinks.style.display === 'flex') {
        navLinks.style.flexDirection = 'column';
        navLinks.style.position = 'absolute';
        navLinks.style.top = '100%';
        navLinks.style.left = '0';
        navLinks.style.width = '100%';
        navLinks.style.background = 'rgba(9, 35, 40, 0.96)';
        navLinks.style.padding = '1.5rem';
        navLinks.style.backdropFilter = 'blur(16px)';
      }
    });
  }

  // --------------------------------------------------------------------------
  // 2. HERO CANVAS ANIMATION (Glowing Energy Ring & Micro-Particles)
  // --------------------------------------------------------------------------
  const canvas = document.getElementById('heroCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    function resizeCanvas() {
      const rect = canvas.parentElement.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const particles = [];
    const particleCount = 35;
    const centerX = () => canvas.width / 2;
    const centerY = () => canvas.height / 2;
    const radius = () => Math.min(canvas.width, canvas.height) * 0.32;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        angle: (Math.PI * 2 / particleCount) * i,
        speed: 0.005 + Math.random() * 0.01,
        size: 2 + Math.random() * 3.5,
        distOffset: (Math.random() - 0.5) * 20,
        alpha: 0.3 + Math.random() * 0.7
      });
    }

    let pulse = 0;

    function animateHeroCanvas() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const cx = centerX();
      const cy = centerY();
      const r = radius();

      pulse += 0.03;
      const currentRadius = r + Math.sin(pulse) * 4;

      // Outer Glowing Ring
      ctx.beginPath();
      ctx.arc(cx, cy, currentRadius, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(139, 187, 146, 0.25)';
      ctx.lineWidth = 12;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(cx, cy, currentRadius, 0, Math.PI * 2);
      ctx.strokeStyle = '#2A835F';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Particle Trail
      particles.forEach(p => {
        p.angle += p.speed;
        const pr = currentRadius + p.distOffset;
        const x = cx + Math.cos(p.angle) * pr;
        const y = cy + Math.sin(p.angle) * pr;

        ctx.beginPath();
        ctx.arc(x, y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(139, 187, 146, ${p.alpha})`;
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(x, y);
        ctx.strokeStyle = `rgba(42, 131, 95, 0.05)`;
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      animationFrameId = requestAnimationFrame(animateHeroCanvas);
    }
    animateHeroCanvas();

    // Fluctuating Hero Wattage Readout
    setInterval(() => {
      const liveElem = document.getElementById('heroLivePower');
      if (liveElem) {
        const val = 1220 + Math.floor(Math.random() * 45);
        liveElem.textContent = `${val.toLocaleString()} W`;
      }
    }, 2500);
  }

  // --------------------------------------------------------------------------
  // 3. FIELD RESEARCH CHART.JS VISUALIZATIONS & GOOGLE FORM LIVE SYNC
  // --------------------------------------------------------------------------
  const chartColors = {
    primary: '#2A835F',
    secondary: '#12544F',
    highlight: '#8BBB92',
    dark: '#092328',
    coral: '#D96B5B',
    amber: '#E29E4B',
    muted: '#B5C9C3'
  };

  let chart1, chart2, chart3, chart4;

  // Chart 1: Appliance Wattage Awareness
  const ctx1 = document.getElementById('awarenessChart');
  if (ctx1) {
    chart1 = new Chart(ctx1, {
      type: 'doughnut',
      data: {
        labels: ['Correctly Aware (24%)', 'Vague Guess (52%)', 'Completely Unaware (24%)'],
        datasets: [{
          data: [24, 52, 24],
          backgroundColor: [chartColors.primary, chartColors.amber, chartColors.coral],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom', labels: { font: { family: 'DM Sans', size: 12 } } }
        },
        cutout: '70%'
      }
    });
  }

  // Chart 2: Electricity Bill Monitoring Habits
  const ctx2 = document.getElementById('monitoringChart');
  if (ctx2) {
    chart2 = new Chart(ctx2, {
      type: 'bar',
      data: {
        labels: ['Check Bill Total', 'Track kWh Units', 'Compare Seasonal', 'Keep History'],
        datasets: [{
          label: '% of Households',
          data: [82, 18, 29, 12],
          backgroundColor: chartColors.secondary,
          borderRadius: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: { beginAtZero: true, max: 100, ticks: { callback: v => v + '%' } },
          x: { grid: { display: false } }
        }
      }
    });
  }

  // Chart 3: Standby Power Practice
  const ctx3 = document.getElementById('standbyChart');
  if (ctx3) {
    chart3 = new Chart(ctx3, {
      type: 'pie',
      data: {
        labels: ['Always Plugged In (62%)', 'Switched Off at Wall (28%)', 'Unplugged Unused (10%)'],
        datasets: [{
          data: [62, 28, 10],
          backgroundColor: [chartColors.coral, chartColors.highlight, chartColors.primary],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom', labels: { font: { family: 'DM Sans', size: 12 } } }
        }
      }
    });
  }

  // Chart 4: Willingness to Adopt Energy Tool
  const ctx4 = document.getElementById('willingnessChart');
  if (ctx4) {
    chart4 = new Chart(ctx4, {
      type: 'bar',
      data: {
        labels: ['High Interest', 'Moderate Interest', 'Low Interest'],
        datasets: [{
          label: '% Willing',
          data: [88, 9, 3],
          backgroundColor: [chartColors.primary, chartColors.highlight, chartColors.muted],
          borderRadius: 8
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: { x: { beginAtZero: true, max: 100, ticks: { callback: v => v + '%' } } }
      }
    });
  }

  // --------------------------------------------------------------------------
  // GOOGLE FORM LIVE SYNC ENGINE & MODAL CONTROLLERS
  // --------------------------------------------------------------------------
  const openFormModalBtn = document.getElementById('openFormModalBtn');
  const closeFormModalBtn = document.getElementById('closeFormModalBtn');
  const closeFormModalFooterBtn = document.getElementById('closeFormModalFooterBtn');
  const googleFormModal = document.getElementById('googleFormModal');
  const toggleGoogleSheetUrlBtn = document.getElementById('toggleGoogleSheetUrlBtn');
  const googleFormSettingsDrawer = document.getElementById('googleFormSettingsDrawer');
  const syncGoogleFormBtn = document.getElementById('syncGoogleFormBtn');
  const saveSheetUrlBtn = document.getElementById('saveSheetUrlBtn');
  const googleSheetCsvUrlInput = document.getElementById('googleSheetCsvUrlInput');
  const googleSheetSyncStatus = document.getElementById('googleSheetSyncStatus');
  const googleFormStatusBadge = document.getElementById('googleFormStatusBadge');

  // Modal Handlers
  if (openFormModalBtn && googleFormModal) {
    openFormModalBtn.addEventListener('click', () => {
      googleFormModal.style.display = 'flex';
    });
  }
  if (closeFormModalBtn && googleFormModal) {
    closeFormModalBtn.addEventListener('click', () => {
      googleFormModal.style.display = 'none';
    });
  }
  if (closeFormModalFooterBtn && googleFormModal) {
    closeFormModalFooterBtn.addEventListener('click', () => {
      googleFormModal.style.display = 'none';
    });
  }
  if (googleFormModal) {
    googleFormModal.addEventListener('click', (e) => {
      if (e.target === googleFormModal) {
        googleFormModal.style.display = 'none';
      }
    });
  }

  // Drawer Toggle
  if (toggleGoogleSheetUrlBtn && googleFormSettingsDrawer) {
    toggleGoogleSheetUrlBtn.addEventListener('click', () => {
      googleFormSettingsDrawer.style.display = googleFormSettingsDrawer.style.display === 'none' ? 'block' : 'none';
    });
  }

  const DEFAULT_SHEET_URL = 'https://docs.google.com/spreadsheets/d/1NCV-kzztU3zt-dJ9vhF2PTHr84eNDdbkD84x4s1dTaY/export?format=csv';

  // Saved Sheet URL Key
  const STORAGE_KEY_CSV_URL = 'cep_google_sheet_csv_url';
  const savedUrl = localStorage.getItem(STORAGE_KEY_CSV_URL) || DEFAULT_SHEET_URL;
  if (googleSheetCsvUrlInput) {
    googleSheetCsvUrlInput.value = savedUrl;
  }

  // Parse CSV Helper
  function parseCSV(text) {
    const lines = text.trim().split('\n');
    return lines.map(line => {
      const row = [];
      let inQuotes = false;
      let cur = '';
      for (let i = 0; i < line.length; i++) {
        const c = line[i];
        if (c === '"') {
          inQuotes = !inQuotes;
        } else if (c === ',' && !inQuotes) {
          row.push(cur.trim());
          cur = '';
        } else {
          cur += c;
        }
      }
      row.push(cur.trim());
      return row;
    });
  }

  // Fetch Live Google Sheet CSV & Update Charts Live
  async function fetchLiveGoogleFormData(rawUrl) {
    const targetUrl = rawUrl || savedUrl || DEFAULT_SHEET_URL;
    if (!targetUrl) return;

    let csvUrl = targetUrl.trim();
    
    // Auto-convert standard Google Sheet share URL to CSV endpoint
    if (csvUrl.includes('docs.google.com/spreadsheets/d/')) {
      const matches = csvUrl.match(/\/d\/([a-zA-Z0-9-_]+)/);
      if (matches && matches[1] && !csvUrl.includes('output=csv') && !csvUrl.includes('format=csv')) {
        const sheetId = matches[1];
        csvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv`;
      }
    }

    if (googleSheetSyncStatus) {
      googleSheetSyncStatus.style.display = 'block';
      googleSheetSyncStatus.style.color = '#701559';
      googleSheetSyncStatus.textContent = 'Syncing live survey responses from Google Sheet...';
    }

    try {
      const resp = await fetch(csvUrl);
      if (!resp.ok) throw new Error('HTTP error ' + resp.status);
      const csvText = await resp.text();
      const rows = parseCSV(csvText);

      if (rows.length <= 1) {
        if (googleSheetSyncStatus) {
          googleSheetSyncStatus.textContent = 'Google Sheet connected! Waiting for survey responses...';
        }
        return;
      }

      const totalResponses = rows.length - 1; // subtract header

      // Calculate total residents reached from household size column (Col 1)
      let totalResidentsCount = 0;
      let acCount = 0, washCount = 0, fridgeCount = 0, fanOtherCount = 0, notSureCount = 0;
      let checkMonthlyCount = 0, check2to3MonthCount = 0, checkOccasionCount = 0, checkNeverCount = 0;
      let unplugYesCount = 0, unplugMaybeCount = 0, unplugNoCount = 0;
      let toolYesCount = 0, toolMaybeCount = 0, toolNoCount = 0;

      for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        if (!row || row.length < 5) continue;

        // Col 1: Household size
        const hhSizeStr = (row[1] || '').trim();
        if (hhSizeStr.includes('5-6')) totalResidentsCount += 5.5;
        else if (hhSizeStr.includes('3-4')) totalResidentsCount += 3.5;
        else if (hhSizeStr.includes('1-2')) totalResidentsCount += 1.5;
        else totalResidentsCount += 4;

        // Col 3: Highest consuming appliance perception
        const highestApp = (row[3] || '').toLowerCase();
        if (highestApp.includes('air conditioner')) acCount++;
        else if (highestApp.includes('washing machine')) washCount++;
        else if (highestApp.includes('refrigerator')) fridgeCount++;
        else if (highestApp.includes('not sure')) notSureCount++;
        else fanOtherCount++;

        // Col 6: Monitoring frequency
        const monitorFreq = (row[6] || '').toLowerCase();
        if (monitorFreq.includes('every month')) checkMonthlyCount++;
        else if (monitorFreq.includes('2–3') || monitorFreq.includes('2-3')) check2to3MonthCount++;
        else if (monitorFreq.includes('occasionally') || monitorFreq.includes('rarely')) checkOccasionCount++;
        else checkNeverCount++;

        // Col 5: Unplugging/standby behavior
        const unplugAns = (row[5] || '').toLowerCase();
        if (unplugAns.includes('yes')) unplugYesCount++;
        else if (unplugAns.includes('maybe')) unplugMaybeCount++;
        else unplugNoCount++;

        // Col 9: Tool adoption willingness
        const toolAns = (row[9] || '').toLowerCase();
        if (toolAns.includes('yes')) toolYesCount++;
        else if (toolAns.includes('maybe')) toolMaybeCount++;
        else toolNoCount++;
      }

      // Update meta stat items
      const hElem = document.getElementById('resMetaHouseholds');
      const rElem = document.getElementById('resMetaResidents');
      if (hElem) hElem.textContent = `${totalResponses}`;
      if (rElem) rElem.textContent = `${Math.round(totalResidentsCount)}`;

      const pct = val => Math.round((val / totalResponses) * 100);

      // Update Chart 1: Highest Consuming Appliance Perception
      if (chart1) {
        chart1.data.labels = [
          `Air Conditioner (${pct(acCount)}%)`,
          `Washing Machine (${pct(washCount)}%)`,
          `Refrigerator (${pct(fridgeCount)}%)`,
          `Fan / Other (${pct(fanOtherCount)}%)`,
          `Uncertain (${pct(notSureCount)}%)`
        ];
        chart1.data.datasets[0].data = [acCount, washCount, fridgeCount, fanOtherCount, notSureCount];
        chart1.data.datasets[0].backgroundColor = [chartColors.coral, chartColors.amber, chartColors.secondary, chartColors.primary, chartColors.muted];
        chart1.update();
      }

      // Update Chart 2: Bill Monitoring Habits
      if (chart2) {
        chart2.data.labels = ['Every Month', 'Every 2-3 Months', 'Occasionally / Rarely', 'Never'];
        chart2.data.datasets[0].data = [pct(checkMonthlyCount), pct(check2to3MonthCount), pct(checkOccasionCount), pct(checkNeverCount)];
        chart2.update();
      }

      // Update Chart 3: Unplugging / Standby Practices
      if (chart3) {
        chart3.data.labels = [
          `Always Unplug (${pct(unplugYesCount)}%)`,
          `Sometimes (${pct(unplugMaybeCount)}%)`,
          `Never / Standby Waste (${pct(unplugNoCount)}%)`
        ];
        chart3.data.datasets[0].data = [unplugYesCount, unplugMaybeCount, unplugNoCount];
        chart3.update();
      }

      // Update Chart 4: Willingness to Adopt Tool
      if (chart4) {
        chart4.data.labels = [`Definite Yes (${pct(toolYesCount)}%)`, `Maybe (${pct(toolMaybeCount)}%)`, `Unlikely (${pct(toolNoCount)}%)`];
        chart4.data.datasets[0].data = [pct(toolYesCount), pct(toolMaybeCount), pct(toolNoCount)];
        chart4.update();
      }

      if (googleSheetSyncStatus) {
        googleSheetSyncStatus.style.color = '#2A835F';
        googleSheetSyncStatus.textContent = `✓ Successfully synced ${totalResponses} real live responses from your Google Form!`;
      }
      if (googleFormStatusBadge) {
        googleFormStatusBadge.style.background = '#2A835F';
        googleFormStatusBadge.textContent = `● ${totalResponses} Live Responses Synced`;
      }

    } catch (err) {
      console.warn('Google Sheet Live Sync Error:', err);
      if (googleSheetSyncStatus) {
        googleSheetSyncStatus.style.color = '#D96B5B';
        googleSheetSyncStatus.textContent = 'Live Sync Active! Paste your published Google Sheet CSV link if updating manually.';
      }
    }
  }

  // Save CSV URL Handler
  if (saveSheetUrlBtn && googleSheetCsvUrlInput) {
    saveSheetUrlBtn.addEventListener('click', () => {
      const url = googleSheetCsvUrlInput.value.trim();
      if (url) {
        localStorage.setItem(STORAGE_KEY_CSV_URL, url);
        fetchLiveGoogleFormData(url);
      }
    });
  }

  // Sync Button Handler
  if (syncGoogleFormBtn) {
    syncGoogleFormBtn.addEventListener('click', () => {
      const url = googleSheetCsvUrlInput ? googleSheetCsvUrlInput.value.trim() : savedUrl;
      if (url) {
        fetchLiveGoogleFormData(url);
      } else {
        if (googleFormSettingsDrawer) googleFormSettingsDrawer.style.display = 'block';
        alert('Please paste your published Google Sheet CSV link in the Form Settings drawer to enable live automatic updates!');
      }
    });
  }

  // Auto-sync on page load if CSV URL saved
  if (savedUrl) {
    fetchLiveGoogleFormData(savedUrl);
  }

  // --------------------------------------------------------------------------
  // AI APPLIANCE BRAND & MODEL POWER ESTIMATION CATALOG & NLP ENGINE
  // --------------------------------------------------------------------------
  // --------------------------------------------------------------------------
  // AI APPLIANCE BRAND & MODEL POWER ESTIMATION CATALOG & MULTI-SEARCH ENGINE
  // --------------------------------------------------------------------------
  const aiApplianceDb = [
    // Whirlpool Brands & Models
    { keywords: ['whirlpool', 'whirlpool ac', 'whirlpool 1.5', 'whirlpool magicool'], name: 'Whirlpool Magicool 1.5T 5-Star Inverter AC', watts: 1460, category: '1500|Air Conditioner', confidence: 'High Spec' },
    { keywords: ['whirlpool 3 star ac', 'whirlpool 3s'], name: 'Whirlpool 1.5T 3-Star Inverter AC', watts: 1660, category: '1500|Air Conditioner', confidence: 'High Spec' },
    { keywords: ['whirlpool fridge', 'whirlpool refrigerator', 'whirlpool 240l'], name: 'Whirlpool 240L Frost Free Refrigerator', watts: 210, category: '200|Refrigerator', confidence: 'High Spec' },
    { keywords: ['whirlpool washer', 'whirlpool washing machine'], name: 'Whirlpool 7Kg Royal Top Load Washing Machine', watts: 360, category: '600|Washing Machine', confidence: 'High Spec' },

    // Daikin ACs
    { keywords: ['daikin', 'daikin ac', 'daikin 1.5', 'daikin 5 star', 'daikin inverter'], name: 'Daikin 1.5T 5-Star Inverter AC', watts: 1450, category: '1500|Air Conditioner', confidence: 'High Spec' },
    { keywords: ['daikin 3 star', 'daikin 1.5t 3s'], name: 'Daikin 1.5T 3-Star Inverter AC', watts: 1620, category: '1500|Air Conditioner', confidence: 'High Spec' },
    { keywords: ['daikin 1 ton', 'daikin 1t'], name: 'Daikin 1.0T 5-Star Inverter AC', watts: 1050, category: '1500|Air Conditioner', confidence: 'High Spec' },
    { keywords: ['daikin 2 ton', 'daikin 2t'], name: 'Daikin 2.0T 5-Star Inverter AC', watts: 2250, category: '1500|Air Conditioner', confidence: 'High Spec' },

    // Voltas ACs
    { keywords: ['voltas', 'voltas ac', 'voltas 1.5', 'voltas 5 star'], name: 'Voltas 1.5T 5-Star Adjustable Inverter AC', watts: 1480, category: '1500|Air Conditioner', confidence: 'High Spec' },
    { keywords: ['voltas 3 star', 'voltas 1.5t 3s'], name: 'Voltas 1.5T 3-Star Fixed Speed AC', watts: 1750, category: '1500|Air Conditioner', confidence: 'High Spec' },
    { keywords: ['voltas 1 ton', 'voltas 1t'], name: 'Voltas 1.0T 3-Star Split AC', watts: 1150, category: '1500|Air Conditioner', confidence: 'High Spec' },

    // LG ACs & Appliances
    { keywords: ['lg', 'lg ac', 'lg 1.5', 'lg dual inverter', 'lg 5 star'], name: 'LG Dual Inverter 1.5T 5-Star AC', watts: 1440, category: '1500|Air Conditioner', confidence: 'High Spec' },
    { keywords: ['lg 3 star', 'lg 1.5t 3s'], name: 'LG 1.5T 3-Star Dual Inverter AC', watts: 1620, category: '1500|Air Conditioner', confidence: 'High Spec' },
    { keywords: ['lg fridge', 'lg refrigerator', 'lg 253l'], name: 'LG 260L 3-Star Smart Inverter Refrigerator', watts: 180, category: '200|Refrigerator', confidence: 'High Spec' },
    { keywords: ['lg washer', 'lg washing machine', 'lg 7kg'], name: 'LG 7Kg Front Load Inverter Washing Machine', watts: 400, category: '600|Washing Machine', confidence: 'High Spec' },

    // Samsung ACs & Appliances
    { keywords: ['samsung', 'samsung ac', 'samsung 1.5', 'samsung windfree'], name: 'Samsung WindFree 1.5T 5-Star Inverter AC', watts: 1420, category: '1500|Air Conditioner', confidence: 'High Spec' },
    { keywords: ['samsung 3 star ac', 'samsung 1.5t 3s'], name: 'Samsung 1.5T 3-Star Convertible AC', watts: 1640, category: '1500|Air Conditioner', confidence: 'High Spec' },
    { keywords: ['samsung fridge', 'samsung refrigerator', 'samsung 253l'], name: 'Samsung 253L 3-Star Inverter Frost Free', watts: 170, category: '200|Refrigerator', confidence: 'High Spec' },
    { keywords: ['samsung washer', 'samsung top load'], name: 'Samsung 6.5Kg Top Load Washing Machine', watts: 350, category: '600|Washing Machine', confidence: 'High Spec' },

    // Blue Star & Hitachi & Carrier & Panasonic & O General & Lloyd & Godrej & Haier
    { keywords: ['blue star', 'blue star ac', 'blue star 1.5'], name: 'Blue Star 1.5T 5-Star Inverter AC', watts: 1470, category: '1500|Air Conditioner', confidence: 'High Spec' },
    { keywords: ['hitachi', 'hitachi ac', 'hitachi 1.5'], name: 'Hitachi 1.5T 5-Star Inverter AC', watts: 1430, category: '1500|Air Conditioner', confidence: 'High Spec' },
    { keywords: ['panasonic', 'panasonic ac', 'panasonic mirai', 'panasonic 1.5'], name: 'Panasonic MirAi 1.5T 5-Star Twin Cool AC', watts: 1440, category: '1500|Air Conditioner', confidence: 'High Spec' },
    { keywords: ['carrier', 'carrier ac', 'carrier 1.5', 'carrier flexicool'], name: 'Carrier 1.5T 5-Star Flexicool Inverter AC', watts: 1465, category: '1500|Air Conditioner', confidence: 'High Spec' },
    { keywords: ['o general', 'ogeneral', 'o general ac'], name: 'O General 1.5T 5-Star Inverter AC', watts: 1520, category: '1500|Air Conditioner', confidence: 'High Spec' },
    { keywords: ['lloyd', 'lloyd ac', 'lloyd 1.5'], name: 'Lloyd 1.5T 5-Star Inverter AC', watts: 1475, category: '1500|Air Conditioner', confidence: 'High Spec' },
    { keywords: ['haier', 'haier ac', 'haier 1.5'], name: 'Haier 1.5T 5-Star Triple Inverter AC', watts: 1460, category: '1500|Air Conditioner', confidence: 'High Spec' },
    { keywords: ['godrej', 'godrej ac', 'godrej 1.5'], name: 'Godrej 1.5T 5-Star Inverter AC', watts: 1455, category: '1500|Air Conditioner', confidence: 'High Spec' },

    // Fans & Water Heaters & Kitchen
    { keywords: ['atomberg', 'atomberg bldc', 'bldc fan'], name: 'Atomberg Renesa BLDC Fan (28W)', watts: 28, category: '75|Ceiling Fan', confidence: 'High Spec' },
    { keywords: ['crompton', 'crompton silentpro', 'crompton fan'], name: 'Crompton SilentPro BLDC Fan (35W)', watts: 35, category: '75|Ceiling Fan', confidence: 'High Spec' },
    { keywords: ['havells', 'havells fan'], name: 'Havells Efficient 5-Star Fan (52W)', watts: 52, category: '75|Ceiling Fan', confidence: 'High Spec' },
    { keywords: ['orient', 'orient fan'], name: 'Orient Electric Regular Fan (75W)', watts: 75, category: '75|Ceiling Fan', confidence: 'High Spec' },
    { keywords: ['philips', 'philips air fryer', 'air fryer'], name: 'Philips HD9200 Air Fryer', watts: 1500, category: 'custom', confidence: 'High Spec' },
    { keywords: ['microwave', 'ifb microwave'], name: 'IFB 28L Convection Microwave', watts: 1400, category: 'custom', confidence: 'High Spec' },
    { keywords: ['induction', 'prestige induction'], name: 'Prestige 2000W Induction Cooktop', watts: 1800, category: 'custom', confidence: 'High Spec' },
    { keywords: ['geyser', 'ao smith', 'racold'], name: 'AO Smith / Racold 25L Geyser', watts: 2000, category: '2000|Water Heater', confidence: 'High Spec' }
  ];

  function runAiPowerSearch(queryStr) {
    if (!queryStr || !queryStr.trim()) return [];
    const q = queryStr.toLowerCase().trim();

    // Collect all catalog matches
    const matches = aiApplianceDb.filter(item => 
      item.keywords.some(kw => q.includes(kw) || kw.includes(q))
    );

    if (matches.length > 0) {
      return matches;
    }

    // Heuristic Fallback Parser
    const wMatch = q.match(/(\d{3,4})\s*(w|watts|watt)/i);
    if (wMatch) {
      return [{ name: queryStr, watts: parseInt(wMatch[1]), category: 'custom', confidence: 'Exact Spec' }];
    }

    if (q.includes('ac') || q.includes('cooling') || q.includes('air conditioner')) {
      return [
        { name: queryStr + ' 1.5T 5-Star Inverter AC', watts: 1450, category: '1500|Air Conditioner', confidence: 'Estimated' },
        { name: queryStr + ' 1.5T 3-Star Non-Inverter AC', watts: 1750, category: '1500|Air Conditioner', confidence: 'Estimated' },
        { name: queryStr + ' 1.0T 5-Star Inverter AC', watts: 1050, category: '1500|Air Conditioner', confidence: 'Estimated' },
        { name: queryStr + ' 2.0T 5-Star Inverter AC', watts: 2250, category: '1500|Air Conditioner', confidence: 'Estimated' }
      ];
    }

    if (q.includes('fridge') || q.includes('refrigerator')) {
      return [
        { name: queryStr + ' 250L Frost Free Refrigerator', watts: 170, category: '200|Refrigerator', confidence: 'Estimated' },
        { name: queryStr + ' 190L Single Door Refrigerator', watts: 120, category: '200|Refrigerator', confidence: 'Estimated' }
      ];
    }

    if (q.includes('fan')) {
      return [
        { name: queryStr + ' BLDC Energy Saver Fan', watts: 30, category: '75|Ceiling Fan', confidence: 'Estimated' },
        { name: queryStr + ' Standard Ceiling Fan', watts: 70, category: '75|Ceiling Fan', confidence: 'Estimated' }
      ];
    }

    return [{ name: queryStr, watts: 500, category: 'custom', confidence: 'AI Estimated' }];
  }

  // AI Search Event Listeners & Multi-Result Renderer
  const aiBrandQuery = document.getElementById('aiBrandQuery');
  const aiSearchBtn = document.getElementById('aiSearchBtn');
  const aiResultBox = document.getElementById('aiResultBox');

  function handleAiSearch(query) {
    const results = runAiPowerSearch(query);
    if (!aiResultBox) return;

    if (!results || results.length === 0) {
      aiResultBox.style.display = 'none';
      return;
    }

    let html = `<div style="font-size:0.8rem; font-weight:700; color:var(--color-deep-teal); margin-bottom:0.6rem; text-transform:uppercase; letter-spacing:0.05em;">Found ${results.length} model match${results.length > 1 ? 'es' : ''} in database:</div>`;
    
    html += `<div style="display:flex; flex-direction:column; gap:0.6rem; max-height:220px; overflow-y:auto; padding-right:4px;">`;
    results.forEach((item, idx) => {
      html += `
        <div style="display:flex; justify-content:space-between; align-items:center; background:#F7F5EF; padding:0.6rem 0.8rem; border-radius:var(--radius-sm); border:1px solid var(--color-border); flex-wrap:wrap; gap:0.4rem;">
          <div>
            <div style="font-weight:700; font-size:0.875rem; color:var(--color-primary-dark);">${item.name}</div>
            <div style="font-size:0.75rem; color:var(--color-text-muted);">
              Power Draw: <strong style="color:var(--color-fresh-green);">${item.watts.toLocaleString()} W</strong>
              <span style="color:var(--color-deep-teal); font-weight:600; margin-left:4px;">(${item.confidence})</span>
            </div>
          </div>
          <button type="button" class="btn btn-primary btn-sm apply-ai-spec-btn" data-idx="${idx}" style="padding:0.25rem 0.6rem; font-size:0.75rem;">
            <i data-lucide="check" style="width:12px;"></i> Select This Machine
          </button>
        </div>
      `;
    });
    html += `</div>`;

    aiResultBox.innerHTML = html;
    aiResultBox.style.display = 'block';

    if (window.lucide) window.lucide.createIcons();

    // Bind event handlers for "Select This Machine" buttons
    aiResultBox.querySelectorAll('.apply-ai-spec-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.getAttribute('data-idx'));
        const selected = results[idx];
        if (!selected) return;

        const calcWatts = document.getElementById('calcWatts');
        const calcSelect = document.getElementById('calcAppliance');
        const customGroup = document.getElementById('customNameGroup');
        const customApplianceName = document.getElementById('customApplianceName');
        const wattsSourceTag = document.getElementById('wattsSourceTag');

        if (calcWatts) calcWatts.value = selected.watts;

        if (calcSelect) {
          if (selected.category === 'custom') {
            calcSelect.value = 'custom';
            if (customGroup) customGroup.style.display = 'block';
            if (customApplianceName) customApplianceName.value = selected.name;
          } else {
            calcSelect.value = selected.category;
            if (customGroup) customGroup.style.display = 'none';
          }
        }

        if (wattsSourceTag) {
          wattsSourceTag.textContent = `✨ Auto Spec: ${selected.name}`;
        }

        updateCalculatorResults();
        aiResultBox.style.display = 'none';
      });
    });
  }

  if (aiSearchBtn && aiBrandQuery) {
    aiSearchBtn.addEventListener('click', () => {
      handleAiSearch(aiBrandQuery.value);
    });

    aiBrandQuery.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleAiSearch(aiBrandQuery.value);
      }
    });
  }

  document.querySelectorAll('.ai-quick-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      const q = pill.getAttribute('data-query');
      if (aiBrandQuery) aiBrandQuery.value = q;
      handleAiSearch(q);
    });
  });

  // --------------------------------------------------------------------------
  // BRAND & MACHINE MODEL COMPARISON DATABASE
  // --------------------------------------------------------------------------
  const brandModelsCatalog = {
    '1500|Air Conditioner': [
      { name: 'Daikin 1.5T 5-Star Inverter AC', watts: 1450, badge: '🟢 Most Efficient Inverter', badgeClass: 'impact-low', desc: '5-Star Inverter Tech (~1,450W). Cost: ~₹2,088/mo. Saves ₹576/mo over older 3-Star non-inverter models.' },
      { name: 'Voltas 1.5T 5-Star Adjustable Inverter AC', watts: 1480, badge: '🟢 5-Star Adjustable', badgeClass: 'impact-low', desc: 'Adjustable Tonnage Inverter (~1,480W). Cost: ~₹2,131/mo.' },
      { name: 'LG Dual Inverter 1.5T 5-Star AC', watts: 1440, badge: '🟢 Dual Inverter AI', badgeClass: 'impact-low', desc: 'Dual Inverter Technology (~1,440W). Cost: ~₹2,073/mo.' },
      { name: 'Samsung WindFree 1.5T 5-Star Inverter AC', watts: 1420, badge: '🟢 WindFree Cooling', badgeClass: 'impact-low', desc: 'WindFree Energy Saver (~1,420W). Cost: ~₹2,044/mo.' },
      { name: 'Whirlpool Magicool 1.5T 5-Star Inverter AC', watts: 1460, badge: '🟢 6th Sense Inverter', badgeClass: 'impact-low', desc: '6th Sense Fast Cooling (~1,460W). Cost: ~₹2,102/mo.' },
      { name: 'Blue Star 1.5T 5-Star Inverter AC', watts: 1470, badge: '🟢 Heavy Duty Inverter', badgeClass: 'impact-low', desc: 'Heavy Duty Tropical Inverter (~1,470W). Cost: ~₹2,116/mo.' },
      { name: 'Hitachi 1.5T 5-Star Inverter AC', watts: 1430, badge: '🟢 Expandable Inverter', badgeClass: 'impact-low', desc: 'Expandable Inverter Cooling (~1,430W). Cost: ~₹2,059/mo.' },
      { name: 'Panasonic MirAi 1.5T 5-Star Twin Cool AC', watts: 1440, badge: '🟢 Smart Wi-Fi Inverter', badgeClass: 'impact-low', desc: 'Shield-protected Twin Cool (~1,440W). Cost: ~₹2,073/mo.' },
      { name: 'Carrier 1.5T 5-Star Flexicool Inverter AC', watts: 1465, badge: '🟢 Flexicool 6-in-1', badgeClass: 'impact-low', desc: '6-in-1 Flexicool Inverter (~1,465W). Cost: ~₹2,109/mo.' },
      { name: 'O General 1.5T 5-Star Tropical Inverter AC', watts: 1520, badge: '🟡 Premium Heavy Duty', badgeClass: 'impact-medium', desc: 'Hyper Tropical Compressor (~1,520W). Cost: ~₹2,188/mo.' },
      { name: 'Lloyd 1.5T 5-Star Inverter AC', watts: 1475, badge: '🟢 Rapid Cooling', badgeClass: 'impact-low', desc: '4-Way Air Swing Inverter (~1,475W). Cost: ~₹2,124/mo.' },
      { name: 'Godrej 1.5T 5-Star Inverter AC', watts: 1455, badge: '🟢 Nano Shield Eco', badgeClass: 'impact-low', desc: 'Eco Mode Anti-Viral Inverter (~1,455W). Cost: ~₹2,095/mo.' },
      { name: 'Voltas 1.5T 3-Star Non-Inverter AC', watts: 1750, badge: '🔴 High Power Draw', badgeClass: 'impact-high', desc: 'Fixed Speed Non-Inverter (~1,750W). Cost: ~₹2,520/mo. Consider upgrading to 5-Star Inverter to save ₹5,180/yr.' },
      { name: 'LG 1.5T 3-Star Non-Inverter AC', watts: 1850, badge: '🔴 High Power Draw', badgeClass: 'impact-high', desc: 'Older Non-Inverter Compressor (~1,850W). Cost: ~₹2,664/mo. Upgrading to 5-Star Inverter saves ₹7,090/year.' },
      { name: 'Daikin 1.0T 5-Star Inverter AC', watts: 1050, badge: '🟢 Small Room (1.0 Ton)', badgeClass: 'impact-low', desc: 'Ideal for bedrooms (<120 sq ft) (~1,050W). Cost: ~₹1,512/mo.' },
      { name: 'Blue Star 2.0T 5-Star Inverter AC', watts: 2250, badge: '🟡 Large Room (2.0 Ton)', badgeClass: 'impact-medium', desc: 'For large halls (>200 sq ft) (~2,250W). Cost: ~₹3,240/mo.' }
    ],
    '75|Ceiling Fan': [
      { name: 'Atomberg Renesa BLDC Fan', watts: 28, badge: '🟢 Most Efficient (Save ₹400/yr)', badgeClass: 'impact-low', desc: 'BLDC Motor Tech. Uses only 28W (~₹67/mo). Saves 62% electricity compared to standard 75W fans.' },
      { name: 'Crompton SilentPro BLDC Fan', watts: 35, badge: '🟢 Silent BLDC', badgeClass: 'impact-low', desc: 'Ultra-quiet BLDC Tech. Uses 35W (~₹84/mo).' },
      { name: 'Havells Efficient 5-Star Fan', watts: 52, badge: '🟡 Standard 5-Star', badgeClass: 'impact-medium', desc: '5-Star Induction Motor. Uses 52W (~₹125/mo).' },
      { name: 'Orient Electric Regular Fan', watts: 75, badge: '🔴 Traditional Motor', badgeClass: 'impact-high', desc: 'Conventional Fan Motor. Uses 75W (~₹180/mo). Upgrading to BLDC saves ₹1,350/year per fan.' }
    ],
    '200|Refrigerator': [
      { name: 'Samsung 253L 3-Star Inverter Frost Free', watts: 170, badge: '🟢 Most Efficient', badgeClass: 'impact-low', desc: 'Digital Inverter Compressor. Uses ~170W continuous (~₹979/mo).' },
      { name: 'LG 260L 3-Star Smart Inverter', watts: 180, badge: '🟢 Smart Inverter', badgeClass: 'impact-low', desc: 'Smart Inverter Compressor. Uses ~180W continuous (~₹1,036/mo).' },
      { name: 'Whirlpool 240L Frost Free', watts: 210, badge: '🟡 Standard Frost Free', badgeClass: 'impact-medium', desc: 'Standard Compressor. Uses ~210W continuous (~₹1,209/mo).' },
      { name: 'Godrej 190L Direct Cool 4-Star', watts: 120, badge: '🟢 Single Door (Low Draw)', badgeClass: 'impact-low', desc: 'Direct Cool Single Door. Uses ~120W continuous (~₹691/mo).' },
      { name: 'Haier 570L Side-by-Side', watts: 320, badge: '🟡 Large Capacity', badgeClass: 'impact-medium', desc: 'Twin Inverter Side-by-Side. Uses ~320W continuous (~₹1,843/mo).' }
    ],
    '600|Washing Machine': [
      { name: 'LG 7Kg Front Load Inverter', watts: 400, badge: '🟢 Water & Energy Saver', badgeClass: 'impact-low', desc: 'Direct Drive Inverter. Uses ~400W (Cold Wash). Hot wash cycles use up to 1800W.' },
      { name: 'Bosch 7.5Kg Front Load', watts: 450, badge: '🟢 German Inverter', badgeClass: 'impact-low', desc: 'EcoSilence Drive. Uses ~450W (Cold Wash).' },
      { name: 'Samsung 6.5Kg Top Load', watts: 350, badge: '🟢 Top Load (Low Draw)', badgeClass: 'impact-low', desc: 'Digital Inverter Top Load. Uses ~350W.' },
      { name: 'IFB 7Kg Executive Front Load', watts: 420, badge: '🟢 Heavy Duty Front Load', badgeClass: 'impact-low', desc: 'Triadic Wash System. Uses ~420W.' }
    ],
    '100|Smart TV': [
      { name: 'LG 43" 4K Smart LED TV', watts: 75, badge: '🟢 Most Efficient Mid-Size', badgeClass: 'impact-low', desc: '4K Smart LED Display. Uses 75W (~₹72/mo for 4 hrs daily).' },
      { name: 'Sony Bravia 55" 4K OLED TV', watts: 135, badge: '🟡 OLED Display', badgeClass: 'impact-medium', desc: 'Self-lit OLED Panel. Uses 135W (~₹130/mo).' },
      { name: 'Samsung 32" HD LED TV', watts: 45, badge: '🟢 Compact / Low Draw', badgeClass: 'impact-low', desc: 'HD LED Display. Uses 45W (~₹43/mo).' },
      { name: 'TCL 65" QLED 4K TV', watts: 180, badge: '🔴 Large QLED Panel', badgeClass: 'impact-high', desc: 'High brightness QLED Panel. Uses 180W (~₹173/mo).' }
    ],
    '2000|Water Heater': [
      { name: 'AO Smith Has 15L 5-Star Storage Geyser', watts: 2000, badge: '🟢 5-Star Insulation', badgeClass: 'impact-low', desc: 'Glass-lined Anode Tank. Uses 2,000W (~₹720/mo for 1.5 hrs daily).' },
      { name: 'Racold Eterno Pro 25L 5-Star Geyser', watts: 2000, badge: '🟢 Fast Heating', badgeClass: 'impact-low', desc: 'Titanium Coated Tank. Uses 2,000W.' },
      { name: 'Bajaj Flora 3L Instant Geyser', watts: 3000, badge: '🔴 High Instant Peak Draw', badgeClass: 'impact-high', desc: 'Instant Heating Coil. Uses 3,000W peak.' }
    ],
    '65|Laptop Computer': [
      { name: 'Apple MacBook Air M2 / M3', watts: 35, badge: '🟢 Ultra-Efficient ARM', badgeClass: 'impact-low', desc: 'Apple Silicon Chip. Uses only 35W (~₹50/mo for 8 hrs daily).' },
      { name: 'Dell / HP Business Laptop', watts: 65, badge: '🟢 Standard Laptop', badgeClass: 'impact-low', desc: 'Intel / AMD Processor. Uses 65W (~₹94/mo).' },
      { name: 'Custom Gaming PC & 144Hz Monitor', watts: 450, badge: '🔴 High Performance Rig', badgeClass: 'impact-high', desc: 'Discrete GPU + Display. Uses 450W (~₹648/mo).' }
    ],
    '12|LED Lighting (5 Bulbs)': [
      { name: 'Philips 9W 5-Star LED Bulbs (5 Bulbs)', watts: 45, badge: '🟢 High Efficiency LED', badgeClass: 'impact-low', desc: '5 Bulbs @ 9W each = 45W total (~₹65/mo for 6 hrs daily).' },
      { name: 'Wipro 12W Smart LED Bulbs (5 Bulbs)', watts: 60, badge: '🟢 Smart Wi-Fi LED', badgeClass: 'impact-low', desc: '5 Bulbs @ 12W each = 60W total (~₹86/mo).' },
      { name: 'Conventional Incandescent Bulbs (5 Bulbs)', watts: 300, badge: '🔴 Outdated Filament Bulbs', badgeClass: 'impact-high', desc: '5 Bulbs @ 60W = 300W total (~₹432/mo). Upgrading to LED saves ₹4,400/year.' }
    ]
  };

  // --------------------------------------------------------------------------
  // 4. INTERACTIVE ENERGY CALCULATOR & TIERED TARIFF ENGINE
  // --------------------------------------------------------------------------
  const calcSelect = document.getElementById('calcAppliance');
  const calcBrandModel = document.getElementById('calcBrandModel');
  const brandModelGroup = document.getElementById('brandModelGroup');
  const brandCompBanner = document.getElementById('brandCompBanner');
  const brandCompDesc = document.getElementById('brandCompDesc');
  const brandEfficiencyBadge = document.getElementById('brandEfficiencyBadge');
  const customGroup = document.getElementById('customNameGroup');
  const calcWatts = document.getElementById('calcWatts');
  const calcHours = document.getElementById('calcHours');
  const calcDays = document.getElementById('calcDays');
  const calcTariff = document.getElementById('calcTariff');
  const tariffModeSelect = document.getElementById('tariffMode');
  const flatTariffGroup = document.getElementById('flatTariffGroup');
  const tieredSlabBox = document.getElementById('tieredSlabBox');
  const calcForm = document.getElementById('calcForm');

  function populateBrandModelDropdown(categoryKey) {
    if (!calcBrandModel) return;
    calcBrandModel.innerHTML = '';

    const models = brandModelsCatalog[categoryKey];
    if (models && models.length > 0) {
      if (brandModelGroup) brandModelGroup.style.display = 'block';
      models.forEach((m, idx) => {
        const opt = document.createElement('option');
        opt.value = idx;
        opt.textContent = `${m.name} (${m.watts}W)`;
        calcBrandModel.appendChild(opt);
      });
      updateSelectedBrandModelInfo(categoryKey, 0);
    } else {
      if (brandModelGroup) brandModelGroup.style.display = 'none';
      if (brandCompBanner) brandCompBanner.style.display = 'none';
    }
  }

  function updateSelectedBrandModelInfo(categoryKey, index) {
    const models = brandModelsCatalog[categoryKey];
    if (models && models[index]) {
      const item = models[index];
      if (calcWatts) calcWatts.value = item.watts;
      if (brandCompBanner) {
        brandCompBanner.style.display = 'block';
        if (brandCompDesc) brandCompDesc.textContent = item.desc;
        if (brandEfficiencyBadge) {
          brandEfficiencyBadge.textContent = item.badge;
          brandEfficiencyBadge.className = `impact-badge ${item.badgeClass}`;
        }
      }
      updateCalculatorResults();
    }
  }

  if (calcSelect) {
    calcSelect.addEventListener('change', () => {
      const val = calcSelect.value;
      if (val === 'custom') {
        if (customGroup) customGroup.style.display = 'block';
        if (brandModelGroup) brandModelGroup.style.display = 'none';
        if (brandCompBanner) brandCompBanner.style.display = 'none';
        if (calcWatts) calcWatts.value = 500;
      } else {
        if (customGroup) customGroup.style.display = 'none';
        populateBrandModelDropdown(val);
      }
    });
  }

  if (calcBrandModel) {
    calcBrandModel.addEventListener('change', () => {
      const categoryKey = calcSelect.value;
      const idx = parseInt(calcBrandModel.value) || 0;
      updateSelectedBrandModelInfo(categoryKey, idx);
    });
  }

  // Initial population of brand models for default category
  if (calcSelect && calcSelect.value) {
    populateBrandModelDropdown(calcSelect.value);
  }

  if (tariffModeSelect) {
    tariffModeSelect.addEventListener('change', () => {
      if (tariffModeSelect.value === 'tiered') {
        if (flatTariffGroup) flatTariffGroup.style.display = 'none';
        if (tieredSlabBox) tieredSlabBox.style.display = 'block';
      } else {
        if (flatTariffGroup) flatTariffGroup.style.display = 'block';
        if (tieredSlabBox) tieredSlabBox.style.display = 'none';
      }
      updateCalculatorResults();
    });
  }

  function computeKwhCost(kwh, mode, flatRate) {
    if (mode === 'tiered') {
      let cost = 0;
      if (kwh <= 100) {
        cost = kwh * 4.50;
      } else if (kwh <= 300) {
        cost = (100 * 4.50) + ((kwh - 100) * 7.50);
      } else {
        cost = (100 * 4.50) + (200 * 7.50) + ((kwh - 300) * 10.50);
      }
      return cost;
    }
    return kwh * flatRate;
  }

  if (calcSelect) {
    calcSelect.addEventListener('change', () => {
      const val = calcSelect.value;
      if (val === 'custom') {
        customGroup.style.display = 'block';
        calcWatts.value = 500;
      } else {
        customGroup.style.display = 'none';
        const parts = val.split('|');
        calcWatts.value = parts[0];
      }
    });
  }

  function getSelectedApplianceName() {
    if (calcSelect.value === 'custom') {
      const nameInput = document.getElementById('customApplianceName');
      return (nameInput && nameInput.value.trim()) ? nameInput.value.trim() : 'Custom Appliance';
    }
    if (calcBrandModel && calcBrandModel.options.length > 0 && calcBrandModel.selectedIndex >= 0) {
      const categoryKey = calcSelect.value;
      const models = brandModelsCatalog[categoryKey];
      const idx = calcBrandModel.selectedIndex;
      if (models && models[idx]) {
        return models[idx].name;
      }
    }
    return calcSelect.options[calcSelect.selectedIndex].text.split(' (')[0];
  }

  function updateCalculatorResults() {
    const watts = parseFloat(calcWatts.value) || 0;
    const hours = parseFloat(calcHours.value) || 0;
    const days = parseFloat(calcDays.value) || 0;
    const tariff = parseFloat(calcTariff.value) || 8.00;
    state.tariff = tariff;

    const mode = tariffModeSelect ? tariffModeSelect.value : 'flat';

    const monthlyKwh = (watts * hours * days) / 1000;
    const monthlyCost = computeKwhCost(monthlyKwh, mode, tariff);

    const reducedHours = Math.max(0, hours - 1);
    const reducedKwh = (watts * reducedHours * days) / 1000;
    const reducedCost = computeKwhCost(reducedKwh, mode, tariff);
    const savedKwh = monthlyKwh - reducedKwh;
    const savedCost = monthlyCost - reducedCost;

    // DOM Updates
    document.getElementById('resApplianceTitle').textContent = getSelectedApplianceName();
    document.getElementById('resMonthlyKwh').textContent = `${monthlyKwh.toFixed(1)} kWh`;
    document.getElementById('resMonthlyCost').textContent = `₹${Math.round(monthlyCost).toLocaleString()}`;
    
    const resTariffLabel = document.getElementById('resTariffLabel');
    if (resTariffLabel) {
      resTariffLabel.textContent = mode === 'tiered' ? 'Estimated Monthly Cost (Tiered Utility Slabs)' : 'Estimated Monthly Cost (Flat Rate)';
    }

    document.getElementById('compCurrentVal').textContent = `${monthlyKwh.toFixed(1)} kWh`;
    document.getElementById('compReducedVal').textContent = `${reducedKwh.toFixed(1)} kWh`;

    const reducedPercent = monthlyKwh > 0 ? (reducedKwh / monthlyKwh) * 100 : 0;
    document.getElementById('barFillReduced').style.width = `${reducedPercent.toFixed(1)}%`;

    document.getElementById('savingsText').textContent = 
      `Potential Savings: ${savedKwh.toFixed(1)} kWh/month (Save ₹${Math.round(savedCost).toLocaleString()}/month)`;

    // Environmental Badges
    const trees = Math.max(1, Math.round(savedKwh * 0.037 * 12));
    const carKm = Math.round(savedKwh * 4.1);

    const treeBadge = document.getElementById('treeBadge');
    const carBadge = document.getElementById('carBadge');
    if (treeBadge) treeBadge.textContent = `🌳 ~${trees} Trees / yr`;
    if (carBadge) carBadge.textContent = `🚗 ~${carKm} km Driving Offset`;
  }

  if (calcForm) {
    calcForm.addEventListener('submit', (e) => {
      e.preventDefault();
      updateCalculatorResults();
    });

    [calcWatts, calcHours, calcDays, calcTariff].forEach(input => {
      if (input) input.addEventListener('input', updateCalculatorResults);
    });
  }

  // 1-CLICK DEMO HOUSEHOLD DATA LOADER
  const loadDemoDataBtn = document.getElementById('loadDemoDataBtn');
  if (loadDemoDataBtn) {
    loadDemoDataBtn.addEventListener('click', () => {
      state.snapshotItems = [
        { id: '1', name: 'Air Conditioner (1.5 Ton Inverter)', watts: 1500, hours: 6, days: 30, kwh: 270, cost: 2160 },
        { id: '2', name: 'Refrigerator (253L Frost Free)', watts: 200, hours: 24, days: 30, kwh: 144, cost: 1152 },
        { id: '3', name: 'Ceiling Fans (2 Fans, 150W)', watts: 150, hours: 10, days: 30, kwh: 45, cost: 360 },
        { id: '4', name: 'Smart TV (43-inch LED)', watts: 100, hours: 4, days: 30, kwh: 12, cost: 96 },
        { id: '5', name: 'Geyser / Water Heater (25L)', watts: 2000, hours: 1.5, days: 30, kwh: 90, cost: 720 }
      ];
      renderSnapshotTable();

      const calcElem = document.getElementById('calculator');
      if (calcElem) calcElem.scrollIntoView({ behavior: 'smooth' });
    });
  }

  // MULTI-APPLIANCE SNAPSHOT LIST MANAGEMENT & PDF AUDIT EXPORTER
  const addToSnapshotBtn = document.getElementById('addToSnapshotBtn');
  const snapshotTableBody = document.getElementById('snapshotTableBody');
  const clearSnapshotBtn = document.getElementById('clearSnapshotBtn');
  const downloadAuditReportBtn = document.getElementById('downloadAuditReportBtn');

  if (downloadAuditReportBtn) {
    downloadAuditReportBtn.addEventListener('click', () => {
      let totalKwh = 0;
      let totalCost = 0;
      let largestApp = 'None';
      let maxKwh = -1;

      let tableRowsHtml = '';
      state.snapshotItems.forEach(item => {
        totalKwh += item.kwh;
        totalCost += item.cost;
        if (item.kwh > maxKwh) { maxKwh = item.kwh; largestApp = item.name; }
        tableRowsHtml += `
          <tr>
            <td style="padding:10px; border-bottom:1px solid #E0EBF0;"><strong>${item.name}</strong></td>
            <td style="padding:10px; border-bottom:1px solid #E0EBF0;">${item.watts} W</td>
            <td style="padding:10px; border-bottom:1px solid #E0EBF0;">${item.hours} hrs/day</td>
            <td style="padding:10px; border-bottom:1px solid #E0EBF0; font-weight:bold; color:#12544F;">${item.kwh.toFixed(1)} kWh</td>
            <td style="padding:10px; border-bottom:1px solid #E0EBF0; font-weight:bold; color:#092328;">₹${Math.round(item.cost).toLocaleString()}</td>
          </tr>
        `;
      });

      const scoreNum = document.getElementById('scoreDisplayNum') ? document.getElementById('scoreDisplayNum').textContent : '72';
      const dateStr = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

      const printWin = window.open('', '_blank');
      printWin.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Smart Energy Saver — Household Energy Audit Report</title>
          <style>
            body { font-family: 'DM Sans', sans-serif, Arial; color: #1C2E32; padding: 40px; line-height: 1.5; }
            .header { border-bottom: 3px solid #2A835F; padding-bottom: 15px; margin-bottom: 25px; display: flex; justify-content: space-between; align-items: center; }
            .title { font-size: 26px; font-weight: bold; color: #092328; font-family: Georgia, serif; }
            .sub { font-size: 13px; color: #53696E; margin-top: 4px; }
            .cards { display: flex; gap: 15px; margin-bottom: 25px; }
            .card { flex: 1; background: #F7F5EF; padding: 15px; border-radius: 8px; border: 1px solid #D8E5DF; }
            .card-val { font-size: 24px; font-weight: bold; color: #2A835F; margin-top: 4px; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 25px; text-align: left; }
            th { background: #092328; color: #fff; padding: 10px; font-size: 12px; text-transform: uppercase; }
            .footer { border-top: 1px solid #D8E5DF; padding-top: 15px; margin-top: 40px; font-size: 12px; color: #53696E; display: flex; justify-content: space-between; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <div class="title">Smart Energy Saver</div>
              <div class="sub">Official Household Electricity Audit & Action Plan — Student Field Research</div>
            </div>
            <div style="text-align: right; font-size: 13px; color: #53696E;">
              <div><strong>Date:</strong> ${dateStr}</div>
              <div><strong>Locality:</strong> ${state.localityName || 'Green Valley Community'}</div>
            </div>
          </div>

          <div class="cards">
            <div class="card">
              <div style="font-size:11px; text-transform:uppercase; color:#53696E; font-weight:bold;">Total Monthly kWh</div>
              <div class="card-val">${totalKwh.toFixed(1)} kWh</div>
            </div>
            <div class="card">
              <div style="font-size:11px; text-transform:uppercase; color:#53696E; font-weight:bold;">Total Monthly Cost</div>
              <div class="card-val" style="color:#092328;">₹${Math.round(totalCost).toLocaleString()}</div>
            </div>
            <div class="card">
              <div style="font-size:11px; text-transform:uppercase; color:#53696E; font-weight:bold;">Energy Score Index</div>
              <div class="card-val" style="color:#2A835F;">${scoreNum} / 100</div>
            </div>
            <div class="card">
              <div style="font-size:11px; text-transform:uppercase; color:#53696E; font-weight:bold;">Top Energy Hog</div>
              <div class="card-val" style="font-size:15px; color:#B83A2E;">${largestApp}</div>
            </div>
          </div>

          <h3 style="color:#092328; font-family:Georgia, serif; margin-bottom:10px;">Household Appliance Portfolio Breakdown</h3>
          <table>
            <thead>
              <tr>
                <th>Appliance Name</th>
                <th>Power Rating (W)</th>
                <th>Daily Usage</th>
                <th>Monthly Consumption</th>
                <th>Monthly Cost (₹)</th>
              </tr>
            </thead>
            <tbody>
              ${tableRowsHtml || '<tr><td colspan="5" style="text-align:center; padding:20px; color:#777;">No appliances listed in snapshot.</td></tr>'}
            </tbody>
          </table>

          <div style="background:#E4F0E6; padding:18px; border-radius:8px; border:1px solid #8BBB92; margin-top:20px;">
            <h4 style="margin:0 0 8px 0; color:#12544F;">Environmental Footprint & Conservation Roadmap</h4>
            <div style="font-size:13px; color:#1C2E32;">
              • <strong>Trees Equivalent Offset:</strong> ~${Math.max(1, Math.round(totalKwh * 0.037 * 12))} Trees Planted / Year<br>
              • <strong>Petrol Driving Offset:</strong> ~${Math.round(totalKwh * 4.1)} km Driving Avoided<br>
              • <strong>Action Recommendation:</strong> Reducing Air Conditioner and heavy appliance runtime by 1 hour daily saves up to 15% on your electricity bill and lowers billing tariff slabs.
            </div>
          </div>

          <div class="footer">
            <div>Student Project Team: ${state.researcher1 || 'Carol Pillai'} & ${state.researcher2 || 'Alex Smith'}</div>
            <div>A Student Field Project on Household Electricity Conservation</div>
          </div>

          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
        </html>
      `);
      printWin.document.close();
    });
  }

  function renderSnapshotTable() {
    if (!snapshotTableBody) return;
    snapshotTableBody.innerHTML = '';

    let totalKwh = 0;
    let totalCost = 0;
    let largestApp = null;
    let maxKwh = -1;

    if (state.snapshotItems.length === 0) {
      snapshotTableBody.innerHTML = `
        <tr>
          <td colspan="6" style="text-align: center; color: var(--color-text-muted); padding: 2rem;">
            No appliances added yet. Select an appliance above and click "Add to Home List".
          </td>
        </tr>
      `;
    } else {
      state.snapshotItems.forEach((item, index) => {
        totalKwh += item.kwh;
        totalCost += item.cost;
        if (item.kwh > maxKwh) {
          maxKwh = item.kwh;
          largestApp = item;
        }

        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td><strong>${item.name}</strong></td>
          <td>${item.watts} W</td>
          <td>${item.hours} hrs/day</td>
          <td><strong>${item.kwh.toFixed(1)} kWh</strong></td>
          <td><strong>₹${Math.round(item.cost).toLocaleString()}</strong></td>
          <td>
            <button class="btn btn-outline btn-sm remove-item-btn" data-index="${index}" style="padding: 0.25rem 0.5rem; font-size: 0.75rem;">
              <i data-lucide="x"></i>
            </button>
          </td>
        `;
        snapshotTableBody.appendChild(tr);
      });
    }

    document.getElementById('snapTotalKwh').textContent = `${totalKwh.toFixed(1)} kWh`;
    document.getElementById('snapTotalCost').textContent = `₹${Math.round(totalCost).toLocaleString()}`;

    if (largestApp) {
      document.getElementById('snapLargestAppliance').textContent = largestApp.name;
      document.getElementById('snapLargestDetail').textContent = `${largestApp.kwh.toFixed(1)} kWh/month (${Math.round((largestApp.kwh / totalKwh) * 100)}% of home usage)`;
    } else {
      document.getElementById('snapLargestAppliance').textContent = 'None Added';
      document.getElementById('snapLargestDetail').textContent = 'Add items to identify hog';
    }

    if (window.lucide) window.lucide.createIcons();
    renderPersonalizedRecommendations();
  }

  if (addToSnapshotBtn) {
    addToSnapshotBtn.addEventListener('click', () => {
      const name = getSelectedApplianceName();
      const watts = parseFloat(calcWatts.value) || 0;
      const hours = parseFloat(calcHours.value) || 0;
      const days = parseFloat(calcDays.value) || 30;
      const kwh = (watts * hours * days) / 1000;
      const cost = kwh * state.tariff;

      state.snapshotItems.push({
        id: Date.now().toString(),
        name, watts, hours, days, kwh, cost
      });

      renderSnapshotTable();
    });
  }

  if (snapshotTableBody) {
    snapshotTableBody.addEventListener('click', (e) => {
      const btn = e.target.closest('.remove-item-btn');
      if (btn) {
        const index = parseInt(btn.getAttribute('data-index'));
        state.snapshotItems.splice(index, 1);
        renderSnapshotTable();
      }
    });
  }

  if (clearSnapshotBtn) {
    clearSnapshotBtn.addEventListener('click', () => {
      state.snapshotItems = [];
      renderSnapshotTable();
    });
  }

  renderSnapshotTable();

  // --------------------------------------------------------------------------
  // 5. YOUR ENERGY SCORE DIAGNOSTIC ENGINE
  // --------------------------------------------------------------------------
  const habitQuestions = [
    { id: 'q0', title: '1. Do you set your Air Conditioner thermostat at 24°C or higher?', max: 35 },
    { id: 'q1', title: '2. Do you switch off main wall sockets for chargers & TV when unused?', max: 35 },
    { id: 'q2', title: '3. Do you use energy-efficient LED lighting throughout your home?', max: 30 }
  ];

  const scoreHabitContainer = document.getElementById('scoreHabitQuestions');

  function renderHabitDiagnosticQuestions() {
    if (!scoreHabitContainer) return;
    scoreHabitContainer.innerHTML = '';

    habitQuestions.forEach((q) => {
      const div = document.createElement('div');
      div.className = 'quiz-question-item';

      const currentAns = state.habitAnswers[q.id];
      const hasAnswer = (currentAns !== undefined);

      div.innerHTML = `
        <div class="quiz-q-title">${q.title}</div>
        <div class="quiz-options">
          <button type="button" class="quiz-opt-btn ${hasAnswer && currentAns === q.max ? 'selected' : ''}" data-qid="${q.id}" data-val="${q.max}">Always</button>
          <button type="button" class="quiz-opt-btn ${hasAnswer && currentAns === Math.round(q.max / 2) ? 'selected' : ''}" data-qid="${q.id}" data-val="${Math.round(q.max / 2)}">Sometimes</button>
          <button type="button" class="quiz-opt-btn ${hasAnswer && currentAns === 0 ? 'selected' : ''}" data-qid="${q.id}" data-val="0">Rarely / No</button>
        </div>
      `;
      scoreHabitContainer.appendChild(div);
    });
  }

  function calculateAndAnimateScore() {
    const answeredCount = Object.keys(state.habitAnswers).length;
    let earned = 0;
    Object.values(state.habitAnswers).forEach(val => earned += val);
    const score = answeredCount === 0 ? 0 : Math.min(100, Math.max(0, Math.round(earned)));

    const numElem = document.getElementById('scoreDisplayNum');
    const gaugeCircle = document.getElementById('scoreGaugeProgress');
    const feedbackTitle = document.getElementById('scoreFeedbackTitle');
    const feedbackDesc = document.getElementById('scoreFeedbackDesc');

    if (numElem) numElem.textContent = score;

    if (gaugeCircle) {
      const maxOffset = 565.48; // 2 * PI * 90
      const offset = answeredCount === 0 ? maxOffset : (maxOffset - (maxOffset * score / 100));
      gaugeCircle.style.strokeDashoffset = offset;
    }

    if (feedbackTitle && feedbackDesc) {
      if (answeredCount === 0) {
        feedbackTitle.textContent = 'Habit Diagnostic';
        feedbackDesc.textContent = 'Answer the habit questions on the right to calculate your household conservation score.';
      } else if (score >= 80) {
        feedbackTitle.textContent = 'Energy Champion';
        feedbackDesc.textContent = 'Excellent conservation habits! Your household is minimizing avoidable energy waste effectively.';
      } else if (score >= 60) {
        feedbackTitle.textContent = 'Good Conservation Habits';
        feedbackDesc.textContent = 'You are doing well — a few small habit tweaks could take your energy savings even further.';
      } else if (score >= 40) {
        feedbackTitle.textContent = 'Moderate Savings Potential';
        feedbackDesc.textContent = 'Noticeable opportunities identified! Reducing standby power and AC duration will cut your bill.';
      } else {
        feedbackTitle.textContent = 'High Optimization Needed';
        feedbackDesc.textContent = 'Substantial energy waste detected across major appliances. Review our personalized action steps below.';
      }
    }

    renderPersonalizedRecommendations();
  }

  if (scoreHabitContainer) {
    scoreHabitContainer.addEventListener('click', (e) => {
      const btn = e.target.closest('.quiz-opt-btn');
      if (btn) {
        const qid = btn.getAttribute('data-qid');
        const val = parseInt(btn.getAttribute('data-val'));
        state.habitAnswers[qid] = val;

        const parent = btn.parentElement;
        parent.querySelectorAll('.quiz-opt-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');

        calculateAndAnimateScore();
      }
    });
  }

  renderHabitDiagnosticQuestions();
  calculateAndAnimateScore();

  // --------------------------------------------------------------------------
  // 6. PERSONALIZED RECOMMENDATIONS GENERATOR
  // --------------------------------------------------------------------------
  function renderPersonalizedRecommendations() {
    const grid = document.getElementById('recsGrid');
    if (!grid) return;

    const recs = [
      {
        num: '01',
        title: 'Optimize Air Conditioner Duration',
        desc: 'Reducing daily cooling runtime by just 1 hour cuts estimated monthly consumption by ~45 kWh (~₹360/month).',
        action: 'Set thermostat to 24°C & use 1-hr sleep timer'
      },
      {
        num: '02',
        title: 'Eliminate Standby Power Drain',
        desc: 'Set-top boxes, microwave clocks, and laptop chargers draw 5–15W continuously. Turn off switches at wall socket.',
        action: 'Unplug idle electronics every evening'
      },
      {
        num: '03',
        title: 'Maximize Natural Daylight',
        desc: 'Replacing artificial lighting during daytime hours reduces lighting electricity demand by up to 40%.',
        action: 'Open curtains during peak morning hours'
      },
      {
        num: '04',
        title: 'Cold Water Washing Cycles',
        desc: 'Water heating accounts for 80% of washing machine energy. Cold washes clean effectively while protecting fabrics.',
        action: 'Switch laundry dial to 30°C / Eco mode'
      }
    ];

    grid.innerHTML = '';
    recs.forEach(r => {
      const card = document.createElement('div');
      card.className = 'rec-card';
      card.innerHTML = `
        <div class="rec-number">${r.num}</div>
        <h4>${r.title}</h4>
        <p>${r.desc}</p>
        <div class="rec-action-badge">
          <i data-lucide="check-circle" style="width: 16px; color: var(--color-fresh-green);"></i>
          <span>${r.action}</span>
        </div>
      `;
      grid.appendChild(card);
    });

    if (window.lucide) window.lucide.createIcons();
  }





  // --------------------------------------------------------------------------
  // 9. 7-DAY ENERGY CHALLENGE INTERACTIVE TRACKER (1 CLICK PER DAY ENFORCEMENT)
  // --------------------------------------------------------------------------
  const CHALLENGE_STORAGE_KEY = 'smartEnergySaver_challenge_v2';

  function loadChallengeState() {
    try {
      const raw = localStorage.getItem(CHALLENGE_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        return {
          completedDays: Array.isArray(parsed.completedDays) ? parsed.completedDays : [],
          lastCheckInDate: parsed.lastCheckInDate || null
        };
      }
    } catch (e) {
      console.warn('Could not load challenge from localStorage', e);
    }
    return {
      completedDays: [],
      lastCheckInDate: null
    };
  }

  function saveChallengeState(completedDays, lastCheckInDate) {
    try {
      localStorage.setItem(CHALLENGE_STORAGE_KEY, JSON.stringify({
        completedDays,
        lastCheckInDate
      }));
    } catch (e) {
      console.warn('Could not save challenge to localStorage', e);
    }
  }

  function getTodayDateString() {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // Initialize state challenge data
  state.challengeData = loadChallengeState();

  const daysTracker = document.getElementById('daysTracker');
  const challengeProgressText = document.getElementById('challengeProgressText');
  const challengeStatusMsg = document.getElementById('challengeStatusMsg');
  const resetChallengeBtn = document.getElementById('resetChallengeBtn');
  const simulateNextDayBtn = document.getElementById('simulateNextDayBtn');

  function updateChallengeUI(customMessage = null) {
    if (!daysTracker) return;
    const bubbles = daysTracker.querySelectorAll('.day-bubble');
    const todayStr = getTodayDateString();
    const completed = state.challengeData.completedDays;
    const lastDate = state.challengeData.lastCheckInDate;
    const hasCheckedInToday = (lastDate === todayStr);
    const nextDayToUnlock = completed.length < 7 ? completed.length + 1 : null;

    bubbles.forEach(b => {
      const day = parseInt(b.getAttribute('data-day'));
      b.classList.remove('completed', 'active-today', 'locked', 'shake');

      if (completed.includes(day)) {
        b.classList.add('completed');
        b.setAttribute('title', `Day ${day}: Completed!`);
      } else if (day === nextDayToUnlock) {
        if (hasCheckedInToday) {
          b.classList.add('locked');
          b.setAttribute('title', `Day ${day}: Locked until tomorrow.`);
        } else {
          b.classList.add('active-today');
          b.setAttribute('title', `Day ${day}: Ready to log today!`);
        }
      } else {
        b.classList.add('locked');
        b.setAttribute('title', `Day ${day}: Locked (complete prior days first).`);
      }
    });

    if (challengeProgressText) {
      challengeProgressText.textContent = `${completed.length} of 7 Days Completed`;
    }

    if (challengeStatusMsg) {
      if (customMessage) {
        challengeStatusMsg.innerHTML = customMessage;
      } else if (completed.length === 7) {
        challengeStatusMsg.innerHTML = '🏆 <strong>Challenge Completed!</strong> You successfully completed all 7 days of energy conservation!';
      } else if (hasCheckedInToday) {
        challengeStatusMsg.innerHTML = `✅ <strong>Day ${completed[completed.length - 1]} logged for today!</strong> Come back tomorrow to unlock Day ${nextDayToUnlock}.`;
      } else {
        challengeStatusMsg.innerHTML = `⚡ <strong>Day ${nextDayToUnlock} is ready!</strong> Click Day ${nextDayToUnlock} to record today's habit.`;
      }
    }

    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  if (daysTracker) {
    daysTracker.addEventListener('click', (e) => {
      const bubble = e.target.closest('.day-bubble');
      if (!bubble) return;

      const day = parseInt(bubble.getAttribute('data-day'));
      const todayStr = getTodayDateString();
      const completed = state.challengeData.completedDays;
      const lastDate = state.challengeData.lastCheckInDate;
      const hasCheckedInToday = (lastDate === todayStr);
      const nextDayToUnlock = completed.length < 7 ? completed.length + 1 : null;

      // Case 1: Already completed this day
      if (completed.includes(day)) {
        bubble.classList.add('shake');
        setTimeout(() => bubble.classList.remove('shake'), 400);
        updateChallengeUI(`ℹ️ Day ${day} is already completed.`);
        return;
      }

      // Case 2: All 7 days finished
      if (completed.length >= 7) {
        updateChallengeUI('🏆 You have completed all 7 days! Fantastic work.');
        return;
      }

      // Case 3: Already clicked / logged today (1 click per day rule)
      if (hasCheckedInToday) {
        bubble.classList.add('shake');
        setTimeout(() => bubble.classList.remove('shake'), 400);
        updateChallengeUI(`🔒 <strong>Daily Limit:</strong> You can only complete 1 day per 24 hours. Day ${nextDayToUnlock} unlocks tomorrow!`);
        return;
      }

      // Case 4: Clicked a future day skipping the sequence
      if (day !== nextDayToUnlock) {
        bubble.classList.add('shake');
        setTimeout(() => bubble.classList.remove('shake'), 400);
        updateChallengeUI(`👉 Please click <strong>Day ${nextDayToUnlock}</strong> first to log today's progress.`);
        return;
      }

      // Case 5: Valid check-in for today!
      state.challengeData.completedDays.push(day);
      state.challengeData.lastCheckInDate = todayStr;
      saveChallengeState(state.challengeData.completedDays, state.challengeData.lastCheckInDate);

      const nextUnlocked = day < 7 ? day + 1 : null;
      const successMsg = nextUnlocked
        ? `🎉 <strong>Day ${day} Completed!</strong> Great job! Return tomorrow to unlock Day ${nextUnlocked}.`
        : `🎉 <strong>Day 7 Completed!</strong> Congratulations, you completed the entire 7-day challenge! 🌟`;

      updateChallengeUI(successMsg);
    });
  }

  if (resetChallengeBtn) {
    resetChallengeBtn.addEventListener('click', () => {
      state.challengeData = {
        completedDays: [],
        lastCheckInDate: null
      };
      saveChallengeState([], null);
      updateChallengeUI('🔄 <strong>Tracker Reset:</strong> Day 1 is now ready to log today!');
    });
  }

  if (simulateNextDayBtn) {
    simulateNextDayBtn.addEventListener('click', () => {
      // Simulate that the last check-in occurred yesterday so today's click is unlocked
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;
      
      state.challengeData.lastCheckInDate = yesterdayStr;
      saveChallengeState(state.challengeData.completedDays, yesterdayStr);

      const nextDay = state.challengeData.completedDays.length < 7 ? state.challengeData.completedDays.length + 1 : null;
      if (nextDay) {
        updateChallengeUI(`⏩ <strong>Demo Simulated:</strong> Day ${nextDay} is now unlocked and ready to click!`);
      } else {
        updateChallengeUI(`🏆 All 7 days are already completed!`);
      }
    });
  }

  // Initial render on page load
  updateChallengeUI();

  // --------------------------------------------------------------------------
  // 10. COMMUNITY IMPACT SLIDER
  // --------------------------------------------------------------------------
  const commHouseSlider = document.getElementById('commHouseSlider');
  if (commHouseSlider) {
    commHouseSlider.addEventListener('input', () => {
      const count = parseInt(commHouseSlider.value);
      document.getElementById('commHouseCount').textContent = count;

      const totalKwh = count * 45; // 45 kWh/month average saving per home
      const totalCost = totalKwh * state.tariff;
      const totalCo2 = Math.round(totalKwh * 0.82); // 0.82 kg CO2 per kWh

      document.getElementById('commTotalKwh').textContent = `${totalKwh.toLocaleString()} kWh`;
      document.getElementById('commTotalCost').textContent = `₹${Math.round(totalCost).toLocaleString()}`;
      document.getElementById('commTotalCo2').textContent = `${totalCo2.toLocaleString()} kg`;
    });
  }

  // --------------------------------------------------------------------------
  // 11. BILL OCR SCANNER & CONSUMPTION DIAGNOSTIC ENGINE
  // --------------------------------------------------------------------------
  const ocrDropzone = document.getElementById('ocrDropzone');
  const billFileInput = document.getElementById('billFileInput');
  const ocrDropzoneContent = document.getElementById('ocrDropzoneContent');
  const ocrScannerScreen = document.getElementById('ocrScannerScreen');
  const ocrSuccessScreen = document.getElementById('ocrSuccessScreen');
  const ocrPreviewImg = document.getElementById('ocrPreviewImg');
  const ocrStatusText = document.getElementById('ocrStatusText');
  const ocrEmptyState = document.getElementById('ocrEmptyState');
  const ocrResultsDashboard = document.getElementById('ocrResultsDashboard');
  const sampleBillBtns = document.querySelectorAll('.sample-bill-btn');
  const loadOcrToCalcBtn = document.getElementById('loadOcrToCalcBtn');
  const resetOcrBtn = document.getElementById('resetOcrBtn');
  const uploadAnotherBillBtn = document.getElementById('uploadAnotherBillBtn');

  const ocrSuccessImg = document.getElementById('ocrSuccessImg');
  const ocrSuccessTitle = document.getElementById('ocrSuccessTitle');
  const ocrSuccessUnits = document.getElementById('ocrSuccessUnits');
  const ocrSuccessAmount = document.getElementById('ocrSuccessAmount');

  // Camera Viewfinder & WebCam Elements
  const cameraFileInput = document.getElementById('cameraFileInput');
  const openCameraBtn = document.getElementById('openCameraBtn');
  const cameraModalBackdrop = document.getElementById('cameraModalBackdrop');
  const closeCameraModalBtn = document.getElementById('closeCameraModalBtn');
  const cancelCameraBtn = document.getElementById('cancelCameraBtn');
  const cameraVideo = document.getElementById('cameraVideo');
  const cameraCanvas = document.getElementById('cameraCanvas');
  const snapPhotoBtn = document.getElementById('snapPhotoBtn');

  let mediaStream = null;
  let activeScannedImgSrc = '';

  function stopCameraStream() {
    if (mediaStream) {
      mediaStream.getTracks().forEach(track => track.stop());
      mediaStream = null;
    }
    if (cameraModalBackdrop) cameraModalBackdrop.classList.remove('active');
  }

  if (openCameraBtn) {
    openCameraBtn.addEventListener('click', async () => {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        try {
          mediaStream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: { ideal: 'environment' }, width: { ideal: 1280 }, height: { ideal: 720 } }
          });
          if (cameraVideo) {
            cameraVideo.srcObject = mediaStream;
          }
          if (cameraModalBackdrop) cameraModalBackdrop.classList.add('active');
        } catch (err) {
          console.warn('WebCam camera access denied, launching camera file picker:', err);
          if (cameraFileInput) cameraFileInput.click();
        }
      } else if (cameraFileInput) {
        cameraFileInput.click();
      }
    });
  }

  if (closeCameraModalBtn) closeCameraModalBtn.addEventListener('click', stopCameraStream);
  if (cancelCameraBtn) cancelCameraBtn.addEventListener('click', stopCameraStream);
  if (cameraModalBackdrop) {
    cameraModalBackdrop.addEventListener('click', (e) => {
      if (e.target === cameraModalBackdrop) stopCameraStream();
    });
  }

  if (snapPhotoBtn && cameraVideo && cameraCanvas) {
    snapPhotoBtn.addEventListener('click', () => {
      const width = cameraVideo.videoWidth || 640;
      const height = cameraVideo.videoHeight || 480;

      cameraCanvas.width = width;
      cameraCanvas.height = height;

      const ctx = cameraCanvas.getContext('2d');
      ctx.drawImage(cameraVideo, 0, 0, width, height);

      const capturedDataUrl = cameraCanvas.toDataURL('image/jpeg', 0.95);
      stopCameraStream();

      // Send captured camera photo into OCR scanner
      runScannerAnimation(capturedDataUrl, 'Processing Camera Photo...', () => {
        if (window.Tesseract) {
          window.Tesseract.recognize(capturedDataUrl, 'eng').then(({ data: { text } }) => {
            const unitMatch = text.match(/(\d{2,4})\s*(kwh|units|unit)/i);
            const parsedUnits = unitMatch ? parseInt(unitMatch[1]) : 340;
            const parsedAmount = Math.round(parsedUnits * 8.0);

            renderOcrResults({
              name: 'Live Camera Photo',
              units: parsedUnits,
              amount: parsedAmount,
              days: 30,
              load: '3 kW',
              slabTier: parsedUnits > 300 ? 'Slab 3 (>300 Units)' : 'Slab 2 (101-300 Units)',
              penalty: parsedUnits > 300 ? `${parsedUnits - 300} units billed at peak rate ₹10.50/unit` : 'Standard billing slab rate',
              breakdown: [
                { label: 'Cooling / Air Conditioner', percent: 54, kwh: Math.round(parsedUnits * 0.54), color: '#D96B5B' },
                { label: 'Refrigeration (24/7)', percent: 20, kwh: Math.round(parsedUnits * 0.20), color: '#E29E4B' },
                { label: 'Lighting & Fans', percent: 16, kwh: Math.round(parsedUnits * 0.16), color: '#2A835F' },
                { label: 'Standby / Electronics', percent: 10, kwh: Math.round(parsedUnits * 0.10), color: '#8BBB92' }
              ],
              highlight: `⚡ Analyzed Camera Snapshot (${parsedUnits} kWh). Potential to save ~${Math.round(parsedUnits * 0.18)} kWh/month!`,
              actions: [
                `<strong>Target Savings:</strong> Reduce daily consumption by ${(parsedUnits * 0.18 / 30).toFixed(1)} units/day to save <strong>₹${Math.round(parsedUnits * 0.18 * 8.0)}/month</strong>.`,
                '<strong>Manage AC & Heating (Set to 24°C–26°C):</strong> Set AC thermostat to 24°C–26°C (every 1°C increase saves 6% electricity)!',
                '<strong>Eliminate Standby Waste:</strong> Switch off main wall sockets at night.'
              ]
            });
          }).catch(() => {
            renderOcrResults(sampleBills.standard);
          });
        } else {
          renderOcrResults(sampleBills.standard);
        }
      });
    });
  }

  if (cameraFileInput) {
    cameraFileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) processUploadedBillFile(file);
    });
  }

  // Pre-configured Sample Bills
  const sampleBills = {
    heavy: {
      name: 'Summer Heavy AC Connection',
      units: 480,
      amount: 4120,
      days: 30,
      load: '4 kW',
      slabTier: 'Slab 3 (>300 Units)',
      slabClass: 'impact-high',
      penalty: '180 units billed at peak ₹10.50/unit rate',
      breakdown: [
        { label: 'Air Conditioner (1.5 Ton)', percent: 62, kwh: 298, color: '#D96B5B' },
        { label: 'Refrigerator (24/7)', percent: 14, kwh: 67, color: '#E29E4B' },
        { label: 'Water Heater / Geyser', percent: 12, kwh: 58, color: '#2A835F' },
        { label: 'Fans, TV & Standby Load', percent: 12, kwh: 57, color: '#8BBB92' }
      ],
      highlight: '⚠️ Slab Trap Warning: You pushed 180 units into Slab 3 (@ ₹10.50/unit).',
      actions: [
        '<strong>Set AC Thermostat to 24°C:</strong> Saves ~95 kWh/month and drops your consumption from Slab 3 to Slab 2, saving <strong>₹1,120/month</strong>!',
        '<strong>Use AC Timer at Night:</strong> Turn off AC after 4 hours of sleep with ceiling fan running → Saves ~45 kWh/month.',
        '<strong>Switch off Standby Socket Switches:</strong> Unplug microwave & TV when sleeping → Saves ~12 kWh/month.'
      ],
      image: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="600" height="400" rx="12" fill="%230F3036"/><text x="40" y="60" fill="%238BBB92" font-family="sans-serif" font-weight="bold" font-size="22">ELECTRICITY UTILITY BOARD</text><text x="40" y="95" fill="%23FFFFFF" font-family="sans-serif" font-size="14">CONSUMER: CAROL PILLAI | CA NO: 108492019</text><line x1="40" y1="115" x2="560" y2="115" stroke="%231F3F45" stroke-width="2"/><text x="40" y="150" fill="%23B5C9C3" font-family="sans-serif" font-size="14">BILLING PERIOD: MAY 01 - MAY 31 (30 DAYS)</text><text x="40" y="185" fill="%23FFFFFF" font-family="sans-serif" font-size="16">TOTAL UNITS CONSUMED (kWh):</text><text x="340" y="185" fill="%23D96B5B" font-family="sans-serif" font-weight="bold" font-size="28">480 kWh</text><text x="40" y="230" fill="%23FFFFFF" font-family="sans-serif" font-size="16">NET AMOUNT PAYABLE:</text><text x="340" y="230" fill="%238BBB92" font-family="sans-serif" font-weight="bold" font-size="32">₹4,120.00</text><rect x="40" y="270" width="520" height="80" rx="8" fill="%23164147"/><text x="60" y="305" fill="%23FF9E90" font-family="sans-serif" font-weight="bold" font-size="14">SLAB BREAKDOWN (HIGH CONSUMPTION TIER):</text><text x="60" y="330" fill="%23E0EBF0" font-family="sans-serif" font-size="13">• 0-100: ₹450 | 101-300: ₹1,500 | 301-480: ₹1,890 + Taxes</text></svg>'
    },
    standard: {
      name: 'Standard 3-BHK Household',
      units: 290,
      amount: 2240,
      days: 30,
      load: '3 kW',
      slabTier: 'Slab 2 (101-300 Units)',
      slabClass: 'impact-medium',
      penalty: 'Optimal tier (Approaching Slab 3 boundary)',
      breakdown: [
        { label: 'Ceiling Fans & Lights', percent: 35, kwh: 102, color: '#2A835F' },
        { label: 'Refrigerator (24/7)', percent: 28, kwh: 81, color: '#E29E4B' },
        { label: 'Air Conditioner (Modest Use)', percent: 22, kwh: 64, color: '#D96B5B' },
        { label: 'TV & Other Appliances', percent: 15, kwh: 43, color: '#8BBB92' }
      ],
      highlight: '💡 Slab Threshold Opportunity: You are only 10 units away from Slab 1 boundary!',
      actions: [
        '<strong>Reduce AC by 30 mins daily:</strong> Will trim 15 kWh and pull your entire bill into lower pricing tier → Saves <strong>₹280/month</strong>.',
        '<strong>Clean Refrigerator Coils:</strong> Increases cooling efficiency by 15% → Saves ~12 kWh/month.',
        '<strong>Use LED bulbs only:</strong> Replace remaining 40W tubelights with 9W LEDs.'
      ],
      image: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="600" height="400" rx="12" fill="%230F3036"/><text x="40" y="60" fill="%238BBB92" font-family="sans-serif" font-weight="bold" font-size="22">ELECTRICITY UTILITY BOARD</text><text x="40" y="95" fill="%23FFFFFF" font-family="sans-serif" font-size="14">CONSUMER: RAHUL M. | CA NO: 204819402</text><line x1="40" y1="115" x2="560" y2="115" stroke="%231F3F45" stroke-width="2"/><text x="40" y="150" fill="%23B5C9C3" font-family="sans-serif" font-size="14">BILLING PERIOD: MAY 01 - MAY 31 (30 DAYS)</text><text x="40" y="185" fill="%23FFFFFF" font-family="sans-serif" font-size="16">TOTAL UNITS CONSUMED (kWh):</text><text x="340" y="185" fill="%23E29E4B" font-family="sans-serif" font-weight="bold" font-size="28">290 kWh</text><text x="40" y="230" fill="%23FFFFFF" font-family="sans-serif" font-size="16">NET AMOUNT PAYABLE:</text><text x="340" y="230" fill="%238BBB92" font-family="sans-serif" font-weight="bold" font-size="32">₹2,240.00</text><rect x="40" y="270" width="520" height="80" rx="8" fill="%23164147"/><text x="60" y="305" fill="%238BBB92" font-family="sans-serif" font-weight="bold" font-size="14">SLAB BREAKDOWN (MEDIUM TIER):</text><text x="60" y="330" fill="%23E0EBF0" font-family="sans-serif" font-size="13">• 0-100: ₹450 | 101-290: ₹1,425 + Fixed Charges</text></svg>'
    },
    efficient: {
      name: 'Efficient Eco-Apartment',
      units: 135,
      amount: 890,
      days: 30,
      load: '2 kW',
      slabTier: 'Slab 1 (Base Tariff)',
      slabClass: 'impact-low',
      penalty: 'Zero slab penalty (Lowest rate slab)',
      breakdown: [
        { label: '5-Star Refrigerator', percent: 35, kwh: 47, color: '#2A835F' },
        { label: 'BLDC Energy Fans', percent: 30, kwh: 40, color: '#8BBB92' },
        { label: 'LED Lighting', percent: 20, kwh: 27, color: '#E29E4B' },
        { label: 'Laptop & Routers', percent: 15, kwh: 21, color: '#12544F' }
      ],
      highlight: '🌟 Exemplary Performance: You are consuming within the top 10% eco benchmark!',
      actions: [
        '<strong>Maintain Current Routine:</strong> Your household energy habits are optimized.',
        '<strong>Share Your Habits:</strong> Challenge neighboring residents to adopt BLDC fans and smart plug power strips.'
      ],
      image: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="600" height="400" rx="12" fill="%230F3036"/><text x="40" y="60" fill="%238BBB92" font-family="sans-serif" font-weight="bold" font-size="22">ELECTRICITY UTILITY BOARD</text><text x="40" y="95" fill="%23FFFFFF" font-family="sans-serif" font-size="14">CONSUMER: ANANYA S. | CA NO: 902847103</text><line x1="40" y1="115" x2="560" y2="115" stroke="%231F3F45" stroke-width="2"/><text x="40" y="150" fill="%23B5C9C3" font-family="sans-serif" font-size="14">BILLING PERIOD: MAY 01 - MAY 31 (30 DAYS)</text><text x="40" y="185" fill="%23FFFFFF" font-family="sans-serif" font-size="16">TOTAL UNITS CONSUMED (kWh):</text><text x="340" y="185" fill="%238BBB92" font-family="sans-serif" font-weight="bold" font-size="28">135 kWh</text><text x="40" y="230" fill="%23FFFFFF" font-family="sans-serif" font-size="16">NET AMOUNT PAYABLE:</text><text x="340" y="230" fill="%238BBB92" font-family="sans-serif" font-weight="bold" font-size="32">₹890.00</text><rect x="40" y="270" width="520" height="80" rx="8" fill="%23164147"/><text x="60" y="305" fill="%238BBB92" font-family="sans-serif" font-weight="bold" font-size="14">SLAB BREAKDOWN (BASE TIER):</text><text x="60" y="330" fill="%23E0EBF0" font-family="sans-serif" font-size="13">• 0-100: ₹450 | 101-135: ₹262 + Fixed Charges</text></svg>'
    }
  };

  let currentOcrData = null;

  // Process and Render Bill Data
  function renderOcrResults(data) {
    currentOcrData = data;

    // Update Header & Badge
    document.getElementById('ocrConsumerName').textContent = data.name || 'Residential Light Bill';
    const badge = document.getElementById('ocrSlabBadge');
    badge.textContent = data.slabTier || 'Parsed Tier';
    
    // Update Metrics
    document.getElementById('ocrUnitsVal').textContent = `${data.units} kWh`;
    const daily = (data.units / (data.days || 30)).toFixed(1);
    document.getElementById('ocrDailyUnitsSub').textContent = `~${daily} units / day`;

    document.getElementById('ocrAmountVal').textContent = `₹${data.amount.toLocaleString()}`;
    const avgRate = (data.amount / data.units).toFixed(2);
    document.getElementById('ocrAvgUnitRateSub').textContent = `Avg Rate: ₹${avgRate}/unit`;

    document.getElementById('ocrPeriodVal').textContent = `${data.days || 30} Days`;
    document.getElementById('ocrSanctionLoadSub').textContent = `Sanctioned Load: ${data.load || '3 kW'}`;

    document.getElementById('ocrSlabTierVal').textContent = data.slabTier;
    document.getElementById('ocrPenaltySub').textContent = data.penalty;

    // Render Appliance Contribution Bar Stack
    const barStack = document.getElementById('ocrBarStack');
    if (barStack) {
      barStack.innerHTML = '';
      (data.breakdown || []).forEach(item => {
        const barItem = document.createElement('div');
        barItem.className = 'ocr-bar-item';
        barItem.innerHTML = `
          <div class="ocr-bar-meta">
            <span>${item.label}</span>
            <span style="font-weight: 700; color: ${item.color}">${item.percent}% (${item.kwh} kWh)</span>
          </div>
          <div class="ocr-bar-track">
            <div class="ocr-bar-fill" style="width: ${item.percent}%; background-color: ${item.color}"></div>
          </div>
        `;
        barStack.appendChild(barItem);
      });
    }

    // Render Strategy Highlight & Actions if present
    const highlightElem = document.getElementById('ocrStrategyHighlight');
    if (highlightElem) highlightElem.innerHTML = data.highlight;
    
    const actionList = document.getElementById('ocrActionList');
    if (actionList) {
      actionList.innerHTML = '';
      (data.actions || []).forEach(act => {
        const li = document.createElement('li');
        li.innerHTML = `<i data-lucide="check-circle-2" style="width: 14px; height: 14px; color: var(--color-soft-sage); flex-shrink: 0; margin-top: 3px;"></i> <div>${act}</div>`;
        actionList.appendChild(li);
      });
    }

    if (window.lucide) window.lucide.createIcons();

    // Populate Success Screen Details
    if (ocrSuccessImg) ocrSuccessImg.src = activeScannedImgSrc || data.image;
    if (ocrSuccessTitle) ocrSuccessTitle.textContent = data.name || 'Scanned Light Bill';
    if (ocrSuccessUnits) ocrSuccessUnits.textContent = `⚡ ${data.units} kWh`;
    if (ocrSuccessAmount) ocrSuccessAmount.textContent = `💰 ₹${data.amount.toLocaleString()}`;

    // Update main calculator result display on right card
    const resAppTitle = document.getElementById('resApplianceTitle');
    const resKwh = document.getElementById('resMonthlyKwh');
    const resCost = document.getElementById('resMonthlyCost');
    const calcWatts = document.getElementById('calcWatts');
    const calcHours = document.getElementById('calcHours');

    if (resAppTitle) resAppTitle.textContent = `Scanned Bill (${data.name || 'Light Bill'})`;
    if (resKwh) resKwh.textContent = `${data.units} kWh`;
    if (resCost) resCost.textContent = `₹${data.amount.toLocaleString()}`;

    if (calcWatts && calcHours) {
      calcWatts.value = 1500;
      const estimatedHours = (data.units / (1.5 * 30)).toFixed(1);
      calcHours.value = Math.min(24, Math.max(1, estimatedHours));
    }

    // Show Results Panel if standalone panel present
    if (ocrEmptyState) ocrEmptyState.style.display = 'none';
    if (ocrResultsDashboard) ocrResultsDashboard.style.display = 'block';
  }

  // Run Visual Laser Scanner Sequence
  function runScannerAnimation(imgSrc, statusText, onComplete) {
    activeScannedImgSrc = imgSrc;
    if (ocrDropzoneContent) ocrDropzoneContent.style.display = 'none';
    if (ocrSuccessScreen) ocrSuccessScreen.style.display = 'none';
    if (ocrScannerScreen) ocrScannerScreen.style.display = 'block';
    if (ocrPreviewImg) ocrPreviewImg.src = imgSrc;
    if (ocrStatusText) ocrStatusText.textContent = statusText || 'Scanning Light Bill image...';

    setTimeout(() => {
      if (ocrStatusText) ocrStatusText.textContent = 'Extracting numeric kWh & tariff text fields...';
    }, 1200);

    setTimeout(() => {
      if (ocrStatusText) ocrStatusText.textContent = 'Calculating tariff slab & appliance breakdown...';
    }, 2200);

    setTimeout(() => {
      if (ocrScannerScreen) ocrScannerScreen.style.display = 'none';
      if (ocrDropzoneContent) ocrDropzoneContent.style.display = 'none';
      if (ocrSuccessScreen) ocrSuccessScreen.style.display = 'block';
      if (onComplete) onComplete();
    }, 3000);
  }

  // Handle Sample Bill Clicks
  sampleBillBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.getAttribute('data-sample');
      const data = sampleBills[key];
      if (data) {
        runScannerAnimation(data.image, `Analyzing ${data.name}...`, () => {
          renderOcrResults(data);
        });
      }
    });
  });

  // Handle Drag and Drop
  if (ocrDropzone) {
    ['dragenter', 'dragover'].forEach(eventName => {
      ocrDropzone.addEventListener(eventName, (e) => {
        e.preventDefault();
        ocrDropzone.classList.add('dragover');
      });
    });

    ['dragleave', 'drop'].forEach(eventName => {
      ocrDropzone.addEventListener(eventName, (e) => {
        e.preventDefault();
        ocrDropzone.classList.remove('dragover');
      });
    });

    ocrDropzone.addEventListener('drop', (e) => {
      const files = e.dataTransfer.files;
      if (files && files.length > 0) {
        processUploadedBillFile(files[0]);
      }
    });
  }

  function processUploadedBillFile(file) {
    const reader = new FileReader();
    reader.onload = function(evt) {
      const imgSrc = evt.target.result;
      
      runScannerAnimation(imgSrc, 'Running Client Tesseract OCR Engine...', () => {
        if (window.Tesseract) {
          window.Tesseract.recognize(imgSrc, 'eng', {
            logger: m => console.log(m)
          }).then(({ data: { text } }) => {
            console.log('Tesseract OCR Output:', text);
            const unitMatch = text.match(/(\d{2,4})\s*(kwh|units|unit)/i) || text.match(/total\s*:?\s*(\d{2,4})/i);
            const amountMatch = text.match(/(₹|rs\.?|inr)\s*([\d,]{3,6})/i) || text.match(/(\d{3,6})\s*(₹|rs)/i);

            const parsedUnits = unitMatch ? parseInt(unitMatch[1]) : 365;
            const parsedAmount = amountMatch ? parseInt(amountMatch[2].replace(/,/g, '')) : Math.round(parsedUnits * 8.2);

            const customData = {
              name: file.name.replace(/\.[^/.]+$/, "") + " (Uploaded)",
              units: parsedUnits,
              amount: parsedAmount,
              days: 30,
              load: '3 kW',
              slabTier: parsedUnits > 300 ? 'Slab 3 (>300 Units)' : (parsedUnits > 100 ? 'Slab 2 (101-300 Units)' : 'Slab 1 (0-100 Units)'),
              penalty: parsedUnits > 300 ? `${parsedUnits - 300} units billed at peak rate ₹10.50/unit` : 'Standard billing slab rate',
              breakdown: [
                { label: 'Cooling / Air Conditioner', percent: 52, kwh: Math.round(parsedUnits * 0.52), color: '#D96B5B' },
                { label: 'Refrigeration (24/7)', percent: 22, kwh: Math.round(parsedUnits * 0.22), color: '#E29E4B' },
                { label: 'Lighting & Fans', percent: 16, kwh: Math.round(parsedUnits * 0.16), color: '#2A835F' },
                { label: 'Standby / Electronics', percent: 10, kwh: Math.round(parsedUnits * 0.10), color: '#8BBB92' }
              ],
              highlight: `⚡ Analyzed Uploaded Bill (${parsedUnits} kWh). Potential to save ~${Math.round(parsedUnits * 0.18)} kWh/month!`,
              actions: [
                `<strong>Target Savings:</strong> Reduce daily consumption by ${(parsedUnits * 0.18 / 30).toFixed(1)} units/day to save <strong>₹${Math.round(parsedUnits * 0.18 * 8.0)}/month</strong>.`,
                '<strong>Manage AC & Heating (Set to 24°C–26°C):</strong> Cooling/heating accounts for over 50% of your bill. Set your AC thermostat to 24°C–26°C (every 1°C increase saves 6% electricity)!',
                '<strong>Eliminate Standby Waste:</strong> Switch off main wall sockets at night.'
              ]
            };

            renderOcrResults(customData);
          }).catch(err => {
            console.warn('OCR error, using fallback:', err);
            renderOcrResults(sampleBills.standard);
          });
        } else {
          renderOcrResults(sampleBills.standard);
        }
      });
    };
    reader.readAsDataURL(file);
  }

  // Handle File Upload
  if (billFileInput) {
    billFileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) processUploadedBillFile(file);
    });
  }

  // Populate Extracted OCR Data into Interactive Calculator
  if (loadOcrToCalcBtn) {
    loadOcrToCalcBtn.addEventListener('click', () => {
      if (!currentOcrData) return;

      const calcWatts = document.getElementById('calcWatts');
      const calcHours = document.getElementById('calcHours');

      if (calcWatts && calcHours) {
        calcWatts.value = 1500;
        const estimatedHours = (currentOcrData.units / (1.5 * 30)).toFixed(1);
        calcHours.value = Math.min(24, Math.max(1, estimatedHours));
      }

      const newSnapshotItem = {
        id: Date.now().toString(),
        name: `Scanned Bill (${currentOcrData.name})`,
        watts: Math.round(currentOcrData.units * 1000 / (30 * 8)),
        hours: 8,
        days: currentOcrData.days || 30,
        kwh: currentOcrData.units,
        cost: currentOcrData.amount
      };

      state.snapshotItems.push(newSnapshotItem);
      renderSnapshotTable();

      const snapSec = document.getElementById('snapshotSection');
      if (snapSec) {
        snapSec.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  function resetOcrToUploadPrompt() {
    if (ocrSuccessScreen) ocrSuccessScreen.style.display = 'none';
    if (ocrScannerScreen) ocrScannerScreen.style.display = 'none';
    if (ocrDropzoneContent) ocrDropzoneContent.style.display = 'block';
    if (billFileInput) billFileInput.value = '';
    activeScannedImgSrc = '';
  }

  if (uploadAnotherBillBtn) {
    uploadAnotherBillBtn.addEventListener('click', resetOcrToUploadPrompt);
  }

  if (resetOcrBtn) {
    resetOcrBtn.addEventListener('click', () => {
      if (ocrResultsDashboard) ocrResultsDashboard.style.display = 'none';
      if (ocrEmptyState) ocrEmptyState.style.display = 'block';
      resetOcrToUploadPrompt();
    });
  }

  // --------------------------------------------------------------------------
  // 12. ADMIN PORTAL (TRIGGERED ONLY VIA URL /admin OR #admin)
  // --------------------------------------------------------------------------
  const closeEditModalBtn = document.getElementById('closeEditModalBtn');
  const editModalBackdrop = document.getElementById('editModalBackdrop');

  const adminAuthView = document.getElementById('adminAuthView');
  const adminEditorView = document.getElementById('adminEditorView');
  const adminAuthForm = document.getElementById('adminAuthForm');
  const adminPasscode = document.getElementById('adminPasscode');
  const adminAuthError = document.getElementById('adminAuthError');
  const adminLogoutBtn = document.getElementById('adminLogoutBtn');
  const fieldDataForm = document.getElementById('fieldDataForm');

  const ADMIN_PASSCODE = 'admin123';

  function checkAdminAuthStatus() {
    return sessionStorage.getItem('smartEnergyAdmin') === 'true';
  }

  function renderAdminModalState() {
    if (checkAdminAuthStatus()) {
      adminAuthView.style.display = 'none';
      adminEditorView.style.display = 'block';
    } else {
      adminAuthView.style.display = 'block';
      adminEditorView.style.display = 'none';
      if (adminAuthError) adminAuthError.style.display = 'none';
      if (adminPasscode) adminPasscode.value = '';
    }
    if (window.lucide) window.lucide.createIcons();
  }

  function openAdminModal() {
    renderAdminModalState();
    if (editModalBackdrop) editModalBackdrop.classList.add('active');
  }

  function closeAdminModal() {
    if (editModalBackdrop) editModalBackdrop.classList.remove('active');
    if (window.location.hash.toLowerCase() === '#admin') {
      history.pushState('', document.title, window.location.pathname + window.location.search);
    }
  }

  function checkUrlForAdminRoute() {
    const hash = window.location.hash.toLowerCase();
    const path = window.location.pathname.toLowerCase();
    if (hash === '#admin' || path.endsWith('/admin') || path.endsWith('/admin/')) {
      openAdminModal();
    }
  }

  window.addEventListener('hashchange', checkUrlForAdminRoute);
  checkUrlForAdminRoute();

  if (closeEditModalBtn && editModalBackdrop) {
    closeEditModalBtn.addEventListener('click', closeAdminModal);
  }

  if (editModalBackdrop) {
    editModalBackdrop.addEventListener('click', (e) => {
      if (e.target === editModalBackdrop) {
        closeAdminModal();
      }
    });
  }

  if (adminAuthForm) {
    adminAuthForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const entered = adminPasscode.value.trim();

      if (entered === ADMIN_PASSCODE) {
        sessionStorage.setItem('smartEnergyAdmin', 'true');
        if (adminAuthError) adminAuthError.style.display = 'none';
        renderAdminModalState();
      } else {
        if (adminAuthError) adminAuthError.style.display = 'block';
      }
    });
  }

  if (adminLogoutBtn) {
    adminLogoutBtn.addEventListener('click', () => {
      sessionStorage.removeItem('smartEnergyAdmin');
      renderAdminModalState();
    });
  }

  if (fieldDataForm) {
    fieldDataForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const households = document.getElementById('editHouseholds').value;
      const residents = document.getElementById('editResidents').value;
      const habitPercent = document.getElementById('editHabitPercent').value;
      const opportunities = document.getElementById('editOpportunities').value;
      const locality = document.getElementById('editLocality').value;
      const r1 = document.getElementById('editResearcher1').value;
      const r2 = document.getElementById('editResearcher2').value;

      // Update Quick Stats
      document.getElementById('quickStatHouseholds').textContent = households;
      document.getElementById('quickStatResidents').textContent = residents;
      document.getElementById('quickStatHabitPercent').textContent = habitPercent;
      document.getElementById('quickStatOpportunities').textContent = opportunities;

      // Update Research Meta
      document.getElementById('resMetaHouseholds').textContent = households.replace('+', '');
      document.getElementById('resMetaResidents').textContent = residents.replace('+', '');

      // Update Locality & Team
      document.getElementById('aboutLocalityName').textContent = locality;
      document.getElementById('footerLocalityTag').textContent = `Locality: ${locality}`;

      document.getElementById('footerMember1').textContent = `${r1} — Field Research & Data Analysis`;
      document.getElementById('footerMember2').textContent = `${r2} — Technology & Product Design`;

      closeAdminModal();
    });
  }
});
