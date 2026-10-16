/**
 * ==============================================================================
 * MALASA.APP - MAIN APPLICATION CONTROLLER
 * Menghubungkan seluruh modul logic ke UI wireframe foundation
 * ==============================================================================
 */

document.addEventListener("DOMContentLoaded", () => {
  // 1. Tab Navigation Controller
  const navTabs = document.querySelectorAll(".nav-tab");
  const tabContents = document.querySelectorAll(".tab-content");

  navTabs.forEach(tab => {
    tab.addEventListener("click", () => {
      const targetTab = tab.getAttribute("data-tab");

      navTabs.forEach(t => t.classList.remove("active"));
      tabContents.forEach(c => c.classList.remove("active"));

      tab.classList.add("active");
      const targetElement = document.getElementById(targetTab);
      if (targetElement) {
        targetElement.classList.add("active");
      }
    });
  });

  // 2. Populate Dropdowns & Initial Render
  initBinDropdowns();
  renderAllViews();

  // Subscribe to central state changes
  MalasaState.subscribe(() => {
    renderAllViews();
  });

  // 3. Hardware Simulator Interactions
  setupHardwareSimulator();

  // 4. Gatekeeper AI Controller
  setupGatekeeperUI();

  // 5. Logistics & Routing Controller
  setupRoutingUI();

  // 6. Circular Economy Settlement Form
  setupSettlementForm();
});

/**
 * Inisialisasi dropdown pemilih tong
 */
function initBinDropdowns() {
  const selectActive = document.getElementById("select-active-bin");
  const selectSettle = document.getElementById("settle-bin-id");

  if (!selectActive || !selectSettle) return;

  selectActive.innerHTML = "";
  selectSettle.innerHTML = "";

  MalasaState.bins.forEach(bin => {
    const opt1 = document.createElement("option");
    opt1.value = bin.id;
    opt1.textContent = `${bin.id} - ${bin.name}`;
    selectActive.appendChild(opt1);

    const opt2 = document.createElement("option");
    opt2.value = bin.id;
    opt2.textContent = `${bin.id} - ${bin.name} (${bin.currentWeightKg} kg)`;
    selectSettle.appendChild(opt2);
  });
}

/**
 * Setup Interaksi Fisik Drum & Sensor ESP32-CAM
 */
