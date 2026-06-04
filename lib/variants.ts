export type ConditionGrade = "Premium" | "Excellent" | "Good" | "Fair" | "New";

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
  description?: string | null;
  accessories_included?: string | null;
  sim_type?: string | null;
  sim_status?: string | null;
};

export const PRE_OWNED_GRADES: ConditionGrade[] = ["Premium", "Excellent", "Good", "Fair"];

/** Pre-owned condition grades shown in selectors (excludes New) */
export const CONDITION_GRADES: ConditionGrade[] = PRE_OWNED_GRADES;

export const CONDITION_TAGS: Record<ConditionGrade, string[]> = {
  Premium: ["Zero scratches", "Flawless screen", "Like brand new", "Perfect for gifting"],
  Excellent: ["Almost no signs of use", "Pristine screen", "Verified parts"],
  Good: ["Light signs of use", "Clean screen", "Verified parts", "Battery for daily use"],
  Fair: ["Visible signs of use", "100% functional", "Best value", "Verified parts"],
  New: ["Factory seal intact", "Never opened", "Water Pack"],
};

export const CONDITION_DESCRIPTIONS: Record<ConditionGrade, string> = {
  Premium: "Flawless. Zero scratches on screen or body. Looks brand new. Perfect for gifting.",
  Excellent: "Almost perfect. Extremely minor signs only visible under direct light. Screen pristine.",
  Good: "Light scratches on body, screen clean. Normal signs of careful use. Fully functional.",
  Fair: "Visible scratches and marks. 100% working. Best value option.",
  New: "Water Pack — factory seal intact, never opened, original waterproofing unbroken.",
};

export const CONDITION_VISUAL: Record<
  ConditionGrade,
  { icon: string; accent: string; selectedBorder: string; selectedBg: string; popular?: boolean }
> = {
  Premium: {
    icon: "⭐",
    accent: "text-amber-300 border-amber-400/40 bg-amber-500/10",
    selectedBorder: "border-amber-400/70",
    selectedBg: "bg-amber-500/15",
  },
  Excellent: {
    icon: "✨",
    accent: "text-blue-300 border-blue-400/40 bg-blue-500/10",
    selectedBorder: "border-blue-400/70",
    selectedBg: "bg-blue-500/15",
    popular: true,
  },
  Good: {
    icon: "👍",
    accent: "text-green-300 border-green-400/40 bg-green-500/10",
    selectedBorder: "border-green-400/70",
    selectedBg: "bg-green-500/15",
  },
  Fair: {
    icon: "💰",
    accent: "text-orange-300 border-orange-400/40 bg-orange-500/10",
    selectedBorder: "border-orange-400/70",
    selectedBg: "bg-orange-500/15",
  },
  New: {
    icon: "📦",
    accent: "text-green-300 border-green-400/40 bg-green-500/10",
    selectedBorder: "border-green-400/70",
    selectedBg: "bg-green-500/15",
  },
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

/**
 * Price shown on storage/color pills for the current selection context.
 * Exact match (storage + color + grade) first; otherwise lowest in the scoped pool.
 */
export function getVariantPillPrice(
  variants: PhoneVariant[],
  phoneCondition: string,
  opts: { storage: string; color?: string; grade?: ConditionGrade | null }
): number | null {
  const { storage, color } = opts;
  const grade: ConditionGrade | null = isNewPhone(phoneCondition) ? "New" : opts.grade ?? null;

  if (color && grade) {
    const exact = findVariant(variants, storage, color, grade);
    if (exact) return getVariantPrice(exact);
  }

  let pool = variants.filter((v) => v.storage === storage);
  if (color) pool = pool.filter((v) => v.color === color);

  if (pool.length === 0) return null;

  const available = pool.filter(isVariantAvailable);
  const usePool = available.length > 0 ? available : pool;
  return Math.min(...usePool.map(getVariantPrice));
}

function variantsForStorageColor(
  variants: PhoneVariant[],
  storage: string,
  color: string
): PhoneVariant[] {
  return variants.filter((v) => v.storage === storage && v.color === color);
}

/** Resolve best variant for storage + color + optional grade (handles missing combos) */
export function resolveVariantSelection(
  variants: PhoneVariant[],
  phoneCondition: string,
  storage: string,
  color: string,
  preferredGrade: ConditionGrade | null
): {
  variant: PhoneVariant | null;
  storage: string;
  color: string;
  grade: ConditionGrade | null;
} {
  const pool = variantsForStorageColor(variants, storage, color);
  if (pool.length === 0) {
    return { variant: null, storage, color, grade: preferredGrade };
  }

  if (isNewPhone(phoneCondition)) {
    const available = pool.find(isVariantAvailable);
    const variant = available ?? pool[0];
    return { variant, storage, color, grade: "New" };
  }

  if (preferredGrade) {
    const exact = pool.find((v) => v.condition_grade === preferredGrade);
    if (exact) {
      return { variant: exact, storage, color, grade: preferredGrade };
    }
  }

  const gradeOrder = preferredGrade
    ? [preferredGrade, ...PRE_OWNED_GRADES.filter((g) => g !== preferredGrade)]
    : PRE_OWNED_GRADES;

  for (const grade of gradeOrder) {
    const match = pool.find((v) => v.condition_grade === grade && isVariantAvailable(v));
    if (match) return { variant: match, storage, color, grade };
  }

  for (const grade of gradeOrder) {
    const match = pool.find((v) => v.condition_grade === grade);
    if (match) return { variant: match, storage, color, grade };
  }

  const fallback = pool[0];
  return { variant: fallback, storage, color, grade: fallback.condition_grade };
}

export function hasAnyStock(variants: PhoneVariant[]): boolean {
  return variants.some(isVariantAvailable);
}

export function isNewPhone(condition: string): boolean {
  return condition === "New";
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
  condition?: string;
  description?: string | null;
  accessories_included?: string | null;
  sim_type?: string | null;
  sim_status?: string | null;
}): PhoneVariant {
  let grade: ConditionGrade = "Good";
  if (phone.condition === "New") {
    grade = "New";
  } else {
    const pc = phone.physical_condition ?? "";
    if (pc.toLowerCase().includes("premium")) grade = "Premium";
    else if (pc.includes("10/10") || pc.toLowerCase().includes("excellent")) grade = "Excellent";
    else if (pc.includes("8") || pc.includes("7") || pc.toLowerCase().includes("fair")) grade = "Fair";
  }

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
    description: phone.description ?? null,
    accessories_included: phone.accessories_included ?? null,
    sim_type: phone.sim_type ?? null,
    sim_status: phone.sim_status ?? null,
  };
}
