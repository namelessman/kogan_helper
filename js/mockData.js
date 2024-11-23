export const mock = {
  plan: {
    description:
      "gives you Unlimited TXTs and Unlimited Minutes with 15 GB Data",
    entitlements: [
      {
        description: "Data",
        entitlementType: "DATA",
        isUnlimited: false,
        name: "Anytime Kogan Data Bundle",
        totalAllowance: { unit: "GB", amount: "15.00" },
        remainingAllowance: { unit: "GB", amount: "13.53" },
        end_date_inclusive: "2024-12-01",
      },
    ],
    id: "Kogan_Large_365Day",
    title: "40% OFF LARGE 365 Days",
    end_date_inclusive: "2024-12-01",
    length: 365,
    renewal_length: 365,
    renewal_enabled: true,
    is_final_cycle: true,
  },
  addons: [],
  expiry_date: "2025-09-01",
  renewal_date: "2025-09-01",
  is_expired: false,
  porting_request: {
    msisdn: "020 000 0000",
    provider: "42",
    account_number: null,
    prepaid_sim_number: "0000000000",
    billing_method: 1,
    status: 3,
    external_id: "AAAAAAA",
    failure_acknowledged_at: null,
    failed_message: null,
  },
};
