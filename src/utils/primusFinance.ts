export type PrimusCurrency = 'GBP' | 'SGD' | 'USD';

/**
 * Fixed illustrative exchange rates for consolidated portfolio & side-by-side comparison.
 * Documented clearly in all consolidated UI views.
 */
export const FIXED_FX_TO_USD: Record<PrimusCurrency, number> = {
  USD: 1.0,
  GBP: 1.28, // Fixed demo rate: 1 GBP = 1.28 USD
  SGD: 0.75, // Fixed demo rate: 1 SGD = 0.75 USD
};

export function convertPrimusCurrency(
  amount: number,
  from: PrimusCurrency,
  to: PrimusCurrency
): number {
  if (from === to) return amount;
  const usdValue = amount * FIXED_FX_TO_USD[from];
  return usdValue / FIXED_FX_TO_USD[to];
}

export function formatPrimusMoney(
  amount: number,
  currency: PrimusCurrency,
  compact = false
): string {
  const symbol = currency === 'GBP' ? '£' : currency === 'SGD' ? 'S$' : '$';
  if (!isFinite(amount)) return `${symbol}0`;
  const abs = Math.abs(amount);
  const sign = amount < 0 ? '-' : '';
  if (compact) {
    if (abs >= 1_000_000_000) return `${sign}${symbol}${(abs / 1_000_000_000).toFixed(2)}B`;
    if (abs >= 1_000_000) return `${sign}${symbol}${(abs / 1_000_000).toFixed(2)}M`;
    if (abs >= 1_000) return `${sign}${symbol}${(abs / 1_000).toFixed(1)}K`;
  }
  return `${sign}${symbol}${Math.round(abs).toLocaleString('en-US')}`;
}

export type ScenarioPresetId = 'base' | 'upside' | 'downside';

export interface UnderwritingAssumptions {
  scenarioId: ScenarioPresetId;
  scenarioLabel: string;
  holdYears: 5 | 10;
  purchasePrice: number;
  currentAnnualNoi: number;
  year1GrossPotentialRent: number;
  occupancyPct: number;
  annualRentGrowthPct: number;
  operatingExpensePct: number;
  annualCapexReserve: number;
  year1OneTimeCapex: number;
  acquisitionFeePct: number;
  ltvPct: number;
  interestRatePct: number;
  amortizationYears: number; // 0 = Interest-Only
  exitCapRatePct: number;
  exitSellingCostPct: number;
}

export interface YearlyCashFlowRow {
  year: number;
  grossPotentialRent: number;
  vacancyLoss: number;
  effectiveGrossIncome: number;
  operatingExpenses: number;
  noi: number;
  recurringCapex: number;
  oneTimeCapex: number;
  unleveredCashFlow: number;
  debtService: number;
  interestExpense: number;
  principalRepayment: number;
  endingDebtBalance: number;
  exitGrossValuation: number;
  exitSellingCosts: number;
  debtPayoffAtExit: number;
  netExitEquityProceeds: number;
  leveredEquityCashFlow: number;
  dscr: number | null; // null when unlevered (loan === 0)
}

export interface UnderwritingResult {
  valid: boolean;
  statusMessage?: string;
  entryCapRatePct: number | null;
  acquisitionFee: number;
  loanAmount: number;
  initialEquityInvested: number;
  forwardExitNoi: number;
  grossExitValuation: number | null;
  exitSellingCosts: number;
  endingDebtAtExit: number;
  netExitEquityProceeds: number | null;
  leveredIrrPct: number | null;
  irrStatus: 'valid' | 'no_solution' | 'invalid_inputs';
  unleveredIrrPct: number | null;
  equityMultiple: number | null;
  minDscr: number | null; // null => N/A
  year1Dscr: number | null; // null => N/A
  year1DebtYieldPct: number | null; // null => N/A
  rows: YearlyCashFlowRow[];
}

function npv(cashFlows: number[], rate: number): number {
  let total = 0;
  for (let t = 0; t < cashFlows.length; t++) {
    total += cashFlows[t] / Math.pow(1 + rate, t);
  }
  return total;
}

