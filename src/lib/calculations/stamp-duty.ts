/**
 * Simplified stamp duty calculation functions for charts and comparisons
 */

import { calculateEnglandSDLT } from "./england";
import { calculateScotlandLBTT } from "./scotland";
import { calculateWalesLTT } from "./wales";

// Simple calculation functions that return just the total
export function calculateSDLT(
  price: number,
  isFirstTimeBuyer: boolean = false,
  isAdditional: boolean = false
): number {
  const buyerType = isAdditional ? "additional" : isFirstTimeBuyer ? "first-time" : "standard";
  const result = calculateEnglandSDLT(price, buyerType);
  return result.totalTax;
}

export function calculateLBTT(
  price: number,
  isFirstTimeBuyer: boolean = false,
  isAdditional: boolean = false
): number {
  const buyerType = isAdditional ? "additional" : isFirstTimeBuyer ? "first-time" : "standard";
  const result = calculateScotlandLBTT(price, buyerType);
  return result.totalTax;
}

export function calculateLTT(
  price: number,
  isAdditional: boolean = false
): number {
  // Wales has no first-time buyer relief
  const buyerType = isAdditional ? "additional" : "standard";
  const result = calculateWalesLTT(price, buyerType);
  return result.totalTax;
}

// Breakdown functions that return detailed band information
export interface BreakdownBand {
  label: string;
  amount: number;
  taxDue: number;
  rate: number;
}

export interface CalculationBreakdownResult {
  total: number;
  bands: BreakdownBand[];
  surcharge?: number;
  effectiveRate: number;
}

export function calculateSDLTBreakdown(
  price: number,
  isFirstTimeBuyer: boolean = false,
  isAdditional: boolean = false
): CalculationBreakdownResult {
  const buyerType = isAdditional ? "additional" : isFirstTimeBuyer ? "first-time" : "standard";
  const result = calculateEnglandSDLT(price, buyerType);

  const surchargeAmount = isAdditional && price > 40000 ? price * 0.05 : 0;

  return {
    total: result.totalTax,
    bands: result.breakdown.map((band) => ({
      label: band.bandName,
      amount: band.taxableAmount,
      taxDue: band.taxDue,
      rate: band.rate * 100,
    })),
    surcharge: surchargeAmount,
    effectiveRate: result.effectiveRate,
  };
}

export function calculateLBTTBreakdown(
  price: number,
  isFirstTimeBuyer: boolean = false,
  isAdditional: boolean = false
): CalculationBreakdownResult {
  const buyerType = isAdditional ? "additional" : isFirstTimeBuyer ? "first-time" : "standard";
  const result = calculateScotlandLBTT(price, buyerType);

  // Scotland ADS is 6%
  const surchargeAmount = isAdditional && price > 40000 ? price * 0.06 : 0;

  return {
    total: result.totalTax,
    bands: result.breakdown.map((band) => ({
      label: band.bandName,
      amount: band.taxableAmount,
      taxDue: band.taxDue,
      rate: band.rate * 100,
    })),
    surcharge: surchargeAmount,
    effectiveRate: result.effectiveRate,
  };
}

export function calculateLTTBreakdown(
  price: number,
  isAdditional: boolean = false
): CalculationBreakdownResult {
  const buyerType = isAdditional ? "additional" : "standard";
  const result = calculateWalesLTT(price, buyerType);

  // Wales higher rates surcharge is 4%
  const surchargeAmount = isAdditional && price > 40000 ? price * 0.04 : 0;

  return {
    total: result.totalTax,
    bands: result.breakdown.map((band) => ({
      label: band.bandName,
      amount: band.taxableAmount,
      taxDue: band.taxDue,
      rate: band.rate * 100,
    })),
    surcharge: surchargeAmount,
    effectiveRate: result.effectiveRate,
  };
}

// Comparison helper - calculates all three regions at once
export function compareAllRegions(
  price: number,
  buyerType: "standard" | "ftb" | "additional" = "standard"
) {
  const isFirstTimeBuyer = buyerType === "ftb";
  const isAdditional = buyerType === "additional";

  return {
    england: {
      total: calculateSDLT(price, isFirstTimeBuyer, isAdditional),
      breakdown: calculateSDLTBreakdown(price, isFirstTimeBuyer, isAdditional),
    },
    scotland: {
      total: calculateLBTT(price, isFirstTimeBuyer, isAdditional),
      breakdown: calculateLBTTBreakdown(price, isFirstTimeBuyer, isAdditional),
    },
    wales: {
      // Wales has no FTB relief, so treat FTB as standard
      total: calculateLTT(price, isAdditional),
      breakdown: calculateLTTBreakdown(price, isAdditional),
    },
  };
}
