import React from "react"
import {   CashSolid, CreditCard } from "@medusajs/icons"
import { Wallet } from "lucide-react";


export const paymentInfoMap: Record<
  string,
  { title: string; icon: React.JSX.Element }
> = {
  "pp_card_stripe-connect": {
    title: "Credit card",
    icon: <CreditCard />,
  },
  pp_stripe_stripe: {
    title: "Credit card",
    icon: <CreditCard />,
  },
  "pp_stripe-ideal_stripe": {
    title: "iDeal",
    icon: <CreditCard />,
  },
  "pp_stripe-bancontact_stripe": {
    title: "Bancontact",
    icon: <CreditCard />,
  },
  pp_paypal_paypal: {
    title: "PayPal",
    icon: <CreditCard />,
  },
  pp_cod_cod: {
    title: "Cash on delivery",
    icon: <CashSolid className="w-5 h-5" />,
  },
  pp_khalti_khalti: {
    title: "Khalti",
    icon: <Wallet className="w-5 h-5" />,
  },

}


export const isStripe = (providerId?: string) => {
  return providerId?.startsWith("pp_card_stripe-connect")
}
export const isPaypal = (providerId?: string) => {
  return providerId?.startsWith("pp_paypal")
}
export const isManual = (providerId?: string) => {
  return providerId?.startsWith("pp_system_default")
}
export const isCod = (providerId?: string) => {
  return providerId?.startsWith("pp_cod")
}


export const noDivisionCurrencies = [
  "krw",
  "jpy",
  "vnd",
  "clp",
  "pyg",
  "xaf",
  "xof",
  "bif",
  "djf",
  "gnf",
  "kmf",
  "mga",
  "rwf",
  "xpf",
  "htg",
  "vuv",
  "xag",
  "xdr",
  "xau",
]

export const CAROUSEL_AUTO_SLIDE_INTERVAL = 4000;

