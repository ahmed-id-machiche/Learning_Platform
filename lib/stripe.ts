import Stripe from "stripe";

export const stripe = new Stripe(
  process.env.STRIPE_API_KEY || "dummy_stripe_key_for_build",
  {
    apiVersion: "2026-06-24.dahlia" as any,
    typescript: true,
  }
);
