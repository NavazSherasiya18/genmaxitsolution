import meridianLogisticsImg from '../assets/images/primus_meridian_logistics_1794823850949.jpg';
import londonOfficeImg from '../assets/images/primus_london_office_1794823850703.jpg';
import singaporeTowerImg from '../assets/images/primus_singapore_tower_1794823851156.jpg';
import londonLogisticsImg from '../assets/images/primus_london_logistics_1794823852156.jpg';
import londonMixedUseImg from '../assets/images/primus_london_mixed_use_1794823883247.jpg';
import skylineTowersImg from '../assets/images/primus_skyline_towers_1794548654059.jpg';
import fintechShowcaseImg from '../assets/images/fintech_showcase_1794460779254.jpg';
import workspacePreviewImg from '../assets/images/primus_workspace_ui_1794823884241.jpg';
import {
  PrimusCurrency,
  ScenarioPresetId,
  UnderwritingAssumptions,
  UnderwritingResult,
} from '../utils/primusFinance';

export const PRIMUS_MEDIA = {
  meridianLogistics: meridianLogisticsImg,
  londonOffice: londonOfficeImg,
  singaporeTower: singaporeTowerImg,
  londonLogistics: londonLogisticsImg,
  londonMixedUse: londonMixedUseImg,
  skylineTowers: skylineTowersImg,
  fintechShowcase: fintechShowcaseImg,
  workspacePreview: workspacePreviewImg,
};

export type PrimusRole =
  | 'acquisitions_analyst'
  | 'committee_reviewer'
  | 'asset_manager'
  | 'investor_relations';

export type PrimusMarket = 'London' | 'Singapore';
export type PrimusAssetClass = 'office' | 'logistics' | 'mixed_use';
export type PrimusDealStage =
  | 'screening'
  | 'underwriting'
  | 'due_diligence'
  | 'committee'
  | 'approved'
  | 'rejected'
  | 'operating_holding';

export interface RentRollUnit {
  unitId: string;
  tenantName: string;
  sector: string;
  areaSqFt: number;
  annualRent: number; // Native asset currency
  leaseExpiryYear: number;
  status: 'leased' | 'vacant';
}

export interface LeaseExpiryBucket {
  year: number;
  pctOfRent: number;
  sqFtExpiring: number;
}

export interface DataRoomDoc {
  id: string;
  assetId: string;
  category: 'rent_roll' | 'operating_statement' | 'title_summary' | 'valuation_report' | 'committee_doc';
  title: string;
  updatedAt: string;
  fileType: 'XLSX / CSV' | 'PDF';
  sizeLabel: string;
  previewSummary: string;
  sampleContent: string;
}

export interface DiligenceTask {
  id: string;
  assetId: string;
  category: 'Technical' | 'Legal & Title' | 'Financial & Tax' | 'Environmental';
  title: string;
  owner: string;
  dueDate: string;
  required: boolean;
  status: 'completed' | 'in_progress' | 'pending';
}

export interface StageHistoryItem {
  stage: PrimusDealStage;
  dateLabel: string;
  actor: string;
  note: string;
}

export interface CommitteeSubmission {
  id: string;
  revisionNumber: number;
  assetId: string;
  submittedAtLabel: string;
  submittedBy: string;
  submissionNote: string;
  frozenScenarioId: ScenarioPresetId;
  frozenAssumptions: UnderwritingAssumptions;
  frozenResult: UnderwritingResult;
  diligenceSummary: string;
  status: 'pending_review' | 'approved' | 'rejected' | 'revision_requested';
  decisionBy?: string;
  decisionAtLabel?: string;
  decisionReason?: string;
}

export interface CommercialAsset {
  id: string;
  slug: string;
  code: string;
  name: string;
  market: PrimusMarket;
  district: string;
  currency: PrimusCurrency;
  assetClass: PrimusAssetClass;
  stage: PrimusDealStage;
  owner: string;
  askingPrice: number; // Native currency
  floorAreaSqFt: number;
  occupancyPct: number;
  currentAnnualNoi: number;
  waultYears: number;
  yearBuilt: number;
  sustainabilityRating: string;
  summary: string;
  nextAction: string;
  mapCoord: { xPct: number; yPct: number }; // Illustrative coordinate on city district map
  gallery: { url: string; caption: string }[];
  rentRoll: RentRollUnit[];
  expirySchedule: LeaseExpiryBucket[];
  monthlyNoiHistory: { month: string; noi: number }[];
  scenarios: Record<ScenarioPresetId, UnderwritingAssumptions>;
  comments: { id: string; author: string; dateLabel: string; text: string }[];
  stageHistory: StageHistoryItem[];
}

export interface SampleInvestorProfile {
  id: string;
  name: string;
  mandateType: string;
  city: string;
  reportingCurrency: 'USD';
  commitmentUsd: number;
  contributedUsd: number;
  distributionsUsd: number;
  holdings: {
    assetId: string;
    ownershipPct: number;
    costBasisUsd: number;
    currentValueUsd: number;
    ytdDistributionUsd: number;
  }[];
  quarterlyReports: {
    id: string;
    quarter: string;
    title: string;
    publishedDate: string;
    navUsd: number;
    distributionYieldPct: number;
    summary: string;
  }[];
  documentIds: string[];
}

export interface PrimusActivityEvent {
  id: string;
  timestampLabel: string;
  actor: string;
  role: PrimusRole;
  assetId?: string;
  title: string;
  detail: string;
}

export interface PrimusDataset {
  version: number;
  assets: CommercialAsset[];
  documents: DataRoomDoc[];
  diligenceTasks: DiligenceTask[];
  submissions: CommitteeSubmission[];
  investors: SampleInvestorProfile[];
  activityLog: PrimusActivityEvent[];
}

function buildScenarioPair(params: {
  purchasePrice: number;
  currentAnnualNoi: number;
  occupancyPct: number;
  baseExitCap: number;
  baseRentGrowth: number;
  opexPct: number;
  annualCapex: number;
  year1Capex: number;
  ltvPct: number;
  ratePct: number;
}): Record<ScenarioPresetId, UnderwritingAssumptions> {
  const gprAtFull = Math.round(
    params.currentAnnualNoi / ((params.occupancyPct / 100) * (1 - params.opexPct / 100))
  );

  return {
    base: {
      scenarioId: 'base',
      scenarioLabel: 'Base Case',
      holdYears: 5,
      purchasePrice: params.purchasePrice,
      currentAnnualNoi: params.currentAnnualNoi,
      year1GrossPotentialRent: gprAtFull,
      occupancyPct: params.occupancyPct,
      annualRentGrowthPct: params.baseRentGrowth,
      operatingExpensePct: params.opexPct,
      annualCapexReserve: params.annualCapex,
      year1OneTimeCapex: params.year1Capex,
      acquisitionFeePct: 1.25,
      ltvPct: params.ltvPct,
      interestRatePct: params.ratePct,
      amortizationYears: 25,
      exitCapRatePct: params.baseExitCap,
      exitSellingCostPct: 1.5,
    },
    upside: {
      scenarioId: 'upside',
      scenarioLabel: 'Upside',
      holdYears: 5,
      purchasePrice: params.purchasePrice,
      currentAnnualNoi: params.currentAnnualNoi,
      year1GrossPotentialRent: gprAtFull,
      occupancyPct: Math.min(98.5, Number((params.occupancyPct + 3.2).toFixed(1))),
      annualRentGrowthPct: Number((params.baseRentGrowth + 1.1).toFixed(1)),
      operatingExpensePct: Math.max(14, params.opexPct - 1.5),
      annualCapexReserve: params.annualCapex,
      year1OneTimeCapex: Math.round(params.year1Capex * 0.85),
      acquisitionFeePct: 1.25,
      ltvPct: params.ltvPct,
      interestRatePct: Math.max(3.5, Number((params.ratePct - 0.35).toFixed(2))),
      amortizationYears: 25,
      exitCapRatePct: Number((params.baseExitCap - 0.35).toFixed(2)),
      exitSellingCostPct: 1.5,
    },
    downside: {
      scenarioId: 'downside',
      scenarioLabel: 'Downside',
      holdYears: 5,
      purchasePrice: params.purchasePrice,
      currentAnnualNoi: params.currentAnnualNoi,
      year1GrossPotentialRent: gprAtFull,
      occupancyPct: Math.max(76, Number((params.occupancyPct - 10.2).toFixed(1))),
      annualRentGrowthPct: Math.max(0.5, Number((params.baseRentGrowth - 1.6).toFixed(1))),
      operatingExpensePct: params.opexPct + 2.5,
      annualCapexReserve: Math.round(params.annualCapex * 1.25),
      year1OneTimeCapex: Math.round(params.year1Capex * 1.35),
      acquisitionFeePct: 1.25,
      ltvPct: Math.max(0, params.ltvPct - 5),
      interestRatePct: Number((params.ratePct + 0.85).toFixed(2)),
      amortizationYears: 25,
      exitCapRatePct: Number((params.baseExitCap + 0.9).toFixed(2)),
      exitSellingCostPct: 1.75,
    },
  };
}

