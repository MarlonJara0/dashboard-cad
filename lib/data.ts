export interface SheetData {
  over30Data: ReadonlyArray<{
    readonly month: string;
    readonly target: number;
    readonly actual: number;
  }>;
  over90Data: ReadonlyArray<{
    readonly month: string;
    readonly target: number;
    readonly actual: number;
  }>;
  performanceData: ReadonlyArray<{
    readonly customer: string;
    readonly amount: string;
    readonly status: string;
    readonly daysOverdue: string;
  }>;
}

export const PPAData = {
  over30Data: [
    { month: "January", target: 15, actual: 45 },
    { month: "February", target: 15, actual: 35 },
    { month: "March", target: 15, actual: 30 },
    { month: "April", target: 15, actual: 25 },
    { month: "May", target: 15, actual: 18 },
    { month: "June", target: 15, actual: 14 },
    { month: "July", target: 15, actual: 13 },
    { month: "August", target: 15, actual: 12 },
    { month: "September", target: 15, actual: 11 },
    { month: "October", target: 15, actual: 10 },
    { month: "November", target: 15, actual: 9 },
    { month: "December", target: 15, actual: 8 }
  ],
  over90Data: [
    { month: "January", target: 6, actual: 25 },
    { month: "February", target: 6, actual: 20 },
    { month: "March", target: 6, actual: 15 },
    { month: "April", target: 6, actual: 12 },
    { month: "May", target: 6, actual: 8 },
    { month: "June", target: 6, actual: 5 },
    { month: "July", target: 6, actual: 4 },
    { month: "August", target: 6, actual: 4 },
    { month: "September", target: 6, actual: 3 },
    { month: "October", target: 6, actual: 3 },
    { month: "November", target: 6, actual: 2 },
    { month: "December", target: 6, actual: 2 }
  ],
  performanceData: [
    { customer: "PPA Customer A", amount: "$10,000", status: "Active", daysOverdue: "45" },
    { customer: "PPA Customer B", amount: "$15,000", status: "Pending", daysOverdue: "60" },
    { customer: "PPA Customer C", amount: "$8,000", status: "Active", daysOverdue: "35" },
    { customer: "PPA Customer D", amount: "$12,500", status: "Pending", daysOverdue: "55" },
    { customer: "PPA Customer E", amount: "$9,500", status: "Active", daysOverdue: "40" },
    { customer: "PPA Customer F", amount: "$25,000", status: "Critical", daysOverdue: "120" },
    { customer: "PPA Customer G", amount: "$18,000", status: "Critical", daysOverdue: "150" },
    { customer: "PPA Customer H", amount: "$22,000", status: "Critical", daysOverdue: "180" },
    { customer: "PPA Customer I", amount: "$16,500", status: "Critical", daysOverdue: "135" },
    { customer: "PPA Customer J", amount: "$20,000", status: "Critical", daysOverdue: "165" }
  ]
} as const;

export const MCSData: SheetData = {
  over30Data: [
    { month: "January", target: 15, actual: 48 },
    { month: "February", target: 15, actual: 40 },
    { month: "March", target: 15, actual: 35 },
    { month: "April", target: 15, actual: 28 },
    { month: "May", target: 15, actual: 20 },
    { month: "June", target: 15, actual: 16 },
    { month: "July", target: 15, actual: 15 },
    { month: "August", target: 15, actual: 14 },
    { month: "September", target: 15, actual: 13 },
    { month: "October", target: 15, actual: 12 },
    { month: "November", target: 15, actual: 11 },
    { month: "December", target: 15, actual: 10 }
  ],
  over90Data: [
    { month: "January", target: 6, actual: 28 },
    { month: "February", target: 6, actual: 22 },
    { month: "March", target: 6, actual: 18 },
    { month: "April", target: 6, actual: 14 },
    { month: "May", target: 6, actual: 10 },
    { month: "June", target: 6, actual: 7 },
    { month: "July", target: 6, actual: 6 },
    { month: "August", target: 6, actual: 5 },
    { month: "September", target: 6, actual: 4 },
    { month: "October", target: 6, actual: 4 },
    { month: "November", target: 6, actual: 3 },
    { month: "December", target: 6, actual: 3 }
  ],
  performanceData: [
    { customer: "MCS Customer A", amount: "$12,000", status: "Active", daysOverdue: "40" },
    { customer: "MCS Customer B", amount: "$18,000", status: "Pending", daysOverdue: "55" },
    { customer: "MCS Customer C", amount: "$9,500", status: "Active", daysOverdue: "32" },
    { customer: "MCS Customer D", amount: "$14,500", status: "Pending", daysOverdue: "50" },
    { customer: "MCS Customer E", amount: "$11,000", status: "Active", daysOverdue: "38" },
    { customer: "MCS Customer F", amount: "$28,000", status: "Critical", daysOverdue: "110" },
    { customer: "MCS Customer G", amount: "$21,000", status: "Critical", daysOverdue: "140" },
    { customer: "MCS Customer H", amount: "$24,500", status: "Critical", daysOverdue: "170" },
    { customer: "MCS Customer I", amount: "$19,500", status: "Critical", daysOverdue: "125" },
    { customer: "MCS Customer J", amount: "$23,000", status: "Critical", daysOverdue: "155" }
  ]
};

export const EPMData: SheetData = {
  over30Data: [
    { month: "January", target: 15, actual: 42 },
    { month: "February", target: 15, actual: 38 },
    { month: "March", target: 15, actual: 32 },
    { month: "April", target: 15, actual: 26 },
    { month: "May", target: 15, actual: 22 },
    { month: "June", target: 15, actual: 17 },
    { month: "July", target: 15, actual: 16 },
    { month: "August", target: 15, actual: 15 },
    { month: "September", target: 15, actual: 14 },
    { month: "October", target: 15, actual: 13 },
    { month: "November", target: 15, actual: 12 },
    { month: "December", target: 15, actual: 11 }
  ],
  over90Data: [
    { month: "January", target: 6, actual: 24 },
    { month: "February", target: 6, actual: 20 },
    { month: "March", target: 6, actual: 16 },
    { month: "April", target: 6, actual: 12 },
    { month: "May", target: 6, actual: 9 },
    { month: "June", target: 6, actual: 8 },
    { month: "July", target: 6, actual: 7 },
    { month: "August", target: 6, actual: 6 },
    { month: "September", target: 6, actual: 5 },
    { month: "October", target: 6, actual: 5 },
    { month: "November", target: 6, actual: 4 },
    { month: "December", target: 6, actual: 4 }
  ],
  performanceData: [
    { customer: "EPM Customer A", amount: "$11,000", status: "Active", daysOverdue: "42" },
    { customer: "EPM Customer B", amount: "$16,500", status: "Pending", daysOverdue: "58" },
    { customer: "EPM Customer C", amount: "$8,800", status: "Active", daysOverdue: "33" },
    { customer: "EPM Customer D", amount: "$13,500", status: "Pending", daysOverdue: "52" },
    { customer: "EPM Customer E", amount: "$10,200", status: "Active", daysOverdue: "36" },
    { customer: "EPM Customer F", amount: "$26,000", status: "Critical", daysOverdue: "115" },
    { customer: "EPM Customer G", amount: "$19,500", status: "Critical", daysOverdue: "145" },
    { customer: "EPM Customer H", amount: "$23,000", status: "Critical", daysOverdue: "175" },
    { customer: "EPM Customer I", amount: "$17,500", status: "Critical", daysOverdue: "130" },
    { customer: "EPM Customer J", amount: "$21,500", status: "Critical", daysOverdue: "160" }
  ]
}; 