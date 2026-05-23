import { useState } from 'react';
import {
  FileCheck,
  Clock,
  Calendar,
  Database,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Copy,
  RotateCcw,
  AlertCircle,
  Check,
  Info,
  HelpCircle
} from 'lucide-react';

const COMPLIANT_36HR_SITES = [
  'ABE8', 'BNA6', 'CLT2', 'FTW1', 'FWA4', 'GEU2', 'GEU3', 'GEU5', 'GYR2',
  'HGR6', 'HIA1', 'IAH3', 'LAN2', 'LAS1', 'LAX9', 'LBE1', 'LGB8', 'MDW2',
  'MEM1', 'MIT2', 'MQJ1', 'ORF2', 'PBI3', 'POC1', 'POC2', 'POC3', 'PPO4', 'PSC2',
  'PSP3', 'QXY8', 'RDU2', 'RDU4', 'RFD2', 'RMN3', 'RYY2', 'SBD1', 'SCK4', 'SMF3',
  'SWF2', 'TCY1', 'TCY2', 'TMB8', 'VGT2', 'WBW2'
];

const COMPLIANT_24HR_SITES = [
  'ONT8', 'OLM1', 'SBD3', 'HEA2', 'TEB9', 'IND9', 'HLI2', 'ABQ2', 'AVP1', 'GYR3'
];

