export type ConditionGrade = "Excellent" | "Good" | "Fair";

export type PhoneVariant = {
  id: string;
  phone_id: string;
  storage: string;
  color: string;
  condition_grade: ConditionGrade;
  price: number;
  discount_price: number | null;
  quantity: number;
  images: string[];
  battery_health: number | null;
  in_stock: boolean;
};

export const CONDITION_GRADES: ConditionGrade[] = ["Fair", "Good", "Excellent"];

export const CONDITION_TAGS: Record<ConditionGrade, string[]> = {
  Fair: ["Visible signs of use", "Verified parts", "Battery for daily use"],
  Good: ["Light signs of use", "Verified parts", "Battery for daily use"],
  Excellent: ["Almost no signs of use", "Verified parts", "Battery for daily use"],
};

export const CONDITION_DESCRIPTIONS: Record<ConditionGrade, string> = {
  Excellent: "Ekdum perfect. Koi scratches nahi. Bilkul naye jaisa.",
  Good: "Halki scratches hain jo normal use se aati hain. Fully functional.",
  Fair: "Visible scratches/marks hain. 100% working. Best value option.",
};

export function getVariantPrice(v: PhoneVariant): number {
  return v.discount_price ?? v.price;
}

export function isVariantAvailable(v: PhoneVariant): boolean {
  return v.in_stock && v.quantity > 0;
}

export function groupVariantsByPhone(variants: PhoneVariant[]): Map<string, PhoneVariant[]> {
  const map = new Map<string, PhoneVariant[]>();
  for (const v of variants) {
    const list = map.get(v.phone_id) ?? [];
    list.push(v);
    map.set(v.phone_id, list);
  }
  return map;
}

export function getLowestVariantPrice(variants: PhoneVariant[]): number | null {
  const available = variants.filter(isVariantAvailable);
  const pool = available.length > 0 ? available : variants;
  if (pool.length === 0) return null;
  return Math.min(...pool.map(getVariantPrice));
}

export function getUniqueStorages(variants: PhoneVariant[]): string[] {
  return [...new Set(variants.map((v) => v.storage))];
}

export function getUniqueColors(variants: PhoneVariant[], storage: string): string[] {
  return [...new Set(variants.filter((v) => v.storage === storage).map((v) => v.color))];
}

export function findVariant(
  variants: PhoneVariant[],
  storage: string,
  color: string,
  grade: ConditionGrade
): PhoneVariant | undefined {
  return variants.find(
    (v) => v.storage === storage && v.color === color && v.condition_grade === grade
  );
}

export function hasAnyStock(variants: PhoneVariant[]): boolean {
  return variants.some(isVariantAvailable);
}

export function getFreeAccessoryText(condition: string): {
  title: string;
  subtitle: string;
  badge: string;
  emailLine: string;
} {
  const isPreOwned = condition === "Pre-Owned" || condition === "Used";
  if (isPreOwned) {
    return {
      title: "Free Case + Screen Protector Included",
      subtitle:
        "No extra trip to the market. Your phone arrives fully protected and ready to use.",
      badge: "🎁 Free Case + SP",
      emailLine: "case + screen protector",
    };
  }
  return {
    title: "Free Case Included",
    subtitle: "Your phone arrives with a free protective case. Ready to use from day one.",
    badge: "🎁 Free Case",
    emailLine: "case",
  };
}

/** Build a synthetic variant from legacy phone row when no phone_variants exist */
export function legacyPhoneToVariant(phone: {
  id: string;
  storage: string;
  color: string;
  price: number;
  discount_price: number | null;
  battery_health: number | null;
  images: string[];
  in_stock: boolean;
  physical_condition?: string | null;
}): PhoneVariant {
  let grade: ConditionGrade = "Good";
  const pc = phone.physical_condition ?? "";
  if (pc.includes("10/10") || pc.toLowerCase().includes("excellent")) grade = "Excellent";
  else if (pc.includes("8") || pc.includes("7") || pc.toLowerCase().includes("fair")) grade = "Fair";

  return {
    id: phone.id,
    phone_id: phone.id,
    storage: phone.storage,
    color: phone.color,
    condition_grade: grade,
    price: phone.price,
    discount_price: phone.discount_price,
    quantity: phone.in_stock ? 1 : 0,
    images: phone.images ?? [],
    battery_health: phone.battery_health,
    in_stock: phone.in_stock,
  };
}