function setupHardwareSimulator() {
  const btnOpenLid = document.getElementById("btn-simulate-open-lid");
  const btnFrenchPress = document.getElementById("btn-simulate-french-press");
  const btnTransmitEdge = document.getElementById("btn-transmit-edge");
  const selectActiveBin = document.getElementById("select-active-bin");
  const sliderFill = document.getElementById("slider-fill");
  const sliderWeight = document.getElementById("slider-weight");

  const lblFillVal = document.getElementById("lbl-fill-val");
  const lblWeightVal = document.getElementById("lbl-weight-val");

  // Ganti tong aktif
  selectActiveBin.addEventListener("change", (e) => {
    const selectedBin = MalasaState.bins.find(b => b.id === e.target.value);
    if (selectedBin) {
      sliderFill.value = selectedBin.currentFillPercent;
      sliderWeight.value = selectedBin.currentWeightKg;
      lblFillVal.textContent = `${selectedBin.currentFillPercent}%`;
      lblWeightVal.textContent = `${selectedBin.currentWeightKg} kg`;
      updateVisualBin(selectedBin);
    }
  });

  // Slider change
  sliderFill.addEventListener("input", (e) => {
    lblFillVal.textContent = `${e.target.value}%`;
    const bin = getSelectedBin();
    if (bin) {
      bin.currentFillPercent = parseFloat(e.target.value);
      updateVisualBin(bin);
    }
  });

  sliderWeight.addEventListener("input", (e) => {
    lblWeightVal.textContent = `${e.target.value} kg`;
    const bin = getSelectedBin();
    if (bin) {
      bin.currentWeightKg = parseFloat(e.target.value);
      updateVisualBin(bin);
    }
  });

  // Aksi Warga: Buka Tutup Tong (Trigger Mekanis Bekatul & Bangunkan ESP32)
  btnOpenLid.addEventListener("click", () => {
    const bin = getSelectedBin();
    if (!bin) return;

    bin.hopperTriggerCount += 1;
    logTerminal(`[LID SENSOR] Warga membuka tutup tong komunal.`);
    logTerminal(`[DISPENSER] Tuas sling bergerak: Taburkan 1 takar bekatul+EM4 (±15g) penekan bau.`);
    logTerminal(`[RTC GPIO 33] Limit switch HIGH -> Membangunkan ESP32-CAM dari Deep Sleep.`);

    const lidEl = document.getElementById("visual-lid-status");
    const badgeEdge = document.getElementById("badge-edge-mode");
    lidEl.textContent = "Status: Terbuka! Bekatul & EM4 tertabur otomatis.";
    badgeEdge.className = "badge badge-warning";
    badgeEdge.textContent = "ESP32: WAKING UP (Active)";

    setTimeout(() => {
      lidEl.textContent = "Status: Tertutup Rapat (Seal EPDM Mengunci Bau)";
      badgeEdge.className = "badge badge-success";
      badgeEdge.textContent = "Deep Sleep: Standby";
      logTerminal(`[LID SENSOR] Tutup ditutup kembali. Settle delay 0.8s aktif.`);
      updateVisualBin(bin);
    }, 2500);
  });

  // Aksi Warga: Tekan French Press
  btnFrenchPress.addEventListener("click", () => {
    const bin = getSelectedBin();
    if (!bin) return;

    bin.leachateVolumeLiters = parseFloat((bin.leachateVolumeLiters + 0.8).toFixed(1));
    logTerminal(`[FRENCH PRESS] Piringan ditekan: Air lindi terperas menembus mesh stainless 1.5mm.`);
    logTerminal(`[POC RESERVOIR] Volume cairan lindi bertambah menjadi ${bin.leachateVolumeLiters} Liter.`);
    updateVisualBin(bin);
  });

  // Aksi ESP32: Kirim Payload ke Cloud
  btnTransmitEdge.addEventListener("click", async () => {
    const bin = getSelectedBin();
    if (!bin) return;

    const samplePhoto = document.getElementById("select-sample-photo").value;
    logTerminal(`[OV2640] Mengambil foto resolusi 640x480... Selesai.`);
    logTerminal(`[HTTPS POST] Mengirim payload ke api.malasa.app/v1/telemetry...`);

    // Jalankan Gatekeeper AI
    const result = await GatekeeperAI.inspectWasteImage({
      binId: bin.id,
      sampleType: samplePhoto
    });

    logTerminal(`[CLOUD RESPONSE 200] AI Verdict: ${result.aiVerdict}`);

    // Trigger LED Fisik pada tong
    triggerPhysicalLed(result.ledSignal);
  });
}

function getSelectedBin() {
  const select = document.getElementById("select-active-bin");
  return MalasaState.bins.find(b => b.id === select.value) || MalasaState.bins[0];
}

function updateVisualBin(bin) {
  const visualFillText = document.getElementById("visual-fill-text");
  const visualLeachateText = document.getElementById("visual-leachate-text");
  const visualDispenseCount = document.getElementById("visual-dispense-count");

  if (visualFillText) visualFillText.textContent = `Kapasitas: ${bin.currentFillPercent}% | Berat: ${bin.currentWeightKg} kg`;
  if (visualLeachateText) visualLeachateText.textContent = `${bin.leachateVolumeLiters} Liter`;
  if (visualDispenseCount) visualDispenseCount.textContent = bin.hopperTriggerCount;
}