export default function DashboardTab() {
  // Navigation tabs state
  const [activeTab, setActiveTab] = useState('time-tools');

  // SDT Push Calculator States
  const [sdtVrid, setSdtVrid] = useState('VRID459203');
  const [sdtCarrier, setSdtCarrier] = useState('NCSL');
  const [sdtSubCarrier, setSdtSubCarrier] = useState('AZNG');
  const [sdtTrailerAttached, setSdtTrailerAttached] = useState(true);
  const [sdtCptChanged, setSdtCptChanged] = useState(false);
  const [sdtTourOrRun, setSdtTourOrRun] = useState(false);
  const [sdtIs3P, setSdtIs3P] = useState(false);
  const [sdtCopySuccess, setSdtCopySuccess] = useState(false);

  // Loading Compliance Calculator States
  const [originSite, setOriginSite] = useState('PBI3');
  const [originSiteWarning, setOriginSiteWarning] = useState(null);
  const [currentSiteTimeInput, setCurrentSiteTimeInput] = useState('19-05-2026 10:31');
  const [complianceWarning, setComplianceWarning] = useState(null);
  const [isHistoryDialogOpen, setIsHistoryDialogOpen] = useState(false);
  const [calculatedCompliance, setCalculatedCompliance] = useState('20-05-2026 22:31');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // History state of calculations
  const [complianceHistory, setComplianceHistory] = useState([
    {
      id: 'initial-seed',
      site: 'PBI3',
      timeInput: '19-05-2026 10:31',
      result: '20-05-2026 22:31',
      offsetHours: 36,
      timestamp: 'Initial Target'
    }
  ]);

  // Transit Time Calculator States
  const [transitHrsInput, setTransitHrsInput] = useState('154');
  const [validationWarning, setValidationWarning] = useState(null);

  // Custom Date-Time Parsing
  const parseCustomDateTime = (input) => {
    if (!input) return null;
    let cleaned = input.trim().replace(/\s+/g, ' '); // normalize whitespace

    // 1. DD/MM/YYYY HH:mm or DD-MM-YYYY HH:mm or DD.MM.YYYY HH:mm
    let match = cleaned.match(/^(\d{1,2})[.\-\/](\d{1,2})[.\-\/](\d{4})[T ](\d{1,2})[:.](\d{1,2})(?::\d{2})?(?:\s*(AM|PM))?$/i);
    if (match) {
      const [_, dayStr, monthStr, yearStr, hourStr, minStr, ampm] = match;
      let hour = parseInt(hourStr, 10);
      const min = parseInt(minStr, 10);
      const day = parseInt(dayStr, 10);
      const month = parseInt(monthStr, 10);
      const year = parseInt(yearStr, 10);

      if (ampm) {
        if (ampm.toUpperCase() === 'PM' && hour < 12) hour += 12;
        if (ampm.toUpperCase() === 'AM' && hour === 12) hour = 0;
      }

      const d = new Date(year, month - 1, day, hour, min);
      if (!isNaN(d.getTime())) return d;
    }

    // 2. DD/MM/YYYY or DD-MM-YYYY or DD.MM.YYYY (without time)
    match = cleaned.match(/^(\d{1,2})[.\-\/](\d{1,2})[.\-\/](\d{4})$/);
    if (match) {
      const [_, dayStr, monthStr, yearStr] = match;
      const day = parseInt(dayStr, 10);
      const month = parseInt(monthStr, 10);
      const year = parseInt(yearStr, 10);
      const d = new Date(year, month - 1, day, 0, 0);
      if (!isNaN(d.getTime())) return d;
    }

    // 3. YYYY-MM-DD HH:mm
    match = cleaned.match(/^(\d{4})[.\-\/](\d{1,2})[.\-\/](\d{1,2})[T ](\d{1,2})[:.](\d{1,2})(?::\d{2})?(?:\s*(AM|PM))?$/i);
    if (match) {
      const [_, yearStr, monthStr, dayStr, hourStr, minStr, ampm] = match;
      let hour = parseInt(hourStr, 10);
      const min = parseInt(minStr, 10);
      const day = parseInt(dayStr, 10);
      const month = parseInt(monthStr, 10);
      const year = parseInt(yearStr, 10);

      if (ampm) {
        if (ampm.toUpperCase() === 'PM' && hour < 12) hour += 12;
        if (ampm.toUpperCase() === 'AM' && hour === 12) hour = 0;
      }

      const d = new Date(year, month - 1, day, hour, min);
      if (!isNaN(d.getTime())) return d;
    }

    // 4. YYYY-MM-DD
    match = cleaned.match(/^(\d{4})[.\-\/](\d{1,2})[.\-\/](\d{1,2})$/);
    if (match) {
      const [_, yearStr, monthStr, dayStr] = match;
      const day = parseInt(dayStr, 10);
      const month = parseInt(monthStr, 10);
      const year = parseInt(yearStr, 10);
      const d = new Date(year, month - 1, day, 0, 0);
      if (!isNaN(d.getTime())) return d;
    }

    // Fallback standard JS Date
    const fallback = new Date(cleaned);
    if (!isNaN(fallback.getTime())) return fallback;

    return null;
  };

  // Helper to format date consistent with DD-MM-YYYY HH:mm
  const formatDateTime = (date) => {
    if (isNaN(date.getTime())) return "Invalid Date";
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${day}-${month}-${year} ${hours}:${minutes}`;
  };

  // Perform calculation and save record to history logs
  const computeAndAddRecord = (actionName) => {
    const site = originSite.toUpperCase().trim();
    if (!site) {
      setOriginSiteWarning('Enter Site');
      return null;
    }

    const baseDate = parseCustomDateTime(currentSiteTimeInput);
    if (!baseDate) {
      setComplianceWarning('⚠️ Mismatch pattern. Use DD-MM-YYYY HH:mm.');
      return null;
    }

    const is24hr = COMPLIANT_24HR_SITES.includes(site);
    const is36hr = COMPLIANT_36HR_SITES.includes(site);
    const offsetHours = is24hr ? 24 : is36hr ? 36 : 48;
    const complianceDate = new Date(baseDate.getTime() + offsetHours * 60 * 60 * 1000);
    const result = formatDateTime(complianceDate);

    // Save calculation with details in history log
    const now = new Date();
    const nowStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newRecord = {
      id: String(Date.now()),
      site,
      timeInput: currentSiteTimeInput,
      result,
      offsetHours,
      timestamp: `${nowStr} (${actionName})`
    };

    setComplianceHistory(prev => {
      // Avoid duplicate consecutive logs of the identical configurations
      const last = prev[0];
      if (last && last.site === site && last.timeInput === currentSiteTimeInput && last.result === result) {
        return prev;
      }
      return [newRecord, ...prev];
    });

    setOriginSiteWarning(null);
    setComplianceWarning(null);
    return result;
  };

  // Calculate Action trigger
  const handleCalculateCompliance = () => {
    const calculated = computeAndAddRecord('Calculated');
    if (calculated) {
      setCalculatedCompliance(calculated);
    }
  };

  // Calculate Transit Time directly into Days & Hours formatted with "+"
  const calculateTransitTimeText = () => {
    const rawHours = parseInt(transitHrsInput, 10);
    if (isNaN(rawHours) || rawHours < 0) return '0d + 0h';
    const days = Math.floor(rawHours / 24);
    const hours = rawHours % 24;
    return `${days}d + ${hours}h`;
  };

  // Origin site typing & pasting validation handlers (Mixed-case friendly)
  const handleOriginSiteTyping = (val) => {
    setOriginSite(val);
    const uppercased = val.toUpperCase().trim();
    if (uppercased === '') {
      setOriginSiteWarning('Site code is empty.');
    } else {
      setOriginSiteWarning(null);
    }
  };

  const handleOriginSitePaste = (e) => {
    const pastedText = e.clipboardData.getData('text');
    setOriginSite(pastedText);
    const uppercased = pastedText.toUpperCase().trim();
    if (uppercased === '') {
      setOriginSiteWarning('Site code is empty.');
    } else {
      setOriginSiteWarning(null);
    }
    e.preventDefault();
  };

  const handleResetLoadingCompliance = () => {
    setOriginSite('');
    setOriginSiteWarning(null);
    setCurrentSiteTimeInput('');
    setComplianceWarning(null);
    setCalculatedCompliance(null);
    setTransitHrsInput('');
    setValidationWarning(null);
  };

  // Site time typing & pasting validation handlers
  const handleSiteTimeTyping = (val) => {
    setCurrentSiteTimeInput(val);
    if (val === '') {
      setComplianceWarning('Time input is empty.');
      return;
    }
    const parsed = parseCustomDateTime(val);
    if (!parsed) {
      setComplianceWarning('Format suggestion: DD-MM-YYYY HH:mm');
    } else {
      setComplianceWarning(null);
    }
  };

  const handleSiteTimePaste = (e) => {
    const pastedText = e.clipboardData.getData('text').trim();
    setCurrentSiteTimeInput(pastedText);
    const parsed = parseCustomDateTime(pastedText);
    if (!parsed) {
      setComplianceWarning('⚠️ Verification mismatch.');
    } else {
      setComplianceWarning(null);
    }
    e.preventDefault();
  };

  const getDatetimeInputValue = () => {
    const parsed = parseCustomDateTime(currentSiteTimeInput);
    if (!parsed) return '';
    const year = parsed.getFullYear();
    const month = String(parsed.getMonth() + 1).padStart(2, '0');
    const day = String(parsed.getDate()).padStart(2, '0');
    const hours = String(parsed.getHours()).padStart(2, '0');
    const minutes = String(parsed.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  // Type and paste handlers with interactive validation for Transit
  const handleHoursTyping = (val) => {
    if (val === '') {
      setTransitHrsInput('');
      setValidationWarning('Input is empty.');
      return;
    }

    if (val.startsWith('-')) {
      const sanitized = val.replace('-', '');
      setTransitHrsInput(sanitized);
      return;
    }

    if (val.includes('.') || val.includes(',')) {
      const parsedFloat = parseFloat(val);
      if (!isNaN(parsedFloat)) {
        setTransitHrsInput(String(Math.round(parsedFloat)));
      }
      return;
    }

    if (!/^\d+$/.test(val)) {
      const sanitized = val.replace(/\D/g, '');
      setTransitHrsInput(sanitized);
      return;
    }

    const num = parseInt(val, 10);
    if (num > 20000) {
      setValidationWarning('Max hours context exceeded.');
    } else {
      setValidationWarning(null);
    }

    setTransitHrsInput(val);
  };

  const handleHoursPaste = (e) => {
    const pastedText = e.clipboardData.getData('text');
    const cleanedDigits = pastedText.replace(/\D/g, '');
    setTransitHrsInput(cleanedDigits || '0');
    e.preventDefault();
  };

  const SDT_PRESETS = [
    {
      name: "✅ NCSL - AZNG (Eligible)",
      vrid: "VRID_NCSL_OK_101",
      carrier: "NCSL",
      subCarrier: "AZNG",
      trailerAttached: true,
      cptChanged: false,
      tourOrRun: false,
      is3P: false,
    },
    {
      name: "🛑 NCSL - Loose Trailer (Not Attached)",
      vrid: "VRID_NCSL_FAIL_202",
      carrier: "NCSL",
      subCarrier: "AZNG",
      trailerAttached: false,
      cptChanged: false,
      tourOrRun: false,
      is3P: false,
    },
    {
      name: "🛑 AZIM - AZNU",
      vrid: "VRID_AZIM_FAIL_303",
      carrier: "AZIM",
      subCarrier: "AZNU",
      trailerAttached: true,
      cptChanged: false,
      tourOrRun: false,
      is3P: false,
    },
    {
      name: "🛑 HUBG - HGIU (3P Carrier)",
      vrid: "VRID_HUBG_FAIL_505",
      carrier: "HUBG",
      subCarrier: "HGIU",
      trailerAttached: true,
      cptChanged: false,
      tourOrRun: false,
      is3P: true,
    },
    {
      name: "🛑 Tour/Run Structure",
      vrid: "VRID_NCSL_TOUR_707",
      carrier: "NCSL",
      subCarrier: "AZNG",
      trailerAttached: true,
      cptChanged: false,
      tourOrRun: true,
      is3P: false,
    },
  ];

  const handleCarrierChange = (carrier) => {
    setSdtCarrier(carrier);
    if (carrier === 'NCSL') {
      setSdtSubCarrier('AZNG');
      setSdtIs3P(false);
    } else if (carrier === 'AZIM') {
      setSdtSubCarrier('AZNU');
      setSdtIs3P(false);
    } else if (carrier === 'HJBI') {
      setSdtSubCarrier('JBHU');
      setSdtIs3P(false);
    } else if (carrier === 'HUBG') {
      setSdtSubCarrier('HGIU');
      setSdtIs3P(false);
    } else if (carrier === 'PGLI') {
      setSdtSubCarrier('XPOU/STTU');
      setSdtIs3P(false);
    } else if (carrier === 'SCDS') {
      setSdtSubCarrier('SNLU');
      setSdtIs3P(false);
    } else if (carrier === '3P OTR/IM') {
      setSdtSubCarrier('Custom 3P');
      setSdtIs3P(true);
    }
  };

  const loadSdtPreset = (preset) => {
    setSdtVrid(preset.vrid);
    setSdtCarrier(preset.carrier);
    setSdtSubCarrier(preset.subCarrier);
    setSdtTrailerAttached(preset.trailerAttached);
    setSdtCptChanged(preset.cptChanged);
    setSdtTourOrRun(preset.tourOrRun);
    setSdtIs3P(preset.is3P);
  };

  const evaluateSdtPush = () => {
    const checks = [
      {
        id: 'carrier',
        label: "Carrier equals NCSL and Sub-carrier equals AZNG",
        passed: sdtCarrier === 'NCSL' && sdtSubCarrier === 'AZNG',
        desc: `Must be NCSL & AZNG. Current: ${sdtCarrier}/${sdtSubCarrier}`
      },
      {
        id: 'trailer',
        label: "Trailer is physically Attached",
        passed: sdtTrailerAttached,
        desc: sdtTrailerAttached ? "Yes, trailer is attached" : "Violation: Trailer must be attached to push"
      },
      {
        id: 'cpt',
        label: "CPT does not change",
        passed: !sdtCptChanged,
        desc: sdtCptChanged ? "Violation: CPT should NOT change while pushing VRID" : "CPT is unchanged"
      },
      {
        id: 'structure',
        label: "VRID is independent (Not part of Tour/Run)",
        passed: !sdtTourOrRun,
        desc: sdtTourOrRun ? "Violation: VRIDs under tours or runs cannot be pushed" : "Not part of tour or run"
      },
      {
        id: 'thirdparty',
        label: "Not a 3P OTR or 3P IM Load",
        passed: !sdtIs3P && sdtCarrier !== '3P OTR/IM',
        desc: (sdtIs3P || sdtCarrier === '3P OTR/IM') ? "Violation: 3P OTR/3P IM cannot be pushed" : "Internal NCSL Standard"
      }
    ];

    const isEligible = checks.every(c => c.passed);
    return { isEligible, checks };
  };

  const sdtAnalysis = evaluateSdtPush();

  const getSdtCopyText = () => {
    if (sdtAnalysis.isEligible) {
      return `[SDT PUSH APPROVED] VRID: ${sdtVrid} | Carrier: ${sdtCarrier}/${sdtSubCarrier} | Status: ELIGIBLE`;
    } else {
      const failed = sdtAnalysis.checks.filter(c => !c.passed).map(c => c.id.toUpperCase()).join(", ");
      return `[SDT PUSH REJECTED] VRID: ${sdtVrid} | Carrier: ${sdtCarrier}/${sdtSubCarrier} | Status: DENIED (Failed: ${failed})`;
    }
  };

  const handleCopySdtLog = () => {
    navigator.clipboard.writeText(getSdtCopyText());
    setSdtCopySuccess(true);
    setTimeout(() => setSdtCopySuccess(false), 2000);
  };

  const ALL_SITES = [...COMPLIANT_24HR_SITES, ...COMPLIANT_36HR_SITES];
  const filteredSites = ALL_SITES.filter(site =>
    site.toLowerCase().includes(originSite.toLowerCase().trim())
  ).sort().slice(0, 8);

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] w-full py-2 px-1">

      {/* Premium Centered Header */}
      <div className="text-center mb-6 select-none animate-fade-in">
        <h1 className="text-3.5xl font-black text-slate-900 tracking-wider font-display uppercase drop-shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
          Calculators
        </h1>
        <div className="mt-1 h-[3px] w-12 bg-linear-to-r from-blue-600 to-indigo-600 mx-auto rounded-full" />
      </div>

      {/* 3D Dynamic Card Layout Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-[720px] justify-items-center items-stretch">

        {/* CARD 1: COMPLIANCE DEADLINE CONSOLE */}
        <div
          className="w-full max-w-[325px] bg-white border border-slate-200/80 rounded-2xl shadow-[0_12px_24px_-4px_rgba(0,0,0,0.06),0_4px_12px_-2px_rgba(0,0,0,0.03)] hover:shadow-[0_22px_36px_-6px_rgba(30,41,59,0.12),0_10px_20px_-4px_rgba(30,41,59,0.06)] hover:border-slate-300 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between overflow-hidden relative group"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Subtle Dynamic Neon Edge Glow on Hover */}
          <div className="absolute inset-0 bg-linear-to-b from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none -z-10" />

          {/* Integrated Dynamic Header Controls */}
          <div className="bg-slate-50 border-b border-slate-100/85 py-3 px-4.5 flex items-center justify-between select-none">
            <div className="flex items-center gap-2">
              <FileCheck className="h-4 w-4 text-slate-800" />
              <span className="font-display text-[12px] font-extrabold tracking-tight text-slate-900 uppercase">
                Compliance
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsHistoryDialogOpen(true)}
                className="text-[9px] font-extrabold text-slate-600 hover:text-blue-700 transition-all cursor-pointer border border-slate-200/80 bg-white hover:bg-slate-50/50 px-2 py-1 rounded-md shadow-3xs hover:-translate-y-0.5 active:translate-y-0"
              >
                📁 History
              </button>
              <button
                type="button"
                onClick={handleResetLoadingCompliance}
                className="text-[9px] font-extrabold text-rose-600 hover:text-rose-700 transition-all cursor-pointer border border-rose-100 bg-rose-50/40 hover:bg-rose-50 px-2 py-1 rounded-md hover:-translate-y-0.5 active:translate-y-0"
              >
                Reset
              </button>
            </div>
          </div>

          {/* Core Stacked Console Panels - Unified layout with zero margin/gap below components */}
          <div className="p-5 flex-1 flex flex-col justify-between">
            <div className="space-y-4">

              {/* Origin Site Panel - Extra-Large Input */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest font-sans">
                    Origin Site Code
                  </label>
                  {COMPLIANT_24HR_SITES.includes(originSite.toUpperCase().trim()) ? (
                    <span className="text-[8px] text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded-full border border-emerald-100 font-bold font-sans flex items-center gap-1">
                      <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse"></span>
                      24h Strict
                    </span>
                  ) : COMPLIANT_36HR_SITES.includes(originSite.toUpperCase().trim()) ? (
                    <span className="text-[8px] text-teal-700 bg-teal-50 px-1.5 py-0.2 rounded-full border border-teal-100 font-bold font-sans flex items-center gap-1">
                      <span className="w-1 h-1 rounded-full bg-teal-500 animate-pulse"></span>
                      36h Strict
                    </span>
                  ) : originSite.trim() !== '' ? (
                    <span className="text-[8px] text-indigo-700 bg-indigo-50 px-1.5 py-0.2 rounded-full border border-indigo-100 font-bold font-sans flex items-center gap-1">
                      <span className="w-1 h-1 rounded-full bg-indigo-500"></span>
                      48h Standard
                    </span>
                  ) : null}
                </div>

                <div className="relative">
                  <input
                    type="text"
                    value={originSite}
                    onChange={(e) => {
                      handleOriginSiteTyping(e.target.value);
                      setIsDropdownOpen(true);
                    }}
                    onPaste={(e) => {
                      handleOriginSitePaste(e);
                      setIsDropdownOpen(true);
                    }}
                    onFocus={() => setIsDropdownOpen(true)}
                    onBlur={() => setTimeout(() => setIsDropdownOpen(false), 200)}
                    placeholder="e.g. bna6 or BNA6"
                    className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 rounded-xl py-3.5 px-4 text-[13px] font-bold text-slate-900 placeholder-slate-400 focus:bg-white transition-all font-sans"
                  />

                  {isDropdownOpen && filteredSites.length > 0 && (
                    <div className="absolute left-0 right-0 top-full mt-1.5 bg-white border border-slate-200 rounded-xl shadow-[0_10px_25px_-5px_rgba(0,0,0,0.1),0_8px_16px_-6px_rgba(0,0,0,0.05)] max-h-48 overflow-y-auto z-50 py-1 divide-y divide-slate-100 animate-fade-in">
                      {filteredSites.map((site) => {
                        const is24 = COMPLIANT_24HR_SITES.includes(site);
                        return (
                          <button
                            key={site}
                            type="button"
                            onMouseDown={() => {
                              setOriginSite(site);
                              setOriginSiteWarning(null);
                              setIsDropdownOpen(false);
                            }}
                            className="w-full text-left px-4 py-2 hover:bg-slate-50 text-[12px] font-bold text-slate-800 flex items-center justify-between cursor-pointer transition-colors"
                          >
                            <span className="font-mono">{site}</span>
                            <span className={`text-[8px] px-1.5 py-0.2 rounded font-sans font-extrabold ${is24 ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-teal-50 text-teal-700 border border-teal-100'}`}>
                              {is24 ? '24h Strict' : '36h Strict'}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {originSiteWarning && (
                  <div className="text-[9px] text-amber-600 font-mono pl-1">
                    ⚠️ {originSiteWarning}
                  </div>
                )}
              </div>

              {/* Current Site Time Panel (Margin zero block - fits right below with no space overhead) */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest font-sans">
                    Current Site Time
                  </label>

                  {/* Micro Date picker floating label */}
                  <div className="relative inline-flex items-center">
                    <button
                      type="button"
                      className="text-[8px] font-extrabold text-indigo-600 bg-indigo-50/50 border border-indigo-200 px-1.5 py-0.5 rounded font-mono hover:bg-indigo-100 flex items-center gap-0.5 cursor-pointer"
                    >
                      📅 Calendar
                    </button>
                    <input
                      type="datetime-local"
                      value={getDatetimeInputValue()}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val) {
                          const d = new Date(val);
                          if (!isNaN(d.getTime())) {
                            const formatted = formatDateTime(d);
                            setCurrentSiteTimeInput(formatted);
                            setComplianceWarning(null);
                          }
                        }
                      }}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    />
                  </div>
                </div>

                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                    <Calendar className="h-4 w-4" />
                  </span>
                  <input
                    type="text"
                    value={currentSiteTimeInput}
                    onChange={(e) => handleSiteTimeTyping(e.target.value)}
                    onPaste={handleSiteTimePaste}
                    placeholder="DD-MM-YYYY HH:mm"
                    className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 rounded-xl py-3.5 pl-10 pr-4 text-[13px] font-bold text-slate-900 focus:bg-white transition-all font-sans"
                  />
                </div>

                {complianceWarning && (
                  <div className="bg-amber-50/80 text-amber-900 p-2 rounded-lg border border-amber-250/70 text-[9px] leading-snug font-mono">
                    {complianceWarning}
                  </div>
                )}
              </div>

              {/* Fused Action Trigger and Results - Margin completely removed, stacked tightly */}
              <button
                type="button"
                onClick={handleCalculateCompliance}
                className="w-full bg-slate-900 hover:bg-slate-800 active:scale-[0.985] text-white font-extrabold rounded-xl py-3.5 px-4 text-[11px] tracking-wider transition-all shadow-xs cursor-pointer flex items-center justify-center gap-1.5 font-mono uppercase hover:shadow-[0_8px_16px_rgba(0,0,0,0.06)] active:translate-y-px"
              >
                <Clock className="h-4 w-4 text-blue-400 animate-pulse" />
                Calculate Target
              </button>

            </div>

            {/* Simulated Live Output Block */}
            {calculatedCompliance && (
              <div className="mt-4 bg-slate-50 border border-slate-250/70 rounded-xl p-3.5 space-y-1 text-left animate-fade-in shadow-3xs">
                <div className="text-[8px] font-extrabold text-slate-400 uppercase tracking-widest font-sans">
                  Deadline Target Point
                </div>
                <div className="flex items-center justify-between gap-1 border-t border-slate-200/40 pt-1.5">
                  <span className="text-[10px] font-extrabold text-slate-500 font-sans">Time:</span>
                  <span className="text-[12px] font-extrabold text-slate-900 font-mono">
                    {calculatedCompliance}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* CARD 2: TRANSIT DURATION CONSOLE */}
        <div
          className="w-full max-w-[325px] bg-slate-900 text-white border border-slate-800 rounded-2xl shadow-[0_12px_24px_-4px_rgba(0,0,0,0.12),0_4px_12px_-2px_rgba(0,0,0,0.06)] hover:shadow-[0_22px_36px_-6px_rgba(15,23,42,0.3),0_10px_20px_-4px_rgba(15,23,42,0.2)] hover:border-slate-700 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between overflow-hidden relative group"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Dynamic Ambient Backlight */}
          <div className="absolute inset-0 bg-linear-to-b from-amber-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none -z-10" />

          {/* Integrated Header Controls */}
          <div className="bg-slate-950/80 border-b border-slate-800/80 py-3 px-4.5 flex items-center justify-between select-none">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-amber-500 animate-spin-slow" />
              <span className="font-display text-[12px] font-extrabold tracking-tight text-white uppercase">
                Transit Unit
              </span>
            </div>

            <span className="text-[8px] font-extrabold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full font-mono uppercase">
              Converter
            </span>
          </div>

          {/* Console inputs - unified vertically with 0 space between blocks */}
          <div className="p-5 flex-1 flex flex-col justify-between">
            <div className="space-y-4">

              {/* Transit Hours Input Box - Extra Large & Centered */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-[9px] font-extrabold text-slate-500 uppercase tracking-widest font-sans">
                    Transit Hours Input
                  </label>
                  <span className="text-[8px] text-slate-500 font-mono">Integer only</span>
                </div>

                <div className="relative">
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={transitHrsInput}
                    onChange={(e) => handleHoursTyping(e.target.value)}
                    onPaste={handleHoursPaste}
                    placeholder="Enter raw hours (e.g. 154)"
                    className="w-full bg-slate-950 border border-slate-800 hover:border-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500 rounded-xl py-3.5 px-4 text-[13px] font-bold text-white placeholder-slate-600 focus:bg-slate-950 transition-all font-sans"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-500 uppercase font-sans">
                    Hrs
                  </span>
                </div>

                {validationWarning && (
                  <div className="bg-amber-500/10 text-amber-400 p-2 rounded-lg border border-amber-500/20 text-[9px] leading-snug font-mono">
                    {validationWarning}
                  </div>
                )}
              </div>

            </div>

            {/* High fidelity real-time mechanical counter panel */}
            <div className="mt-6 bg-slate-950 border border-slate-800/80 rounded-xl p-4 text-left shadow-inner relative overflow-hidden">
              <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-linear-to-r from-transparent to-slate-950/20 pointer-events-none" />
              <div className="text-[8px] font-extrabold text-slate-500 uppercase tracking-widest font-sans">
                Converted Real Time Output
              </div>
              <div className="flex items-center justify-between gap-1 border-t border-slate-800/80 pt-2.5">
                <span className="text-[10px] font-extrabold text-slate-400 font-sans">Unit (d + h):</span>
                <span className="text-sm font-extrabold text-amber-400 font-mono tracking-wide bg-amber-400/5 px-2.5 py-0.5 rounded border border-amber-400/10 shadow-3xs">
                  {calculateTransitTimeText()}
                </span>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* COMPLIANCE HISTORY LOGS MODAL OVERLAY */}
      {isHistoryDialogOpen && (
        <div className="fixed inset-0 z-[99] flex items-center justify-center p-4">
          {/* Interactive Backdrop */}
          <div
            className="absolute inset-0 bg-slate-950/40 backdrop-blur-xs transition-opacity duration-150 animate-fade-in"
            onClick={() => setIsHistoryDialogOpen(false)}
          />

          {/* Modal Container */}
          <div className="relative bg-white border border-slate-200/90 w-full max-w-sm rounded-[18px] shadow-2xl overflow-hidden animate-zoom-in z-10 flex flex-col max-h-[80vh]">

            {/* Header bar */}
            <div className="bg-slate-950 text-white p-4 flex items-center justify-between select-none">
              <div className="flex items-center gap-2">
                <Database className="h-4 w-4 text-blue-400" />
                <span className="text-xs font-black uppercase tracking-wider font-mono">
                  Calculated Archives
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsHistoryDialogOpen(false)}
                className="text-slate-400 hover:text-white transition-all p-1 bg-slate-850 rounded-lg cursor-pointer"
                aria-label="Close"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Scrollable history logs */}
            <div className="p-4.5 space-y-3 flex-1 overflow-y-auto max-h-[55vh]">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest font-sans">
                  Historic Entries ({complianceHistory.length})
                </span>
                {complianceHistory.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setComplianceHistory([])}
                    className="text-[9px] text-rose-500 font-extrabold hover:underline cursor-pointer"
                  >
                    Wipe Logs
                  </button>
                )}
              </div>

              {complianceHistory.length === 0 ? (
                <div className="text-center py-6 px-4 border border-dashed border-slate-200 bg-slate-50 rounded-xl">
                  <p className="text-[10px] font-semibold text-slate-400 italic">Vault is currently empty.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {complianceHistory.map((item) => (
                    <div
                      key={item.id}
                      className="bg-slate-50 p-3 rounded-xl border border-slate-200/65 space-y-2 text-[10px] font-mono group relative transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span className="font-extrabold text-slate-900">{item.site}</span>
                          <span className="text-[8px] font-bold px-1.5 py-0.2 rounded bg-blue-50 text-blue-700 border border-blue-100">
                            {item.offsetHours}h
                          </span>
                        </div>
                        <span className="text-[8px] text-slate-400 font-sans">
                          {item.timestamp}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-1.5 px-2 py-1.5 bg-white rounded-lg border border-slate-200/50">
                        <div>
                          <p className="text-[7px] text-slate-400 uppercase font-black">Incoming</p>
                          <p className="text-slate-850 font-bold text-[9px] truncate">{item.timeInput}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[7px] text-slate-400 uppercase font-black">Target</p>
                          <p className="text-indigo-700 font-black text-[9px] truncate">{item.result}</p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setComplianceHistory(prev => prev.filter(p => p.id !== item.id));
                        }}
                        className="absolute right-2 top-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity p-1 bg-white hover:bg-rose-50 hover:text-rose-600 rounded-md border border-slate-200 hover:border-rose-200 cursor-pointer text-[8px]"
                        title="Remove"
                      >
                        🗑️
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="bg-slate-50 p-3 px-4.5 border-t border-slate-150 flex items-center justify-end">
              <button
                type="button"
                onClick={() => setIsHistoryDialogOpen(false)}
                className="bg-slate-950 hover:bg-slate-850 text-white font-extrabold rounded-lg py-1.5 px-3.5 text-[10px] cursor-pointer"
              >
                Done
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