/**
 * Computes annual IRR cleanly via sign-change verification + bounded bisection.
 * Never returns NaN or Infinity; returns null when no mathematical root exists in [-90%, +400%].
 */
export function computeSafeIrr(cashFlows: number[]): {
  irrPct: number | null;
  status: 'valid' | 'no_solution' | 'invalid_inputs';
} {
  if (!cashFlows || cashFlows.length < 2) {
    return { irrPct: null, status: 'invalid_inputs' };
  }
  if (cashFlows.some((v) => !Number.isFinite(v))) {
    return { irrPct: null, status: 'invalid_inputs' };
  }
  const hasNegative = cashFlows.some((v) => v < 0);
  const hasPositive = cashFlows.some((v) => v > 0);
  if (!hasNegative || !hasPositive) {
    return { irrPct: null, status: 'no_solution' };
  }

  let low = -0.9;
  let high = 4.0;
  let fLow = npv(cashFlows, low);
  let fHigh = npv(cashFlows, high);

  // If NPV never crosses 0 in search interval, scan grid to bracket a sign flip
  if (fLow * fHigh > 0) {
    let foundBracket = false;
    const steps = 60;
    let prevR = low;
    let prevVal = fLow;
    for (let i = 1; i <= steps; i++) {
      const r = low + ((high - low) * i) / steps;
      const val = npv(cashFlows, r);
      if (prevVal * val <= 0) {
        low = prevR;
        high = r;
        fLow = prevVal;
        fHigh = val;
        foundBracket = true;
        break;
      }
      prevR = r;
      prevVal = val;
    }
    if (!foundBracket) {
      return { irrPct: null, status: 'no_solution' };
    }
  }

  for (let iter = 0; iter < 90; iter++) {
    const mid = (low + high) / 2;
    const fMid = npv(cashFlows, mid);
    if (Math.abs(fMid) < 1e-4) {
      return { irrPct: Number((mid * 100).toFixed(2)), status: 'valid' };
    }
    if (fLow * fMid <= 0) {
      high = mid;
      fHigh = fMid;
    } else {
      low = mid;
      fLow = fMid;
    }
  }

  const finalRate = (low + high) / 2;
  if (!Number.isFinite(finalRate)) return { irrPct: null, status: 'no_solution' };
  return { irrPct: Number((finalRate * 100).toFixed(2)), status: 'valid' };
}

/**
 * Inspectable underwriting cash-flow engine used identically by the Underwriting Studio,
 * Scenario Sensitivity Grid, and Investment Committee Memo.
 */
