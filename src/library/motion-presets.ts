// This file guarantees related movements use one shared, predictable spring profile.
/** Selection changes settle quickly; critically damped followers avoid overshooting scroll boundaries. */
export const SELECTION_SPRING = {
  type: "spring",
  stiffness: 320,
  damping: 36,
  mass: 1,
} as const;
export const FOLLOW_SPRING = { stiffness: 260, damping: 34, mass: 1 } as const;

/** Content reveals settle quickly without an abrupt stop. */
export const CONTENT_EASE_OUT = [0.16, 1, 0.3, 1] as const;