function triggerPhysicalLed(color) {
  const ledGreen = document.getElementById("led-green");
  const ledYellow = document.getElementById("led-yellow");

  ledGreen.classList.remove("green-on");
  ledYellow.classList.remove("yellow-on");

  if (color === "GREEN") {
    ledGreen.classList.add("green-on");
    logTerminal(`[HARDWARE FEEDBACK] LED HIJAU MENYALA: Kualitas sampah bersih aman untuk pakan maggot.`, "succ");
  } else {
    ledYellow.classList.add("yellow-on");
    logTerminal(`[HARDWARE FEEDBACK] LED KUNING MENYALA: Peringatan kontaminasi anorganik terdeteksi!`, "warn");
  }

  setTimeout(() => {
    ledGreen.classList.remove("green-on");
    ledYellow.classList.remove("yellow-on");
  }, 4000);
}

function logTerminal(message, type = "normal") {
  const term = document.getElementById("edge-terminal");
  if (!term) return;

  const line = document.createElement("div");
  line.className = `terminal-line ${type}`;
  line.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
  term.appendChild(line);
  term.scrollTop = term.scrollHeight;
}

/**
 * Setup Gatekeeper AI UI Handlers
 */
function setupGatekeeperUI() {
  const btnRun = document.getElementById("btn-run-ai-inspection");
  const inputKey = document.getElementById("input-gemini-key");

  btnRun.addEventListener("click", async () => {
    const bin = getSelectedBin();
    const sample = document.getElementById("select-sample-photo").value;
    const apiKey = inputKey.value;

    btnRun.textContent = "⏳ Memproses Inferensi Vision API...";
    btnRun.disabled = true;

    try {
      const res = await GatekeeperAI.inspectWasteImage({
        binId: bin.id,
        sampleType: sample,
        apiKey
      });

      // Update Result Box
      const badgeVerdict = document.getElementById("badge-ai-verdict");
      const lblScore = document.getElementById("lbl-maggot-score");
      const lblSummary = document.getElementById("lbl-ai-summary");
      const lblContaminants = document.getElementById("lbl-detected-contaminants");
      const boxTriggerAction = document.getElementById("box-trigger-action");

      if (res.isContaminated) {
        badgeVerdict.className = "badge badge-warning";
        badgeVerdict.textContent = "TERKONTAMINASI!";
        lblScore.style.color = "var(--color-warning)";
      } else {
        badgeVerdict.className = "badge badge-success";
        badgeVerdict.textContent = "AMAN (ORGANIK MURNI)";
        lblScore.style.color = "var(--color-brand)";
      }

      lblScore.textContent = `Maggot Safe Score: ${res.maggotSafeScore}/100`;
      lblSummary.textContent = res.aiVerdict;
      lblContaminants.textContent = res.detectedContaminants.length > 0 ? res.detectedContaminants.join(", ") : "Nihil (Bebas Plastik/Kaca/Logam)";
      boxTriggerAction.innerHTML = `Sinyal Balik: <strong>${res.actionTrigger}</strong>`;

      triggerPhysicalLed(res.ledSignal);
    } finally {
      btnRun.textContent = "⚡ Jalankan Gatekeeper AI Vision Inference";
      btnRun.disabled = false;
    }
  });
}

/**
 * Setup Routing UI & Recalculate Button
 */
function setupRoutingUI() {
  const btnRecalc = document.getElementById("btn-recalculate-route");
  btnRecalc.addEventListener("click", () => {
    renderRoutingView();
  });
}

/**
 * Setup Konfirmasi Penimbangan & Settlement
 */