function makeMonthlySeries(annualNoi: number): { month: string; noi: number }[] {
  const base = annualNoi / 12;
  const factors = [0.97, 0.98, 1.0, 0.99, 1.01, 1.02];
  const months = ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'];
  return months.map((m, idx) => ({
    month: m,
    noi: Math.round(base * factors[idx]),
  }));
}

export function createSeededPrimusDataset(): PrimusDataset {
  const assets: CommercialAsset[] = [
    // 1. FLAGSHIP DEAL: Meridian Logistics Park, Singapore
    {
      id: 'meridian-logistics-park',
      slug: 'meridian-logistics-park',
      code: 'SG-LOG-01',
      name: 'Meridian Logistics Park, Singapore',
      market: 'Singapore',
      district: 'Tuas South Port Corridor',
      currency: 'SGD',
      assetClass: 'logistics',
      stage: 'due_diligence',
      owner: 'Elena Lin (VP Acquisitions)',
      askingPrice: 148_000_000,
      floorAreaSqFt: 485_000,
      occupancyPct: 94.2,
      currentAnnualNoi: 9_176_000,
      waultYears: 5.4,
      yearBuilt: 2022,
      sustainabilityRating: 'BCA Green Mark Platinum',
      summary:
        'Flagship modern ramp-up automated distribution complex positioned 2.4 km from Tuas Mega Port gates with solar-ready roof, 14m clear height, and cold-storage chambers.',
      nextAction: 'Complete final Tuas Dock Sprinkler Sign-Off & submit to Investment Committee',
      mapCoord: { xPct: 22, yPct: 68 },
      gallery: [
        {
          url: meridianLogisticsImg,
          caption: 'Tuas Harbor ramp-up loading apron & container staging yard',
        },
        {
          url: londonLogisticsImg,
          caption: 'Modern clear-span bay dock doors & automated dispatch wing',
        },
        {
          url: singaporeTowerImg,
          caption: 'Ancillary cold-chain management & port office hub',
        },
      ],
      rentRoll: [
        {
          unitId: 'Bay A1-A2',
          tenantName: 'Pacific Cold-Chain Pte Ltd',
          sector: 'Temperature-Controlled Logistics',
          areaSqFt: 168_000,
          annualRent: 4_120_000,
          leaseExpiryYear: 2031,
          status: 'leased',
        },
        {
          unitId: 'Bay B1-B2',
          tenantName: 'Asean Freight Automated',
          sector: 'Cross-Border 3PL',
          areaSqFt: 142_000,
          annualRent: 3_340_000,
          leaseExpiryYear: 2029,
          status: 'leased',
        },
        {
          unitId: 'Bay C1',
          tenantName: 'SinoMed Pharma Logistics',
          sector: 'Biopharma Cold Distribution',
          areaSqFt: 88_000,
          annualRent: 2_210_000,
          leaseExpiryYear: 2032,
          status: 'leased',
        },
        {
          unitId: 'Bay D1',
          tenantName: 'Tuas Robotics Fulfillment',
          sector: 'Port E-Commerce Sorting',
          areaSqFt: 58_870,
          annualRent: 1_520_000,
          leaseExpiryYear: 2028,
          status: 'leased',
        },
        {
          unitId: 'Bay D2 (Vacant)',
          tenantName: 'Available Lease Unit',
          sector: 'Unleased Expansion Bay',
          areaSqFt: 28_130,
          annualRent: 0,
          leaseExpiryYear: 2027,
          status: 'vacant',
        },
      ],
      expirySchedule: [
        { year: 2027, pctOfRent: 5.8, sqFtExpiring: 28_130 },
        { year: 2028, pctOfRent: 13.6, sqFtExpiring: 58_870 },
        { year: 2029, pctOfRent: 29.8, sqFtExpiring: 142_000 },
        { year: 2031, pctOfRent: 36.8, sqFtExpiring: 168_000 },
        { year: 2032, pctOfRent: 14.0, sqFtExpiring: 88_000 },
      ],
      monthlyNoiHistory: makeMonthlySeries(9_176_000),
      scenarios: buildScenarioPair({
        purchasePrice: 148_000_000,
        currentAnnualNoi: 9_176_000,
        occupancyPct: 94.2,
        baseExitCap: 5.75,
        baseRentGrowth: 3.1,
        opexPct: 18,
        annualCapex: 320_000,
        year1Capex: 1_450_000,
        ltvPct: 55,
        ratePct: 4.35,
      }),
      comments: [
        {
          id: 'c-mlp-1',
          author: 'Elena Lin (Acquisitions)',
          dateLabel: 'Yesterday',
          text: 'Base underwriting verified at 55% LTV; Downside stress tests Bay D2 vacancy extension and +90 bps cap rate widening.',
        },
      ],
      stageHistory: [
        { stage: 'screening', dateLabel: '14 Oct', actor: 'Elena Lin', note: 'Initial Tuas off-market broker memorandum screened.' },
        { stage: 'underwriting', dateLabel: '24 Oct', actor: 'Elena Lin', note: 'Built 5-year Base / Upside / Downside cash flow models.' },
        { stage: 'due_diligence', dateLabel: '04 Nov', actor: 'David Tan', note: 'Opened data room & engaged JTC land lease title review.' },
      ],
    },
    // 2. London Logistics Peer (Great for Meridian Comparison)
    {
      id: 'thames-gateway-hub',
      slug: 'thames-gateway-hub',
      code: 'UK-LOG-02',
      name: 'Thames Gateway Distribution Hub',
      market: 'London',
      district: 'Barking & Dagenham, East London',
      currency: 'GBP',
      assetClass: 'logistics',
      stage: 'underwriting',
      owner: 'Oliver Grant (Senior Associate)',
      askingPrice: 74_500_000,
      floorAreaSqFt: 310_000,
      occupancyPct: 91.5,
      currentAnnualNoi: 4_693_500,
      waultYears: 4.8,
      yearBuilt: 2021,
      sustainabilityRating: 'BREEAM Excellent / EPC A',
      summary:
        'Last-mile electric-fleet urban distribution hub servicing Greater London inside the A13 freight corridor with high power capacity for EV parcel vans.',
      nextAction: 'Finalize rent review uplift assumptions before moving to Diligence',
      mapCoord: { xPct: 76, yPct: 48 },
      gallery: [
        { url: londonLogisticsImg, caption: 'East London Thames Gateway loading bay facade' },
        { url: meridianLogisticsImg, caption: 'Rear container maneuvering apron' },
      ],
      rentRoll: [
        {
          unitId: 'Unit 01-04',
          tenantName: 'Albion Parcel Express Ltd',
          sector: 'Urban Courier Hub',
          areaSqFt: 185_000,
          annualRent: 3_120_000,
          leaseExpiryYear: 2030,
          status: 'leased',
        },
        {
          unitId: 'Unit 05-06',
          tenantName: 'Thames Fresh Direct',
          sector: 'Grocery Dark-Store Logistics',
          areaSqFt: 98_650,
          annualRent: 2_600_000,
          leaseExpiryYear: 2028,
          status: 'leased',
        },
        {
          unitId: 'Unit 07 (Vacant)',
          tenantName: 'Available Bay',
          sector: 'Vacant Suite',
          areaSqFt: 26_350,
          annualRent: 0,
          leaseExpiryYear: 2027,
          status: 'vacant',
        },
      ],
      expirySchedule: [
        { year: 2027, pctOfRent: 8.5, sqFtExpiring: 26_350 },
        { year: 2028, pctOfRent: 45.4, sqFtExpiring: 98_650 },
        { year: 2030, pctOfRent: 46.1, sqFtExpiring: 185_000 },
      ],
      monthlyNoiHistory: makeMonthlySeries(4_693_500),
      scenarios: buildScenarioPair({
        purchasePrice: 74_500_000,
        currentAnnualNoi: 4_693_500,
        occupancyPct: 91.5,
        baseExitCap: 5.85,
        baseRentGrowth: 3.4,
        opexPct: 18,
        annualCapex: 190_000,
        year1Capex: 820_000,
        ltvPct: 50,
        ratePct: 4.85,
      }),
      comments: [],
      stageHistory: [
        { stage: 'screening', dateLabel: '28 Oct', actor: 'Oliver Grant', note: 'Identified reversionary UK logistics lease spread.' },
        { stage: 'underwriting', dateLabel: '07 Nov', actor: 'Oliver Grant', note: 'Modeling EV substation capex allocation.' },
      ],
    },
    // 3. Singapore Logistics Peer 2
    {
      id: 'jurong-cold-chain-centre',
      slug: 'jurong-cold-chain-centre',
      code: 'SG-LOG-03',
      name: 'Jurong Cold-Chain Logistics Centre',
      market: 'Singapore',
      district: 'Jurong Port Industrial Precinct',
      currency: 'SGD',
      assetClass: 'logistics',
      stage: 'screening',
      owner: 'Elena Lin (VP Acquisitions)',
      askingPrice: 92_000_000,
      floorAreaSqFt: 320_000,
      occupancyPct: 93.0,
      currentAnnualNoi: 5_980_000,
      waultYears: 4.1,
      yearBuilt: 2019,
      sustainabilityRating: 'BCA Green Mark GoldPlus',
      summary:
        'Multi-temperature freezer and ambient food logistics facility close to Jurong Port with 21 years remaining on underlying industrial land tenure.',
      nextAction: 'Compare freezer replacement cost against Meridian Logistics Park',
      mapCoord: { xPct: 38, yPct: 58 },
      gallery: [
        { url: meridianLogisticsImg, caption: 'Jurong Port loading apron & refrigerated truck bays' },
        { url: londonLogisticsImg, caption: 'Automated dock doors' },
      ],
      rentRoll: [
        {
          unitId: 'Zone 1-3',
          tenantName: 'Straits Cold Foods Pte',
          sector: 'Cold-Chain Grocer',
          areaSqFt: 297_600,
          annualRent: 7_290_000,
          leaseExpiryYear: 2029,
          status: 'leased',
        },
        {
          unitId: 'Zone 4 (Vacant)',
          tenantName: 'Available Chiller Room',
          sector: 'Vacant Cold Bay',
          areaSqFt: 22_400,
          annualRent: 0,
          leaseExpiryYear: 2027,
          status: 'vacant',
        },
      ],
      expirySchedule: [
        { year: 2027, pctOfRent: 7.0, sqFtExpiring: 22_400 },
        { year: 2029, pctOfRent: 93.0, sqFtExpiring: 297_600 },
      ],
      monthlyNoiHistory: makeMonthlySeries(5_980_000),
      scenarios: buildScenarioPair({
        purchasePrice: 92_000_000,
        currentAnnualNoi: 5_980_000,
        occupancyPct: 93.0,
        baseExitCap: 6.1,
        baseRentGrowth: 2.6,
        opexPct: 18,
        annualCapex: 240_000,
        year1Capex: 950_000,
        ltvPct: 50,
        ratePct: 4.45,
      }),
      comments: [],
      stageHistory: [
        { stage: 'screening', dateLabel: '10 Nov', actor: 'Elena Lin', note: 'Added for Tuas vs Jurong land tenure comparison.' },
      ],
    },
    // 4. Operating Holding #1 — London Prime Office
    {
      id: 'bishopsgate-limestone-house',
      slug: 'bishopsgate-limestone-house',
      code: 'UK-OFF-01',
      name: '28 Bishopsgate Limestone House',
      market: 'London',
      district: 'City of London, EC2',
      currency: 'GBP',
      assetClass: 'office',
      stage: 'operating_holding',
      owner: 'Claire Ashworth (Asset Manager)',
      askingPrice: 112_000_000,
      floorAreaSqFt: 142_000,
      occupancyPct: 96.5,
      currentAnnualNoi: 6_048_000,
      waultYears: 6.8,
      yearBuilt: 2020,
      sustainabilityRating: 'NABERS UK 5-Star',
      summary:
        'Stabilized City of London headquarters building featuring Portland stone facade, bronze glazing, and institutional financial and legal tenants on upward-only rent reviews.',
      nextAction: 'Track 2028 fourth-floor tenant rent review notice',
      mapCoord: { xPct: 56, yPct: 38 },
      gallery: [
        { url: londonOfficeImg, caption: 'Bishopsgate Portland limestone corner elevation' },
        { url: londonMixedUseImg, caption: 'Executive upper floor terrace' },
      ],
      rentRoll: [
        {
          unitId: 'Floors 1-4',
          tenantName: 'Alderney Legal LLP',
          sector: 'Corporate Law',
          areaSqFt: 74_000,
          annualRent: 4_150_000,
          leaseExpiryYear: 2032,
          status: 'leased',
        },
        {
          unitId: 'Floors 5-7',
          tenantName: 'Thames & Sterling Actuarial',
          sector: 'Insurance Advisory',
          areaSqFt: 63_030,
          annualRent: 3_410_000,
          leaseExpiryYear: 2030,
          status: 'leased',
        },
        {
          unitId: 'Suite 8B (Vacant)',
          tenantName: 'Available Mezzanine',
          sector: 'Vacant Office',
          areaSqFt: 4_970,
          annualRent: 0,
          leaseExpiryYear: 2027,
          status: 'vacant',
        },
      ],
      expirySchedule: [
        { year: 2027, pctOfRent: 3.5, sqFtExpiring: 4_970 },
        { year: 2030, pctOfRent: 45.1, sqFtExpiring: 63_030 },
        { year: 2032, pctOfRent: 51.4, sqFtExpiring: 74_000 },
      ],
      monthlyNoiHistory: makeMonthlySeries(6_048_000),
      scenarios: buildScenarioPair({
        purchasePrice: 112_000_000,
        currentAnnualNoi: 6_048_000,
        occupancyPct: 96.5,
        baseExitCap: 5.1,
        baseRentGrowth: 2.8,
        opexPct: 20,
        annualCapex: 220_000,
        year1Capex: 250_000,
        ltvPct: 45,
        ratePct: 4.55,
      }),
      comments: [],
      stageHistory: [
        { stage: 'operating_holding', dateLabel: 'Q1 2025', actor: 'IC Charter', note: 'Closed into Core European Office sleeve.' },
      ],
    },
    // 5. Operating Holding #2 — Singapore Mixed-Use
    {
      id: 'raffles-quay-exchange',
      slug: 'raffles-quay-exchange',
      code: 'SG-MIX-01',
      name: 'Raffles Quay Exchange Tower',
      market: 'Singapore',
      district: 'Raffles Place CBD, Singapore',
      currency: 'SGD',
      assetClass: 'mixed_use',
      stage: 'operating_holding',
      owner: 'Claire Ashworth (Asset Manager)',
      askingPrice: 215_000_000,
      floorAreaSqFt: 290_000,
      occupancyPct: 95.0,
      currentAnnualNoi: 10_535_000,
      waultYears: 5.9,
      yearBuilt: 2021,
      sustainabilityRating: 'BCA Green Mark Platinum',
      summary:
        'Flagship Raffles Place CBD commercial tower pairing Grade-A office suites with curated ground-level food & wealth banking pavilions.',
      nextAction: 'Prepare Q4 retail podium occupancy summary for LP report',
      mapCoord: { xPct: 68, yPct: 54 },
      gallery: [
        { url: singaporeTowerImg, caption: 'Raffles Place limestone vertical fins & landscaped podium' },
        { url: skylineTowersImg, caption: 'Singapore waterfront tower context' },
      ],
      rentRoll: [
        {
          unitId: 'L12-L24',
          tenantName: 'Merlion Asset Management',
          sector: 'Institutional Finance',
          areaSqFt: 165_000,
          annualRent: 7_980_000,
          leaseExpiryYear: 2031,
          status: 'leased',
        },
        {
          unitId: 'Podium L1-L3',
          tenantName: 'Straits Culinary & Banking Retail',
          sector: 'CBD Podium Retail',
          areaSqFt: 110_500,
          annualRent: 5_520_000,
          leaseExpiryYear: 2028,
          status: 'leased',
        },
        {
          unitId: 'Suite 11C',
          tenantName: 'Vacant Office Floorplate',
          sector: 'Available Space',
          areaSqFt: 14_500,
          annualRent: 0,
          leaseExpiryYear: 2027,
          status: 'vacant',
        },
      ],
      expirySchedule: [
        { year: 2027, pctOfRent: 5.0, sqFtExpiring: 14_500 },
        { year: 2028, pctOfRent: 40.9, sqFtExpiring: 110_500 },
        { year: 2031, pctOfRent: 54.1, sqFtExpiring: 165_000 },
      ],
      monthlyNoiHistory: makeMonthlySeries(10_535_000),
      scenarios: buildScenarioPair({
        purchasePrice: 215_000_000,
        currentAnnualNoi: 10_535_000,
        occupancyPct: 95.0,
        baseExitCap: 4.65,
        baseRentGrowth: 3.0,
        opexPct: 22,
        annualCapex: 380_000,
        year1Capex: 400_000,
        ltvPct: 45,
        ratePct: 4.15,
      }),
      comments: [],
      stageHistory: [
        { stage: 'operating_holding', dateLabel: 'Q2 2025', actor: 'IC Charter', note: 'Operating holding in Core-Plus Asia sleeve.' },
      ],
    },
    // 6. Committee Stage Asset (London Mixed-Use — pre-seeded pending committee memo!)
    {
      id: 'southbank-foundry-plaza',
      slug: 'southbank-foundry-plaza',
      code: 'UK-MIX-02',
      name: 'Southbank Foundry Plaza',
      market: 'London',
      district: 'Southwark SE1, London',
      currency: 'GBP',
      assetClass: 'mixed_use',
      stage: 'committee',
      owner: 'Oliver Grant (Senior Associate)',
      askingPrice: 88_000_000,
      floorAreaSqFt: 118_000,
      occupancyPct: 89.0,
      currentAnnualNoi: 4_928_000,
      waultYears: 4.3,
      yearBuilt: 2018,
      sustainabilityRating: 'BREEAM Very Good',
      summary:
        'Riverfront Southbank creative office and double-height hospitality colonnade steps from London Bridge transit interchange.',
      nextAction: 'Awaiting Investment Committee vote on frozen Rev-1 submission',
      mapCoord: { xPct: 48, yPct: 58 },
      gallery: [
        { url: londonMixedUseImg, caption: 'Southbank Plaza limestone & bronze retail colonnade' },
        { url: londonOfficeImg, caption: 'Adjacent London commercial corridor' },
      ],
      rentRoll: [
        {
          unitId: 'Floors 2-5',
          tenantName: 'Thames Design Collective',
          sector: 'Architecture & Engineering',
          areaSqFt: 72_000,
          annualRent: 4_100_000,
          leaseExpiryYear: 2029,
          status: 'leased',
        },
        {
          unitId: 'Ground Colonnade',
          tenantName: 'Foundry Coffee & Artisans',
          sector: 'F&B Hospitality',
          areaSqFt: 33_020,
          annualRent: 2_060_000,
          leaseExpiryYear: 2031,
          status: 'leased',
        },
        {
          unitId: 'Level 6 East',
          tenantName: 'Vacant Penthouse Floor',
          sector: 'Available Suite',
          areaSqFt: 12_980,
          annualRent: 0,
          leaseExpiryYear: 2027,
          status: 'vacant',
        },
      ],
      expirySchedule: [
        { year: 2027, pctOfRent: 11.0, sqFtExpiring: 12_980 },
        { year: 2029, pctOfRent: 58.2, sqFtExpiring: 72_000 },
        { year: 2031, pctOfRent: 30.8, sqFtExpiring: 33_020 },
      ],
      monthlyNoiHistory: makeMonthlySeries(4_928_000),
      scenarios: buildScenarioPair({
        purchasePrice: 88_000_000,
        currentAnnualNoi: 4_928_000,
        occupancyPct: 89.0,
        baseExitCap: 5.35,
        baseRentGrowth: 3.2,
        opexPct: 20,
        annualCapex: 260_000,
        year1Capex: 1_200_000,
        ltvPct: 50,
        ratePct: 4.9,
      }),
      comments: [
        {
          id: 'c-sbf-1',
          author: 'Oliver Grant',
          dateLabel: '2 days ago',
          text: 'Submitted Rev-1 Base Case underwriting memo with all required diligence completed.',
        },
      ],
      stageHistory: [
        { stage: 'screening', dateLabel: '01 Oct', actor: 'Oliver Grant', note: 'Off-market Southbank bridge approach.' },
        { stage: 'underwriting', dateLabel: '12 Oct', actor: 'Oliver Grant', note: 'Modeled Level 6 lease-up & terrace upgrade.' },
        { stage: 'due_diligence', dateLabel: '26 Oct', actor: 'Claire Ashworth', note: 'Completed structural & title packs.' },
        { stage: 'committee', dateLabel: '12 Nov', actor: 'Oliver Grant', note: 'Submitted Rev-1 to Investment Committee.' },
      ],
    },
    // 7. Marina Bay Atrium West (Singapore Office)
    {
      id: 'marina-bay-atrium',
      slug: 'marina-bay-atrium',
      code: 'SG-OFF-02',
      name: 'Marina Bay Atrium West',
      market: 'Singapore',
      district: 'Marina Bay Financial District',
      currency: 'SGD',
      assetClass: 'office',
      stage: 'underwriting',
      owner: 'Elena Lin (VP Acquisitions)',
      askingPrice: 184_000_000,
      floorAreaSqFt: 215_000,
      occupancyPct: 92.8,
      currentAnnualNoi: 8_832_000,
      waultYears: 5.1,
      yearBuilt: 2020,
      sustainabilityRating: 'BCA Green Mark Super Low Energy',
      summary:
        'Core Grade-A Marina Bay tower featuring column-free trading floors and direct MRT underground concourse link.',
      nextAction: 'Refine operating expense ratio & Green Mark energy rebate assumptions',
      mapCoord: { xPct: 76, yPct: 42 },
      gallery: [
        { url: skylineTowersImg, caption: 'Marina Bay financial skyline exterior' },
        { url: singaporeTowerImg, caption: 'Atrium drop-off lobby elevation' },
      ],
      rentRoll: [
        {
          unitId: 'Floors 18-30',
          tenantName: 'Pacific Horizon Sovereign Advisory',
          sector: 'Wealth Management',
          areaSqFt: 199_520,
          annualRent: 11_320_000,
          leaseExpiryYear: 2030,
          status: 'leased',
        },
        {
          unitId: 'Floor 17 (Vacant)',
          tenantName: 'Available Full Floorplate',
          sector: 'Vacant Office',
          areaSqFt: 15_480,
          annualRent: 0,
          leaseExpiryYear: 2027,
          status: 'vacant',
        },
      ],
      expirySchedule: [
        { year: 2027, pctOfRent: 7.2, sqFtExpiring: 15_480 },
        { year: 2030, pctOfRent: 92.8, sqFtExpiring: 199_520 },
      ],
      monthlyNoiHistory: makeMonthlySeries(8_832_000),
      scenarios: buildScenarioPair({
        purchasePrice: 184_000_000,
        currentAnnualNoi: 8_832_000,
        occupancyPct: 92.8,
        baseExitCap: 4.55,
        baseRentGrowth: 3.1,
        opexPct: 22,
        annualCapex: 310_000,
        year1Capex: 550_000,
        ltvPct: 50,
        ratePct: 4.2,
      }),
      comments: [],
      stageHistory: [
        { stage: 'screening', dateLabel: '03 Nov', actor: 'Elena Lin', note: 'Direct institutional co-investment invitation.' },
        { stage: 'underwriting', dateLabel: '11 Nov', actor: 'Elena Lin', note: 'Testing debt service coverage under 50% LTV.' },
      ],
    },
    // 8. Canary Quay Point (London Office)
    {
      id: 'canary-wharf-quay-point',
      slug: 'canary-wharf-quay-point',
      code: 'UK-OFF-03',
      name: 'Canary Quay Point',
      market: 'London',
      district: 'Canary Wharf, London E14',
      currency: 'GBP',
      assetClass: 'office',
      stage: 'screening',
      owner: 'Oliver Grant (Senior Associate)',
      askingPrice: 95_000_000,
      floorAreaSqFt: 165_000,
      occupancyPct: 86.4,
      currentAnnualNoi: 5_510_000,
      waultYears: 3.9,
      yearBuilt: 2016,
      sustainabilityRating: 'EPC B (Target EPC A Retrofit)',
      summary:
        'Value-add Docklands office building positioned along Elizabeth Line access corridor with CapEx upside from decarbonization refurbishment.',
      nextAction: 'Scope EPC-A HVAC retrofit budget before entering Underwriting',
      mapCoord: { xPct: 68, yPct: 56 },
      gallery: [
        { url: fintechShowcaseImg, caption: 'Canary Wharf dockside financial tower view' },
        { url: londonOfficeImg, caption: 'Commercial street lobby' },
      ],
      rentRoll: [
        {
          unitId: 'Floors 3-9',
          tenantName: 'Northstar Clearing Services',
          sector: 'FinTech Clearing',
          areaSqFt: 142_560,
          annualRent: 7_060_000,
          leaseExpiryYear: 2028,
          status: 'leased',
        },
        {
          unitId: 'Floor 2',
          tenantName: 'Vacant Refurbishment Floor',
          sector: 'Available Space',
          areaSqFt: 22_440,
          annualRent: 0,
          leaseExpiryYear: 2027,
          status: 'vacant',
        },
      ],
      expirySchedule: [
        { year: 2027, pctOfRent: 13.6, sqFtExpiring: 22_440 },
        { year: 2028, pctOfRent: 86.4, sqFtExpiring: 142_560 },
      ],
      monthlyNoiHistory: makeMonthlySeries(5_510_000),
      scenarios: buildScenarioPair({
        purchasePrice: 95_000_000,
        currentAnnualNoi: 5_510_000,
        occupancyPct: 86.4,
        baseExitCap: 5.75,
        baseRentGrowth: 2.9,
        opexPct: 22,
        annualCapex: 290_000,
        year1Capex: 3_400_000,
        ltvPct: 50,
        ratePct: 5.1,
      }),
      comments: [],
      stageHistory: [
        { stage: 'screening', dateLabel: '09 Nov', actor: 'Oliver Grant', note: 'Screening value-add Docklands basis discount.' },
      ],
    },
    // 9. Operating Holding #3 — Changi Airfreight Annex (Singapore Logistics)
    {
      id: 'changi-airfreight-annex',
      slug: 'changi-airfreight-annex',
      code: 'SG-LOG-04',
      name: 'Changi Airfreight Logistics Annex',
      market: 'Singapore',
      district: 'Changi North Aviation Park',
      currency: 'SGD',
      assetClass: 'logistics',
      stage: 'operating_holding',
      owner: 'Claire Ashworth (Asset Manager)',
      askingPrice: 68_000_000,
      floorAreaSqFt: 225_000,
      occupancyPct: 97.2,
      currentAnnualNoi: 4_420_000,
      waultYears: 6.4,
      yearBuilt: 2021,
      sustainabilityRating: 'BCA Green Mark Platinum',
      summary:
        'Precision air-cargo sorting and semiconductor express logistics warehouse bordering Changi Airport Free Trade Zone.',
      nextAction: 'Monitor semi-annual chiller preventive maintenance log',
      mapCoord: { xPct: 88, yPct: 36 },
      gallery: [
        { url: meridianLogisticsImg, caption: 'Changi North airfreight staging plaza' },
        { url: londonLogisticsImg, caption: 'Cross-dock loading apron' },
      ],
      rentRoll: [
        {
          unitId: 'Hangar Bay 1-4',
          tenantName: 'AsiaSilicon Express Cargo',
          sector: 'Semiconductor Airfreight',
          areaSqFt: 218_700,
          annualRent: 5_390_000,
          leaseExpiryYear: 2032,
          status: 'leased',
        },
        {
          unitId: 'Annex 4B',
          tenantName: 'Vacant Locker Suite',
          sector: 'Available Unit',
          areaSqFt: 6_300,
          annualRent: 0,
          leaseExpiryYear: 2027,
          status: 'vacant',
        },
      ],
      expirySchedule: [
        { year: 2027, pctOfRent: 2.8, sqFtExpiring: 6_300 },
        { year: 2032, pctOfRent: 97.2, sqFtExpiring: 218_700 },
      ],
      monthlyNoiHistory: makeMonthlySeries(4_420_000),
      scenarios: buildScenarioPair({
        purchasePrice: 68_000_000,
        currentAnnualNoi: 4_420_000,
        occupancyPct: 97.2,
        baseExitCap: 5.9,
        baseRentGrowth: 3.0,
        opexPct: 18,
        annualCapex: 165_000,
        year1Capex: 180_000,
        ltvPct: 45,
        ratePct: 4.25,
      }),
      comments: [],
      stageHistory: [
        { stage: 'operating_holding', dateLabel: 'Q4 2024', actor: 'IC Charter', note: 'Stabilized Changi core logistics sleeve.' },
      ],
    },
    // 10. Operating Holding #4 — Covent Garden Heritage Arcades (London Mixed-Use)
    {
      id: 'covent-garden-arcades',
      slug: 'covent-garden-arcades',
      code: 'UK-MIX-04',
      name: 'Covent Garden Heritage Arcades',
      market: 'London',
      district: 'West End WC2, London',
      currency: 'GBP',
      assetClass: 'mixed_use',
      stage: 'operating_holding',
      owner: 'Claire Ashworth (Asset Manager)',
      askingPrice: 126_000_000,
      floorAreaSqFt: 112_000,
      occupancyPct: 94.6,
      currentAnnualNoi: 6_300_000,
      waultYears: 5.2,
      yearBuilt: 2019,
      sustainabilityRating: 'BREEAM Excellent',
      summary:
        'Cornerstone West End mixed-use island block pairing luxury ground-floor retail flagship stores with sunlit boutique workspace above.',
      nextAction: 'Issue Q4 tenant sales turnover audit summary',
      mapCoord: { xPct: 34, yPct: 46 },
      gallery: [
        { url: londonMixedUseImg, caption: 'West End stone retail arcade & upper office levels' },
        { url: londonOfficeImg, caption: 'Corner stone facade' },
      ],
      rentRoll: [
        {
          unitId: 'Ground Flagships',
          tenantName: 'Atelier & Heritage Retail Group',
          sector: 'Flagship Retail',
          areaSqFt: 54_000,
          annualRent: 4_250_000,
          leaseExpiryYear: 2031,
          status: 'leased',
        },
        {
          unitId: 'Upper Studios',
          tenantName: 'Mayfair Media Ventures',
          sector: 'Boutique Workspace',
          areaSqFt: 51_950,
          annualRent: 3_625_000,
          leaseExpiryYear: 2028,
          status: 'leased',
        },
        {
          unitId: 'Studio 4C',
          tenantName: 'Vacant Courtyard Suite',
          sector: 'Available Suite',
          areaSqFt: 6_050,
          annualRent: 0,
          leaseExpiryYear: 2027,
          status: 'vacant',
        },
      ],
      expirySchedule: [
        { year: 2027, pctOfRent: 5.4, sqFtExpiring: 6_050 },
        { year: 2028, pctOfRent: 45.9, sqFtExpiring: 51_950 },
        { year: 2031, pctOfRent: 48.7, sqFtExpiring: 54_000 },
      ],
      monthlyNoiHistory: makeMonthlySeries(6_300_000),
      scenarios: buildScenarioPair({
        purchasePrice: 126_000_000,
        currentAnnualNoi: 6_300_000,
        occupancyPct: 94.6,
        baseExitCap: 4.85,
        baseRentGrowth: 3.1,
        opexPct: 20,
        annualCapex: 245_000,
        year1Capex: 300_000,
        ltvPct: 40,
        ratePct: 4.65,
      }),
      comments: [],
      stageHistory: [
        { stage: 'operating_holding', dateLabel: 'Q3 2024', actor: 'IC Charter', note: 'Held in Core West End vehicle.' },
      ],
    },
    // 11. Approved Deal (Kept SEPARATE from Operating Portfolio until explicit Simulated Close!)
    {
      id: 'one-north-commons',
      slug: 'one-north-commons',
      code: 'SG-MIX-05',
      name: 'One-North Biopolis Commons',
      market: 'Singapore',
      district: 'Queenstown / One-North, Singapore',
      currency: 'SGD',
      assetClass: 'mixed_use',
      stage: 'approved',
      owner: 'Elena Lin (VP Acquisitions)',
      askingPrice: 104_000_000,
      floorAreaSqFt: 176_000,
      occupancyPct: 91.0,
      currentAnnualNoi: 5_512_000,
      waultYears: 4.7,
      yearBuilt: 2023,
      sustainabilityRating: 'BCA Green Mark Platinum',
      summary:
        'Approved life-science lab workspace and retail commons approved by Investment Committee—awaiting explicit simulated closing before portfolio transfer.',
      nextAction: 'Execute Simulated Close in Pipeline / Portfolio to transfer into Operating Holdings',
      mapCoord: { xPct: 50, yPct: 48 },
      gallery: [
        { url: singaporeTowerImg, caption: 'One-North glass commons & green terrace' },
        { url: skylineTowersImg, caption: 'R&D precinct horizon' },
      ],
      rentRoll: [
        {
          unitId: 'Lab Wings A-C',
          tenantName: 'BioGenix Asia Labs',
          sector: 'Life Sciences',
          areaSqFt: 160_160,
          annualRent: 6_890_000,
          leaseExpiryYear: 2030,
          status: 'leased',
        },
        {
          unitId: 'Retail Unit R2',
          tenantName: 'Vacant Ground Cafe',
          sector: 'Available Suite',
          areaSqFt: 15_840,
          annualRent: 0,
          leaseExpiryYear: 2027,
          status: 'vacant',
        },
      ],
      expirySchedule: [
        { year: 2027, pctOfRent: 9.0, sqFtExpiring: 15_840 },
        { year: 2030, pctOfRent: 91.0, sqFtExpiring: 160_160 },
      ],
      monthlyNoiHistory: makeMonthlySeries(5_512_000),
      scenarios: buildScenarioPair({
        purchasePrice: 104_000_000,
        currentAnnualNoi: 5_512_000,
        occupancyPct: 91.0,
        baseExitCap: 5.05,
        baseRentGrowth: 3.2,
        opexPct: 20,
        annualCapex: 210_000,
        year1Capex: 450_000,
        ltvPct: 50,
        ratePct: 4.3,
      }),
      comments: [],
      stageHistory: [
        { stage: 'committee', dateLabel: '01 Nov', actor: 'Elena Lin', note: 'Submitted underwriting package.' },
        { stage: 'approved', dateLabel: '08 Nov', actor: 'Richard Vance (IC)', note: 'Approved subject to closing checklist.' },
      ],
    },
    // 12. Rejected Deal (London Logistics NW10 — realistic discipline example)
    {
      id: 'park-royal-freight-cross',
      slug: 'park-royal-freight-cross',
      code: 'UK-LOG-05',
      name: 'Park Royal Freight Cross',
      market: 'London',
      district: 'West London Industrial Park, NW10',
      currency: 'GBP',
      assetClass: 'logistics',
      stage: 'rejected',
      owner: 'Oliver Grant (Senior Associate)',
      askingPrice: 62_000_000,
      floorAreaSqFt: 198_000,
      occupancyPct: 88.5,
      currentAnnualNoi: 3_844_000,
      waultYears: 2.8,
      yearBuilt: 2012,
      sustainabilityRating: 'EPC C',
      summary:
        'Older West London cross-dock facility declined by Committee due to short WAULT and excessive roof replacement capex.',
      nextAction: 'Archived — revisit only if vendor revises asking price below £54M',
      mapCoord: { xPct: 20, yPct: 38 },
      gallery: [
        { url: londonLogisticsImg, caption: 'Park Royal West London distribution bay' },
      ],
      rentRoll: [
        {
          unitId: 'Main Cross-Dock',
          tenantName: 'Metro Wholesale Freight',
          sector: 'Regional Distribution',
          areaSqFt: 175_230,
          annualRent: 4_688_000,
          leaseExpiryYear: 2028,
          status: 'leased',
        },
        {
          unitId: 'Yard Office',
          tenantName: 'Vacant Unit',
          sector: 'Vacant',
          areaSqFt: 22_770,
          annualRent: 0,
          leaseExpiryYear: 2027,
          status: 'vacant',
        },
      ],
      expirySchedule: [
        { year: 2027, pctOfRent: 11.5, sqFtExpiring: 22_770 },
        { year: 2028, pctOfRent: 88.5, sqFtExpiring: 175_230 },
      ],
      monthlyNoiHistory: makeMonthlySeries(3_844_000),
      scenarios: buildScenarioPair({
        purchasePrice: 62_000_000,
        currentAnnualNoi: 3_844_000,
        occupancyPct: 88.5,
        baseExitCap: 6.3,
        baseRentGrowth: 2.0,
        opexPct: 18,
        annualCapex: 290_000,
        year1Capex: 2_800_000,
        ltvPct: 45,
        ratePct: 5.2,
      }),
      comments: [],
      stageHistory: [
        { stage: 'committee', dateLabel: '22 Oct', actor: 'Oliver Grant', note: 'Flagged high Day-1 structural roof capex.' },
        { stage: 'rejected', dateLabel: '29 Oct', actor: 'Richard Vance (IC)', note: 'Declined at asking price; price discipline maintained.' },
      ],
    },
  ];

  const documents: DataRoomDoc[] = [
    {
      id: 'DOC-MLP-01',
      assetId: 'meridian-logistics-park',
      category: 'rent_roll',
      title: 'Meridian Logistics Park — Certified Rent Roll & Escalations',
      updatedAt: 'Nov 2026',
      fileType: 'XLSX / CSV',
      sizeLabel: '284 KB',
      previewSummary: '4 active port/cold-chain leases totaling 456,870 sq ft (94.2% occupied) + Bay D2 vacant unit.',
      sampleContent:
        'Unit,Tenant,Sector,Area_SqFt,Annual_Rent_SGD,Expiry_Year,Status\nBay A1-A2,Pacific Cold-Chain Pte Ltd,Cold Logistics,168000,4120000,2031,Leased\nBay B1-B2,Asean Freight Automated,3PL,142000,3340000,2029,Leased\nBay C1,SinoMed Pharma Logistics,Pharma Cold,88000,2210000,2032,Leased\nBay D1,Tuas Robotics Fulfillment,Automation,58870,1520000,2028,Leased\nBay D2,Available Expansion Bay,Vacant,28130,0,2027,Vacant',
    },
    {
      id: 'DOC-MLP-02',
      assetId: 'meridian-logistics-park',
      category: 'operating_statement',
      title: 'FY2026 Trailing-12 Operating Statement (SGD)',
      updatedAt: 'Nov 2026',
      fileType: 'PDF',
      sizeLabel: '1.4 MB',
      previewSummary: 'T12 Gross Effective Income S$11.19M, Property OpEx S$2.01M (18%), Current NOI S$9.176M.',
      sampleContent:
        'PRIMUS CAPITAL CONCEPT DATA ROOM — SAMPLE OPERATING STATEMENT\nProperty: Meridian Logistics Park, Singapore (SG-LOG-01)\nGross Potential Rent (100%): S$11,880,000\nVacancy Loss (5.8%): -S$689,000\nEffective Gross Income: S$11,191,000\nOperating Expenses (18%): -S$2,015,000\nCurrent Net Operating Income (NOI): S$9,176,000',
    },
    {
      id: 'DOC-MLP-03',
      assetId: 'meridian-logistics-park',
      category: 'title_summary',
      title: 'JTC Land Lease & Tuas Maritime Zoning Abstract',
      updatedAt: 'Oct 2026',
      fileType: 'PDF',
      sizeLabel: '920 KB',
      previewSummary: 'Remaining industrial lease tenure 29.5 years with standard B2 logistics & cold-chain zoning.',
      sampleContent:
        'TITLE SUMMARY (SAMPLE CONCEPT ABSTRACT)\nLot: Tuas South Link MK7-4412N\nZoning: Business-2 Heavy Logistics / Cold Storage\nUnexpired Lease Term: 29 Years 6 Months\nEncumbrances: Clean subject to closing senior debt release.',
    },
    {
      id: 'DOC-MLP-04',
      assetId: 'meridian-logistics-park',
      category: 'valuation_report',
      title: 'Independent Desktop Valuation & Cap Rate Benchmark',
      updatedAt: 'Nov 2026',
      fileType: 'PDF',
      sizeLabel: '2.1 MB',
      previewSummary: 'Indicative cap rate range 5.75%–6.25% across prime Tuas & Jurong Grade-A logistics.',
      sampleContent:
        'INDICATIVE VALUATION MEMO (SAMPLE)\nSubject: Meridian Logistics Park, Singapore\nAsking Price: S$148,000,000 (S$305 psf)\nImplied Entry Cap Rate: 6.20%\nComparable Tuas Ramp-Up Cap Rates: 5.75% - 6.25%.',
    },
    {
      id: 'DOC-SBF-01',
      assetId: 'southbank-foundry-plaza',
      category: 'committee_doc',
      title: 'Southbank Foundry Plaza — Committee Memo Pack (Rev-1)',
      updatedAt: 'Nov 2026',
      fileType: 'PDF',
      sizeLabel: '1.8 MB',
      previewSummary: 'Prepared IC package for £88M acquisition with 50% LTV senior debt.',
      sampleContent:
        'INVESTMENT COMMITTEE BRIEF (SAMPLE)\nAsset: Southbank Foundry Plaza, London\nAsking Price: £88,000,000 | Current NOI: £4,928,000 (5.60% Entry Cap).',
    },
    {
      id: 'DOC-TGH-01',
      assetId: 'thames-gateway-hub',
      category: 'rent_roll',
      title: 'Thames Gateway Hub — East London Rent Roll (GBP)',
      updatedAt: 'Nov 2026',
      fileType: 'XLSX / CSV',
      sizeLabel: '215 KB',
      previewSummary: 'Albion Parcel Express & Thames Fresh Direct covering 283,650 sq ft (91.5% occupancy).',
      sampleContent:
        'Unit,Tenant,Area_SqFt,Annual_Rent_GBP,Expiry_Year\nUnit 01-04,Albion Parcel Express Ltd,185000,3120000,2030\nUnit 05-06,Thames Fresh Direct,98650,2600000,2028\nUnit 07,Available Bay,26350,0,2027',
    },
    {
      id: 'DOC-BSH-01',
      assetId: 'bishopsgate-limestone-house',
      category: 'operating_statement',
      title: '28 Bishopsgate — Q3 Operating Holding Ledger (GBP)',
      updatedAt: 'Oct 2026',
      fileType: 'PDF',
      sizeLabel: '880 KB',
      previewSummary: 'Operating holding delivering £6.048M annualized NOI at 96.5% occupancy.',
      sampleContent:
        'OPERATING HOLDING REPORT (SAMPLE)\nAsset: 28 Bishopsgate Limestone House, London\nOccupancy: 96.5% | WAULT: 6.8 Years | Annualized NOI: £6,048,000.',
    },
    {
      id: 'DOC-RQ-01',
      assetId: 'raffles-quay-exchange',
      category: 'operating_statement',
      title: 'Raffles Quay Exchange — Q3 Asset Performance Report (SGD)',
      updatedAt: 'Oct 2026',
      fileType: 'PDF',
      sizeLabel: '1.1 MB',
      previewSummary: 'Mixed-use Singapore flagship achieving S$10.535M NOI with 95.0% occupancy.',
      sampleContent:
        'OPERATING HOLDING REPORT (SAMPLE)\nAsset: Raffles Quay Exchange Tower, Singapore\nOccupancy: 95.0% | Annualized NOI: S$10,535,000.',
    },
  ];

  // Crucial Guided Demo setup: Meridian Logistics Park has 3 completed required tasks + 1 FINAL open required task!
  const diligenceTasks: DiligenceTask[] = [
    {
      id: 'TSK-MLP-1',
      assetId: 'meridian-logistics-park',
      category: 'Financial & Tax',
      title: 'Verify Pacific Cold-Chain & Asean Freight certified rent roll',
      owner: 'Elena Lin',
      dueDate: 'Nov 10',
      required: true,
      status: 'completed',
    },
    {
      id: 'TSK-MLP-2',
      assetId: 'meridian-logistics-park',
      category: 'Legal & Title',
      title: 'Confirm JTC 29.5-year industrial land lease & zoning compliance',
      owner: 'David Tan (Legal)',
      dueDate: 'Nov 12',
      required: true,
      status: 'completed',
    },
    {
      id: 'TSK-MLP-3',
      assetId: 'meridian-logistics-park',
      category: 'Environmental',
      title: 'Phase I environmental & solar roof structural load audit',
      owner: 'M. Singh (Tech)',
      dueDate: 'Nov 14',
      required: true,
      status: 'completed',
    },
    {
      id: 'TSK-MLP-4',
      assetId: 'meridian-logistics-park',
      category: 'Technical',
      title: 'Confirm Tuas Dock Structural & Fire Sprinkler Sign-Off (Final Required)',
      owner: 'M. Singh (Tech)',
      dueDate: 'Nov 17',
      required: true,
      status: 'pending', // Blocking Committee submission until toggled complete!
    },
    {
      id: 'TSK-MLP-5',
      assetId: 'meridian-logistics-park',
      category: 'Technical',
      title: 'Optional: Review Bay D2 EV yard charger conduit pricing',
      owner: 'Elena Lin',
      dueDate: 'Nov 24',
      required: false,
      status: 'in_progress',
    },
    {
      id: 'TSK-SBF-1',
      assetId: 'southbank-foundry-plaza',
      category: 'Legal & Title',
      title: 'Freehold title & Southwark planning pack cleared',
      owner: 'Oliver Grant',
      dueDate: 'Nov 08',
      required: true,
      status: 'completed',
    },
    {
      id: 'TSK-SBF-2',
      assetId: 'southbank-foundry-plaza',
      category: 'Financial & Tax',
      title: 'Thames Design Collective covenant & service-charge audit',
      owner: 'Oliver Grant',
      dueDate: 'Nov 10',
      required: true,
      status: 'completed',
    },
    {
      id: 'TSK-TGH-1',
      assetId: 'thames-gateway-hub',
      category: 'Technical',
      title: 'Complete UK Power Networks EV capacity confirmation',
      owner: 'Oliver Grant',
      dueDate: 'Nov 22',
      required: true,
      status: 'pending',
    },
  ];

  // Seed 1 pending Committee submission on Southbank Foundry Plaza so Reviewers have an active item right away
  const southbankAsset = assets.find((a) => a.id === 'southbank-foundry-plaza')!;
  const southbankBase = southbankAsset.scenarios.base;
  const submissions: CommitteeSubmission[] = [
    {
      id: 'SUB-101',
      revisionNumber: 1,
      assetId: 'southbank-foundry-plaza',
      submittedAtLabel: 'Nov 12 · 04:15 PM',
      submittedBy: 'Oliver Grant (Senior Associate)',
      submissionNote:
        'Submitting Southbank Foundry Plaza (£88.0M, 50% LTV) following clean freehold title & Level 6 lease-up review.',
      frozenScenarioId: 'base',
      frozenAssumptions: { ...southbankBase },
      frozenResult: {
        valid: true,
        entryCapRatePct: 5.6,
        acquisitionFee: 1_100_000,
        loanAmount: 44_000_000,
        initialEquityInvested: 45_100_000,
        forwardExitNoi: 5_975_000,
        grossExitValuation: 111_682_243,
        exitSellingCosts: 1_675_234,
        endingDebtAtExit: 39_125_000,
        netExitEquityProceeds: 70_882_009,
        leveredIrrPct: 11.42,
        irrStatus: 'valid',
        unleveredIrrPct: 8.15,
        equityMultiple: 1.69,
        minDscr: 1.56,
        year1Dscr: 1.56,
        year1DebtYieldPct: 11.2,
        rows: [],
      },
      diligenceSummary: '2 of 2 required diligence tasks completed',
      status: 'pending_review',
    },
  ];

  const investors: SampleInvestorProfile[] = [
    {
      id: 'LP-01',
      name: 'Northbridge Sovereign Endowment',
      mandateType: 'Core-Plus Real Assets LP',
      city: 'London',
      reportingCurrency: 'USD',
      commitmentUsd: 120_000_000,
      contributedUsd: 86_400_000,
      distributionsUsd: 14_820_000,
      holdings: [
        {
          assetId: 'bishopsgate-limestone-house',
          ownershipPct: 24.0,
          costBasisUsd: 33_100_000,
          currentValueUsd: 34_406_400, // 24% * £112M * 1.28 USD/GBP
          ytdDistributionUsd: 1_858_000,
        },
        {
          assetId: 'raffles-quay-exchange',
          ownershipPct: 20.0,
          costBasisUsd: 31_400_000,
          currentValueUsd: 32_250_000, // 20% * S$215M * 0.75 USD/SGD
          ytdDistributionUsd: 1_580_000,
        },
        {
          assetId: 'changi-airfreight-annex',
          ownershipPct: 30.0,
          costBasisUsd: 14_600_000,
          currentValueUsd: 15_300_000, // 30% * S$68M * 0.75 USD/SGD
          ytdDistributionUsd: 994_000,
        },
      ],
      quarterlyReports: [
        {
          id: 'RPT-NB-Q3',
          quarter: 'Q3 2026',
          title: 'Northbridge LP — Core-Plus London & Singapore Capital Account Statement',
          publishedDate: 'Oct 18, 2026',
          navUsd: 81_956_400,
          distributionYieldPct: 5.4,
          summary:
            'Portfolio holdings maintained 96.1% weighted occupancy across London and Singapore with steady industrial logistics rental growth.',
        },
        {
          id: 'RPT-NB-Q2',
          quarter: 'Q2 2026',
          title: 'Northbridge LP — Semi-Annual Asset Valuation & Lease Expiry Review',
          publishedDate: 'Jul 20, 2026',
          navUsd: 80_210_000,
          distributionYieldPct: 5.2,
          summary:
            'Completed rent escalation at Changi Airfreight Annex and Bishopsgate fourth-floor renewal planning.',
        },
      ],
      documentIds: ['DOC-BSH-01', 'DOC-RQ-01'],
    },
    {
      id: 'LP-02',
      name: 'Merlion Civic Pension Trust',
      mandateType: 'Asia-Pacific & UK Real Estate LP',
      city: 'Singapore',
      reportingCurrency: 'USD',
      commitmentUsd: 95_000_000,
      contributedUsd: 68_200_000,
      distributionsUsd: 10_450_000,
      holdings: [
        {
          assetId: 'raffles-quay-exchange',
          ownershipPct: 28.0,
          costBasisUsd: 43_800_000,
          currentValueUsd: 45_150_000,
          ytdDistributionUsd: 2_212_000,
        },
        {
          assetId: 'covent-garden-arcades',
          ownershipPct: 16.0,
          costBasisUsd: 24_900_000,
          currentValueUsd: 25_804_800,
          ytdDistributionUsd: 1_290_000,
        },
      ],
      quarterlyReports: [
        {
          id: 'RPT-MC-Q3',
          quarter: 'Q3 2026',
          title: 'Merlion Trust — Q3 2026 Holdings & Distribution Notice',
          publishedDate: 'Oct 18, 2026',
          navUsd: 70_954_800,
          distributionYieldPct: 5.1,
          summary:
            'West End flagship retail and Raffles Place CBD assets delivered full quarterly coupon distributions.',
        },
      ],
      documentIds: ['DOC-RQ-01'],
    },
  ];

  const activityLog: PrimusActivityEvent[] = [
    {
      id: 'ACT-PR-1',
      timestampLabel: 'Today · 09:30 AM',
      actor: 'Elena Lin',
      role: 'acquisitions_analyst',
      assetId: 'meridian-logistics-park',
      title: 'Updated Downside underwriting stress test on Meridian Logistics Park',
      detail: 'Modeled Bay D2 vacancy extension (-10.2% occupancy) and +90 bps exit cap expansion.',
    },
    {
      id: 'ACT-PR-2',
      timestampLabel: 'Yesterday · 04:15 PM',
      actor: 'Oliver Grant',
      role: 'acquisitions_analyst',
      assetId: 'southbank-foundry-plaza',
      title: 'Submitted Southbank Foundry Plaza (Rev-1) to Committee',
      detail: 'Frozen Base Case scenario awaiting Investment Committee Reviewer decision.',
    },
    {
      id: 'ACT-PR-3',
      timestampLabel: 'Nov 08 · 11:20 AM',
      actor: 'Richard Vance',
      role: 'committee_reviewer',
      assetId: 'one-north-commons',
      title: 'Approved One-North Biopolis Commons',
      detail: 'Approved for acquisition; kept separate from Operating Holdings pending closing.',
    },
  ];

  return {
    version: 1,
    assets,
    documents,
    diligenceTasks,
    submissions,
    investors,
    activityLog,
  };
}
