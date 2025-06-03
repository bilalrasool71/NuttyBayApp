export interface ProductMonthSales {
    id: number;
    name: string;
    monthlySales: MonthSales[];
  }
  
  export interface MonthSales {
    label: string;
    startDate: string;  // Assuming date format is string (ISO 8601)
    endDate: string;    // Assuming date format is string (ISO 8601)
    totalSales: number;
  }
  