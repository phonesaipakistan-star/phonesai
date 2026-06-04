/** Radial gradient frame for product images — object-contain only, never cover */
export const PRODUCT_IMAGE_FRAME =
  "relative overflow-hidden bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.07)_0%,rgba(255,255,255,0.02)_45%,rgba(0,0,0,0.85)_100%)]";

/** @deprecated Use PRODUCT_IMAGE_FRAME */
export const PHONE_IMAGE_FRAME = PRODUCT_IMAGE_FRAME;

/** Cards, shop grid, related items — max 8px padding, slight scale to fill frame */
export const PRODUCT_IMAGE_CLASS = "object-contain p-2 scale-[1.12]";

/** @deprecated Use PRODUCT_IMAGE_CLASS */
export const PHONE_IMAGE_CLASS = PRODUCT_IMAGE_CLASS;

/** Product page hero — max 12px padding */
export const PRODUCT_IMAGE_MAIN_CLASS = "object-contain p-3 scale-[1.08]";

/** Thumbnail strip — minimal padding */
export const PRODUCT_IMAGE_THUMB_CLASS = "object-contain p-0.5 scale-[1.1]";
