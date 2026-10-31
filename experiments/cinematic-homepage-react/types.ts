// ChronoBid Vault — Multi-Category React Experiment Data Contracts
// Defines domain models for six curatorial disciplines across the marketplace.

export type CuratorialDepartmentId =
  | 'art'
  | 'coins'
  | 'books'
  | 'horology'
  | 'jewelry'
  | 'antiquities';

export interface SpecimenAttribute {
  label: string;
  value: string;
}

export interface CuratorialSpecimen {
  id: string;
  lotNumber: number;
  departmentId: CuratorialDepartmentId;
  departmentName: string;
  departmentRoman: string;
  title: string;
  subtitle: string;
  dateOrPeriod: string;
  provenanceSummary: string;
  mediumOrMaterial: string;
  dimensions: string;
  currentAskUsd: number;
  estimateLowUsd: number;
  estimateHighUsd: number;
  reserveStatus: 'Reserve Met' | 'Reserve Pending' | 'No Reserve';
  custodyLocation: string;
  conditionGrade: string;
  documentedCitation: string;
  specificAttributes: SpecimenAttribute[];
  inspectionInstruction: string;
  imageUrl?: string;
  secondaryImageUrl?: string;
  imageCaption?: string;
  imageProvenance?: string;
}

export interface LiveTelemetryBid {
  id: string;
  lotNumber: number;
  departmentName: string;
  paddleNumber: string;
  location: string;
  amountUsd: number;
  timestamp: string;
  isUserBid?: boolean;
}

/**
 * Deterministic USD currency integer formatter.
 * Avoids Node.js vs Browser locale hydration mismatches (e.g. en-IN 2,10,000 vs en-US 210,000).
 */
export const formatUsdAmount = (val: number): string => {
  return Math.round(val).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};