export function runUnderwritingModel(input: UnderwritingAssumptions): UnderwritingResult {
  const {
    holdYears,
    purchasePrice,
    currentAnnualNoi,
    year1GrossPotentialRent,
    occupancyPct,
    annualRentGrowthPct,
    operatingExpensePct,
    annualCapexReserve,
    year1OneTimeCapex,
    acquisitionFeePct,
    ltvPct,
    interestRatePct,
    amortizationYears,
    exitCapRatePct,
    exitSellingCostPct,
  } = input;

  // Validate critical inputs cleanly
  if (purchasePrice <= 0 || !Number.isFinite(purchasePrice)) {
    return {
      valid: false,
      statusMessage: 'Purchase price must be greater than 0.',
      entryCapRatePct: null,
      acquisitionFee: 0,
      loanAmount: 0,
      initialEquityInvested: 0,
      forwardExitNoi: 0,
      grossExitValuation: null,
      exitSellingCosts: 0,
      endingDebtAtExit: 0,
      netExitEquityProceeds: null,
      leveredIrrPct: null,
      irrStatus: 'invalid_inputs',
      unleveredIrrPct: null,
      equityMultiple: null,
      minDscr: null,
      year1Dscr: null,
      year1DebtYieldPct: null,
      rows: [],
    };
  }

  if (exitCapRatePct <= 0 || exitCapRatePct > 30 || !Number.isFinite(exitCapRatePct)) {
    return {
      valid: false,
      statusMessage: 'Exit cap rate must be between 0.1% and 30.0%.',
      entryCapRatePct: Number(((currentAnnualNoi / purchasePrice) * 100).toFixed(2)),
      acquisitionFee: purchasePrice * (acquisitionFeePct / 100),
      loanAmount: purchasePrice * (ltvPct / 100),
      initialEquityInvested: 0,
      forwardExitNoi: 0,
      grossExitValuation: null,
      exitSellingCosts: 0,
      endingDebtAtExit: 0,
      netExitEquityProceeds: null,
      leveredIrrPct: null,
      irrStatus: 'invalid_inputs',
      unleveredIrrPct: null,
      equityMultiple: null,
      minDscr: null,
      year1Dscr: null,
      year1DebtYieldPct: null,
      rows: [],
    };
  }

  if (ltvPct < 0 || ltvPct >= 100 || interestRatePct < 0 || occupancyPct < 0 || occupancyPct > 100) {
    return {
      valid: false,
      statusMessage: 'Check leverage (0–99%), interest rate (>= 0%), and occupancy (0–100%).',
      entryCapRatePct: Number(((currentAnnualNoi / purchasePrice) * 100).toFixed(2)),
      acquisitionFee: 0,
      loanAmount: 0,
      initialEquityInvested: 0,
      forwardExitNoi: 0,
      grossExitValuation: null,
      exitSellingCosts: 0,
      endingDebtAtExit: 0,
      netExitEquityProceeds: null,
      leveredIrrPct: null,
      irrStatus: 'invalid_inputs',
      unleveredIrrPct: null,
      equityMultiple: null,
      minDscr: null,
      year1Dscr: null,
      year1DebtYieldPct: null,
      rows: [],
    };
  }

  const entryCapRatePct = Number(((currentAnnualNoi / purchasePrice) * 100).toFixed(2));
  const acquisitionFee = purchasePrice * (acquisitionFeePct / 100);
  const loanAmount = ltvPct > 0 ? purchasePrice * (ltvPct / 100) : 0;
  const initialEquityInvested = purchasePrice + acquisitionFee - loanAmount;

  const rDebt = interestRatePct / 100;
  const isDebtActive = loanAmount > 0;
  const annualConstantPayment = !isDebtActive
    ? 0
    : amortizationYears <= 0
    ? loanAmount * rDebt // Interest-Only
    : rDebt === 0
    ? loanAmount / amortizationYears
    : (loanAmount * rDebt) / (1 - Math.pow(1 + rDebt, -amortizationYears));

  // Precompute Year N+1 NOI for gross exit valuation
  const computeYearOperating = (year: number) => {
    const gpr = year1GrossPotentialRent * Math.pow(1 + annualRentGrowthPct / 100, year - 1);
    const vac = gpr * (1 - occupancyPct / 100);
    const egi = gpr - vac;
    const opex = egi * (operatingExpensePct / 100);
    const noi = egi - opex;
    return { gpr, vac, egi, opex, noi };
  };

  const forwardYear = computeYearOperating(holdYears + 1);
  const forwardExitNoi = forwardYear.noi;
  const grossExitValuation = forwardExitNoi / (exitCapRatePct / 100);
  const exitSellingCosts = grossExitValuation * (exitSellingCostPct / 100);

  const rows: YearlyCashFlowRow[] = [];
  const leveredSeries: number[] = [-initialEquityInvested];
  const unleveredSeries: number[] = [-(purchasePrice + acquisitionFee)];

  let runningBalance = loanAmount;

  for (let year = 1; year <= holdYears; year++) {
    const op = computeYearOperating(year);
    const recurringCapex = annualCapexReserve;
    const oneTimeCapex = year === 1 ? year1OneTimeCapex : 0;

    let interestExpense = 0;
    let principalRepayment = 0;
    let debtService = 0;

    if (isDebtActive && runningBalance > 0) {
      interestExpense = runningBalance * rDebt;
      if (amortizationYears <= 0) {
        debtService = interestExpense;
        principalRepayment = 0;
      } else {
        debtService = Math.min(runningBalance + interestExpense, annualConstantPayment);
        principalRepayment = Math.max(0, debtService - interestExpense);
      }
      runningBalance = Math.max(0, runningBalance - principalRepayment);
    }

    const isExitYear = year === holdYears;
    const exitGross = isExitYear ? grossExitValuation : 0;
    const exitCosts = isExitYear ? exitSellingCosts : 0;
    const debtPayoffAtExit = isExitYear ? runningBalance : 0;
    const netExitEquityProceeds = isExitYear ? exitGross - exitCosts - debtPayoffAtExit : 0;
    const netExitUnleveredProceeds = isExitYear ? exitGross - exitCosts : 0;

    const unleveredOperating = op.noi - recurringCapex - oneTimeCapex;
    const unleveredTotal = unleveredOperating + netExitUnleveredProceeds;
    const leveredOperating = op.noi - recurringCapex - oneTimeCapex - debtService;
    const leveredTotal = leveredOperating + netExitEquityProceeds;

    const dscr = isDebtActive && debtService > 0 ? Number((op.noi / debtService).toFixed(2)) : null;

    rows.push({
      year,
      grossPotentialRent: op.gpr,
      vacancyLoss: op.vac,
      effectiveGrossIncome: op.egi,
      operatingExpenses: op.opex,
      noi: op.noi,
      recurringCapex,
      oneTimeCapex,
      unleveredCashFlow: unleveredTotal,
      debtService,
      interestExpense,
      principalRepayment,
      endingDebtBalance: runningBalance,
      exitGrossValuation: exitGross,
      exitSellingCosts: exitCosts,
      debtPayoffAtExit,
      netExitEquityProceeds,
      leveredEquityCashFlow: leveredTotal,
      dscr,
    });

    leveredSeries.push(leveredTotal);
    unleveredSeries.push(unleveredTotal);
  }

  const levIrr = computeSafeIrr(leveredSeries);
  const unlevIrr = computeSafeIrr(unleveredSeries);

  const totalOutflows = leveredSeries
    .filter((cf) => cf < 0)
    .reduce((sum, cf) => sum + Math.abs(cf), 0);
  const totalInflows = leveredSeries
    .filter((cf) => cf > 0)
    .reduce((sum, cf) => sum + cf, 0);
  const equityMultiple =
    totalOutflows > 0 ? Number((totalInflows / totalOutflows).toFixed(2)) : null;

  const dscrValues = rows.map((r) => r.dscr).filter((v): v is number => v !== null);
  const minDscr = dscrValues.length > 0 ? Math.min(...dscrValues) : null;
  const year1Dscr = rows[0]?.dscr ?? null;
  const year1DebtYieldPct =
    isDebtActive && loanAmount > 0 && rows[0]
      ? Number(((rows[0].noi / loanAmount) * 100).toFixed(2))
      : null;

  return {
    valid: true,
    entryCapRatePct,
    acquisitionFee,
    loanAmount,
    initialEquityInvested,
    forwardExitNoi,
    grossExitValuation,
    exitSellingCosts,
    endingDebtAtExit: rows[rows.length - 1]?.endingDebtBalance ?? 0,
    netExitEquityProceeds: rows[rows.length - 1]?.netExitEquityProceeds ?? null,
    leveredIrrPct: levIrr.irrPct,
    irrStatus: levIrr.status,
    unleveredIrrPct: unlevIrr.irrPct,
    equityMultiple,
    minDscr,
    year1Dscr,
    year1DebtYieldPct,
    rows,
  };
}

export function buildSensitivityMatrix(base: UnderwritingAssumptions) {
  const occOffsets = [-6, -3, 0, 3, 6];
  const exitCapOffsets = [-0.5, -0.25, 0, 0.25, 0.5];

  const occHeaders = occOffsets.map((d) => Math.max(50, Math.min(100, base.occupancyPct + d)));
  const capRows = exitCapOffsets.map((d) => Math.max(2.5, Number((base.exitCapRatePct + d).toFixed(2))));

  const matrix = capRows.map((cap) =>
    occHeaders.map((occ) => {
      const res = runUnderwritingModel({
        ...base,
        occupancyPct: occ,
        exitCapRatePct: cap,
      });
      return {
        occupancyPct: occ,
        exitCapRatePct: cap,
        irrPct: res.leveredIrrPct,
        equityMultiple: res.equityMultiple,
      };
    })
  );

  return { occHeaders, capRows, matrix };
}
