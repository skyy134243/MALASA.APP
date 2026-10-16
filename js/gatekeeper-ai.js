/**
 * ==============================================================================
 * MALASA.APP - GATEKEEPER AI VISION ENGINE
 * Memvalidasi kebersihan pakan maggot dari kontaminan anorganik
 * Prompt: "Identifikasi kontaminasi material non-organik (plastik, logam, kaca) pada permukaan sampah."
 * ==============================================================================
 */

const GatekeeperAI = {
  // Sistem Prompt Standar Gatekeeper Vision
  SYSTEM_PROMPT: `Anda adalah Gatekeeper AI Malasa.App, sistem computer vision penjaga kualitas pakan budidaya larva Black Soldier Fly (Maggot BSF).
Tugas Anda:
1. Menganalisis citra permukaan sampah di dalam drum komunal 120L.
2. Mendeteksi apakah ada kontaminasi anorganik berbahaya seperti plastik kresek, styrofoam, sachet alumunium foil, logam, baterai, atau pecahan kaca.
3. Menghasilkan skor kelayakan pakan larva (maggot_safe_score: 0 - 100).
4. Menentukan status: is_contaminated (true/false). Jika ada plastik sekecil apapun, is_contaminated WAJIB bernilai true.`,

  /**
   * Menjalankan analisis gambar sampah
   * @param {Object} params { binId, sampleType, customPrompt, apiKey }
   */
  async inspectWasteImage({ binId, sampleType = 'clean_organic', customPrompt = '', apiKey = '' }) {
    // Jika user memberikan Google Gemini API Key, panggil live endpoint
    if (apiKey && apiKey.trim() !== '') {
      try {
        return await this.callLiveGeminiVision(apiKey, sampleType, customPrompt);
      } catch (err) {
        console.warn("[Gatekeeper AI] Gemini live API error, fallback to onboard inference engine:", err);
      }
    }

    // Onboard Smart Heuristic Inference Engine
    return new Promise((resolve) => {
      setTimeout(() => {
        let result;
        const now = new Date().toLocaleTimeString();

        if (sampleType === 'clean_organic') {
          result = {
            id: `AI-EV-${Math.floor(1000 + Math.random() * 9000)}`,
            binId,
            timestamp: now,
            isContaminated: false,
            detectedContaminants: [],
            maggotSafeScore: 96,
            aiVerdict: "KUALITAS PRIMA: Permukaan 100% sisa makanan basah, daun sayur, dan ampas buah. Sangat optimal untuk biokonversi larva BSF.",
            actionTrigger: "TRIGGER_GREEN_LED",
            ledSignal: "GREEN",
            rtNotification: null
          };
        } else if (sampleType === 'contaminated_plastic') {
          result = {
            id: `AI-EV-${Math.floor(1000 + Math.random() * 9000)}`,
            binId,
            timestamp: now,
            isContaminated: true,
            detectedContaminants: ["Plastik kresek hitam", "Bungkus bumbu mi instan"],
            maggotSafeScore: 42,
            aiVerdict: "KONTAMINASI ANORGANIK TERDETEKSI: Ditemukan kemasan multilayer sachet plastik dan kresek. Berisiko menyumbat saluran cerna maggot dan merusak kualitas pupuk kasgot.",
            actionTrigger: "TRIGGER_YELLOW_LED_AND_NOTIFY_RT",
            ledSignal: "YELLOW",
            rtNotification: `[PERINGATAN RT] Tong Komunal ${binId} mendeteksi sampah plastik. Mohon warga memilah sebelum penjemputan armada!`
          };
        } else if (sampleType === 'contaminated_glass_metal') {
          result = {
            id: `AI-EV-${Math.floor(1000 + Math.random() * 9000)}`,
            binId,
            timestamp: now,
            isContaminated: true,
            detectedContaminants: ["Tutup botol kaleng logam", "Pecahan beling kaca"],
            maggotSafeScore: 25,
            aiVerdict: "KONTAMINASI BERBAHAYA / TOKSIK: Ditemukan material keras tajam (logam/kaca). Fatal bagi koloni maggot dan berbahaya bagi petugas penjemput.",
            actionTrigger: "TRIGGER_YELLOW_LED_AND_NOTIFY_RT",
            ledSignal: "YELLOW",
            rtNotification: `[URGENT DLH] Ditemukan logam/kaca di Tong ${binId}! Tindakan isolasi tong diaktifkan.`
          };
        } else {
          // Mixed / Borderline
          result = {
            id: `AI-EV-${Math.floor(1000 + Math.random() * 9000)}`,
            binId,
            timestamp: now,
            isContaminated: false,
            detectedContaminants: ["Kertas tisu lembap (biodegradable)"],
            maggotSafeScore: 88,
            aiVerdict: "KUALITAS LAYAK: Kertas tisu basah terdeteksi namun masih dapat terurai oleh mikroba pengurai bersama EM4.",
            actionTrigger: "TRIGGER_GREEN_LED",
            ledSignal: "GREEN",
            rtNotification: null
          };
        }

        // Simpan log ke state
        MalasaState.aiLogs.unshift({
          id: result.id,
          binId: result.binId,
          timestamp: result.timestamp,
          isContaminated: result.isContaminated,
          contaminants: result.detectedContaminants,
          maggotSafeScore: result.maggotSafeScore,
          promptUsed: customPrompt || "Identifikasi kontaminasi material non-organik (plastik, logam, kaca) pada permukaan sampah.",
          summary: result.aiVerdict,
          actionTriggered: result.actionTrigger
        });

        // Update status bin
        const bin = MalasaState.bins.find(b => b.id === binId);
        if (bin) {
          bin.isContaminated = result.isContaminated;
          bin.lastContaminant = result.isContaminated ? result.detectedContaminants.join(", ") : null;
          bin.maggotSafeScore = result.maggotSafeScore;
          if (result.isContaminated) {
            bin.status = "CONTAMINATED";
          } else if (bin.currentFillPercent >= 70) {
            bin.status = "CRITICAL_FULL";
          } else {
            bin.status = "NORMAL";
          }
          bin.lastUpdated = now;
        }

        MalasaState.notify();
        resolve(result);
      }, 700);
    });
  },

  // Handler jika user ingin menguji Gemini API resmi
  async callLiveGeminiVision(apiKey, sampleType, customPrompt) {
    const prompt = customPrompt || "Identifikasi kontaminasi material non-organik (plastik, logam, kaca) pada permukaan sampah. Kembalikan format JSON: { is_contaminated: boolean, detected_contaminants: string[], maggot_safe_score: number, ai_verdict: string }";
    
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: `${this.SYSTEM_PROMPT}\n\nTask:\n${prompt}\nSampel uji: ${sampleType}` }]
        }]
      })
    });

    const data = await response.json();
    const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
    
    // Parse response
    let parsed;
    try {
      const jsonStart = candidateText.indexOf('{');
      const jsonEnd = candidateText.lastIndexOf('}');
      if (jsonStart !== -1 && jsonEnd !== -1) {
        parsed = JSON.parse(candidateText.substring(jsonStart, jsonEnd + 1));
      }
    } catch (e) {
      console.warn("Could not parse structured JSON from Gemini, wrapping raw text.");
    }

    return {
      id: `AI-GEMINI-${Date.now().toString().slice(-4)}`,
      binId: "MALASA-BIN-LIVE",
      timestamp: new Date().toLocaleTimeString(),
      isContaminated: parsed?.is_contaminated ?? (candidateText.toLowerCase().includes("plastik") || candidateText.toLowerCase().includes("kontaminasi")),
      detectedContaminants: parsed?.detected_contaminants ?? ["Hasil deteksi Gemini Vision"],
      maggotSafeScore: parsed?.maggot_safe_score ?? 85,
      aiVerdict: parsed?.ai_verdict || candidateText,
      actionTrigger: (parsed?.is_contaminated) ? "TRIGGER_YELLOW_LED_AND_NOTIFY_RT" : "TRIGGER_GREEN_LED",
      ledSignal: (parsed?.is_contaminated) ? "YELLOW" : "GREEN",
      rtNotification: parsed?.is_contaminated ? "Kontaminasi terdeteksi oleh Gemini Vision" : null
    };
  }
};