function setupSettlementForm() {
  const form = document.getElementById("form-pickup-settle");
  const selectBin = document.getElementById("settle-bin-id");
  const inputWeight = document.getElementById("settle-weight");
  const inputPrice = document.getElementById("settle-price");
  const selectFee = document.getElementById("settle-fee-rate");

  const previewGross = document.getElementById("preview-gross");
  const previewFee = document.getElementById("preview-fee");
  const previewNet = document.getElementById("preview-net");

  function updatePreview() {
    const w = parseFloat(inputWeight.value || 0);
    const p = parseFloat(inputPrice.value || 0);
    const feeR = parseFloat(selectFee.value || 0.08);

    const gross = Math.round(w * p);
    const fee = Math.round(gross * feeR);
    const net = gross - fee;

    previewGross.textContent = `Rp ${gross.toLocaleString()}`;
    previewFee.textContent = `Rp ${fee.toLocaleString()}`;
    previewNet.textContent = `Rp ${net.toLocaleString()}`;
  }

  inputWeight.addEventListener("input", updatePreview);
  inputPrice.addEventListener("input", updatePreview);
  selectFee.addEventListener("change", updatePreview);

  selectBin.addEventListener("change", (e) => {
    const bin = MalasaState.bins.find(b => b.id === e.target.value);
    if (bin) {
      inputWeight.value = bin.currentWeightKg;
      updatePreview();
    }
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const binId = selectBin.value;
    const measuredWeightKg = parseFloat(inputWeight.value);
    const pricePerKg = parseFloat(inputPrice.value);
    const platformFeeRate = parseFloat(selectFee.value);
    const cultivatorName = document.getElementById("settle-cultivator").value;

    const trx = CircularEconomy.processPickupWeighIn({
      binId,
      measuredWeightKg,
      pricePerKg,
      platformFeeRate,
      cultivatorName
    });

    alert(`✅ Penimbangan Sukses!\n\nID Transaksi: ${trx.id}\nTong: ${trx.rtName}\nBobot Bersih: ${trx.weightKg} kg\nPencairan Bersih Kas RT: Rp ${trx.netCitizenReward.toLocaleString()}\nPlatform Fee Malasa.App: Rp ${trx.feeAmount.toLocaleString()}\nPupuk Lindi Terkuras: ${trx.leachateLiters} Liter`);
  });
}

/**
 * Render Seluruh Data View di Dashboard
 */
function renderAllViews() {
  renderAIHistoryTable();
  renderPredictiveView();
  renderRoutingView();
  renderDLHView();

  const lblActive = document.getElementById("lbl-active-bins");
  if (lblActive) {
    lblActive.textContent = `${MalasaState.bins.length} Tong Aktif`;
  }
}

function renderAIHistoryTable() {
  const tbody = document.getElementById("tbody-ai-logs");
  if (!tbody) return;

  tbody.innerHTML = "";
  MalasaState.aiLogs.slice(0, 8).forEach(log => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${log.timestamp}</td>
      <td><strong>${log.binId}</strong></td>
      <td>
        <span class="badge ${log.isContaminated ? 'badge-warning' : 'badge-success'}">
          ${log.isContaminated ? 'KONTAMINASI' : 'AMAN (ORGANIK)'}
        </span>
      </td>
      <td><strong>${log.maggotSafeScore}</strong>/100</td>
      <td>${log.contaminants.length > 0 ? log.contaminants.join(", ") : "Nihil"}</td>
    `;
    tbody.appendChild(tr);
  });
}

function renderPredictiveView() {
  const statContainer = document.getElementById("predictive-stat-cards");
  const tbody = document.getElementById("tbody-predictive-matrix");
  if (!statContainer || !tbody) return;

  const forecasts = PredictiveEngine.generateEcosystemForecast();

  // Render top stat cards
  statContainer.innerHTML = "";
  forecasts.slice(0, 4).forEach(f => {
    const card = document.createElement("div");
    card.className = "stat-box";
    card.innerHTML = `
      <div class="stat-label">${f.binName}</div>
      <div class="stat-value" style="font-size: 18px; color: var(--color-${f.urgencyColor});">
        ${f.hoursRemaining === 0 ? 'CRITICAL (0j)' : f.hoursRemaining + ' Jam'}
      </div>
      <div class="progress-bar-container">
        <div class="progress-bar-fill ${f.urgencyColor}" style="width: ${f.currentFill}%"></div>
      </div>
      <div class="stat-sub">${f.currentFill}% Kapasitas | ${f.currentWeight} kg</div>
    `;
    statContainer.appendChild(card);
  });

  // Render predictive matrix table
  tbody.innerHTML = "";
  forecasts.forEach(f => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><strong>${f.binId}</strong><br><small style="color:var(--text-muted)">${f.location}</small></td>
      <td><strong>${f.currentFill}%</strong></td>
      <td>${f.currentWeight} kg</td>
      <td>+${f.ratePerHour}% / jam</td>
      <td><span class="badge badge-${f.urgencyColor}">${f.message}</span></td>
      <td><strong>${f.alertLevel}</strong></td>
      <td><small>${f.recommendation}</small></td>
    `;
    tbody.appendChild(tr);
  });
}

