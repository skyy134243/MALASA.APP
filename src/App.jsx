import React, { useState } from 'react';
import Navbar from './components/Navbar';
import PhysicalEdgeSimulator from './components/PhysicalEdgeSimulator';
import GatekeeperAIVision from './components/GatekeeperAIVision';
import PredictiveAnalytics from './components/PredictiveAnalytics';
import MaggotLogisticsRouting from './components/MaggotLogisticsRouting';
import DLHCircularEconomy from './components/DLHCircularEconomy';
import BlueprintJuryDefense from './components/BlueprintJuryDefense';
import {
  INITIAL_BINS,
  INITIAL_AI_LOGS,
  INITIAL_TRANSACTIONS,
  INITIAL_WALLETS
} from './services/data';
import { analyzeGarbageSample } from './services/gatekeeper';

export default function App() {
  const [activeTab, setActiveTab] = useState('edge-iot');
  const [bins, setBins] = useState(INITIAL_BINS);
  const [selectedBinId, setSelectedBinId] = useState(INITIAL_BINS[0].id);
  const [aiLogs, setAiLogs] = useState(INITIAL_AI_LOGS);
  const [lastAIResult, setLastAIResult] = useState(INITIAL_AI_LOGS[0] ? {
    isContaminated: INITIAL_AI_LOGS[0].isContaminated,
    maggotSafeScore: INITIAL_AI_LOGS[0].maggotSafeScore,
    aiVerdict: INITIAL_AI_LOGS[0].summary,
    detectedContaminants: INITIAL_AI_LOGS[0].contaminants || [],
    actionTrigger: INITIAL_AI_LOGS[0].actionTriggered
  } : null);
  const [ledSignal, setLedSignal] = useState(null);
  const [transactions, setTransactions] = useState(INITIAL_TRANSACTIONS);
  const [wallets, setWallets] = useState(INITIAL_WALLETS);

  // Update specific bin property
  const handleUpdateBin = (binId, partialData) => {
    setBins((prev) =>
      prev.map((bin) => {
        if (bin.id === binId) {
          const updated = { ...bin, ...partialData };
          if (updated.currentFillPercent >= 70 || updated.currentWeightKg >= 5.0) {
            updated.status = 'CRITICAL_FULL';
          } else if (!updated.isContaminated) {
            updated.status = 'NORMAL';
          }
          return updated;
        }
        return bin;
      })
    );
  };

  // Run AI Inspection
  const handleRunAIInspection = async (binId, sampleType, apiKey) => {
    const res = await analyzeGarbageSample({ binId, sampleType, apiKey });
    setLastAIResult(res);
    setLedSignal(res.ledSignal);

    // Save to AI audit logs
    setAiLogs((prev) => [
      {
        id: res.id,
        binId: res.binId,
        timestamp: res.timestamp,
        isContaminated: res.isContaminated,
        contaminants: res.detectedContaminants,
        maggotSafeScore: res.maggotSafeScore,
        summary: res.aiVerdict,
        actionTriggered: res.actionTrigger
      },
      ...prev
    ]);

    // Update bin status
    handleUpdateBin(binId, {
      isContaminated: res.isContaminated,
      lastContaminant: res.isContaminated ? res.detectedContaminants.join(', ') : null,
      maggotSafeScore: res.maggotSafeScore,
      status: res.isContaminated ? 'CONTAMINATED' : 'NORMAL'
    });

    // Reset LED flash after 4s
    setTimeout(() => {
      setLedSignal(null);
    }, 4000);

    return res;
  };

  // Confirm Pickup Settlement
  const handleConfirmPickup = (data) => {
    const trxId = `TRX-${Date.now().toString().slice(-6)}`;
    const bin = bins.find((b) => b.id === data.binId);

    const newTrx = {
      id: trxId,
      binId: data.binId,
      rtName: bin ? bin.name : data.binId,
      cultivatorName: data.cultivatorName,
      weightKg: data.weightKg,
      pricePerKg: data.pricePerKg,
      grossAmount: data.grossAmount,
      feeRate: data.feeRate,
      feeAmount: data.feeAmount,
      netCitizenReward: data.netReward,
      leachateLiters: bin ? bin.leachateVolumeLiters : 0,
      timestamp: new Date().toLocaleDateString()
    };

    setTransactions((prev) => [newTrx, ...prev]);

    // Update RT Wallet
    setWallets((prev) => {
      const current = prev[data.binId] || { balanceIdr: 0, totalOrganicKg: 0, pocHarvestedLiters: 0 };
      return {
        ...prev,
        [data.binId]: {
          balanceIdr: current.balanceIdr + data.netReward,
          totalOrganicKg: current.totalOrganicKg + data.weightKg,
          pocHarvestedLiters: current.pocHarvestedLiters + (bin ? bin.leachateVolumeLiters : 0)
        }
      };
    });

    // Reset Bin
    handleUpdateBin(data.binId, {
      currentFillPercent: 0,
      currentWeightKg: 0,
      leachateVolumeLiters: 0,
      isContaminated: false,
      lastContaminant: null,
      status: 'NORMAL'
    });
  };

  return (
    <div>
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} binCount={bins.length} />

      <main className="app-container">
        {activeTab === 'edge-iot' && (
          <PhysicalEdgeSimulator
            bins={bins}
            selectedBinId={selectedBinId}
            setSelectedBinId={setSelectedBinId}
            onUpdateBin={handleUpdateBin}
            onRunAIInspection={handleRunAIInspection}
            ledSignal={ledSignal}
          />
        )}

        {activeTab === 'gatekeeper-ai' && (
          <GatekeeperAIVision
            bins={bins}
            selectedBinId={selectedBinId}
            aiLogs={aiLogs}
            onRunAIInspection={handleRunAIInspection}
            lastAIResult={lastAIResult}
          />
        )}

        {activeTab === 'predictive' && <PredictiveAnalytics bins={bins} />}

        {activeTab === 'routing' && (
          <MaggotLogisticsRouting bins={bins} onConfirmPickup={handleConfirmPickup} />
        )}

        {activeTab === 'dlh-economy' && (
          <DLHCircularEconomy bins={bins} transactions={transactions} wallets={wallets} />
        )}

        {activeTab === 'blueprint' && <BlueprintJuryDefense />}
      </main>
    </div>
  );
}