function renderRoutingView() {
  const route = RoutingEngine.optimizeFleetRoute();

  document.getElementById("val-total-distance").textContent = `${route.totalEstimatedKm} km`;
  document.getElementById("val-projected-biomass").textContent = `${route.totalProjectedBiomassKg} kg`;
  document.getElementById("val-projected-poc").textContent = `${route.totalProjectedLeachateLiters} L`;

  const tbody = document.getElementById("tbody-routing-stops");
  if (!tbody) return;

  tbody.innerHTML = "";
  route.stops.forEach(stop => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><strong style="font-size: 14px;">Stop #${stop.stepOrder}</strong></td>
      <td><strong>${stop.name}</strong><br><small style="color:var(--text-muted)">${stop.location}</small></td>
      <td>${stop.legDistanceKm} km</td>
      <td>
        <span class="badge ${stop.fillPercent >= 70 ? 'badge-danger' : 'badge-info'}">
          ${stop.fillPercent}% (${stop.weightKg} kg)
        </span>
      </td>
      <td>
        <span style="color: ${stop.isContaminated ? 'var(--color-warning)' : 'var(--color-brand)'}; font-weight: 600;">
          ${stop.actionRequired}
        </span>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function renderDLHView() {
  const metrics = CircularEconomy.getDLHMacroMetrics();

  document.getElementById("dlh-total-waste").textContent = `${metrics.totalOrganicWasteKg} kg`;
  document.getElementById("dlh-total-ch4").textContent = `${metrics.methaneGasAvoidedKg} kg`;
  document.getElementById("dlh-total-poc").textContent = `${metrics.totalPOCFertilizerLiters} L`;
  document.getElementById("dlh-compliance-rate").textContent = `${metrics.cleanComplianceRatePercent}%`;

  // Render RT Wallets
  const tbodyWallets = document.getElementById("tbody-rt-wallets");
  if (tbodyWallets) {
    tbodyWallets.innerHTML = "";
    Object.keys(MalasaState.rtWallets).forEach(binId => {
      const wallet = MalasaState.rtWallets[binId];
      const bin = MalasaState.bins.find(b => b.id === binId);
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td><strong>${bin ? bin.name : binId}</strong></td>
        <td style="color: var(--color-brand); font-weight: 700;">Rp ${wallet.balanceIdr.toLocaleString()}</td>
        <td>${wallet.totalOrganicKg.toFixed(1)} kg</td>
        <td>${wallet.pocHarvestedLiters.toFixed(1)} Liter POC</td>
      `;
      tbodyWallets.appendChild(tr);
    });
  }

  // Render Transactions Ledger
  const tbodyTrx = document.getElementById("tbody-transactions");
  if (tbodyTrx) {
    tbodyTrx.innerHTML = "";
    MalasaState.transactions.slice(0, 8).forEach(t => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td><small>${t.id}</small></td>
        <td><strong>${t.rtName}</strong></td>
        <td>${t.weightKg} kg</td>
        <td style="color: var(--color-warning);">Rp ${t.feeAmount.toLocaleString()} (${(t.feeRate * 100).toFixed(0)}%)</td>
        <td style="color: var(--color-brand); font-weight: 700;">Rp ${t.netCitizenReward.toLocaleString()}</td>
      `;
      tbodyTrx.appendChild(tr);
    });
  }
}
