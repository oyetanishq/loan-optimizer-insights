
/**
 * Calculate the standard EMI
 * @param loanAmount Initial loan amount
 * @param annualInterestRate Annual interest rate (in percentage)
 * @param tenureInYears Loan tenure in years
 * @returns Monthly EMI amount
 */
export const calculateEMI = (
  loanAmount: number,
  annualInterestRate: number,
  tenureInYears: number
): number => {
  // Convert annual interest rate from percentage to monthly decimal
  const monthlyInterestRate = annualInterestRate / 12 / 100;
  const totalMonths = tenureInYears * 12;
  
  // Handle edge case when interest rate is 0
  if (annualInterestRate === 0) {
    return loanAmount / totalMonths;
  }
  
  const emi =
    (loanAmount *
      monthlyInterestRate *
      Math.pow(1 + monthlyInterestRate, totalMonths)) /
    (Math.pow(1 + monthlyInterestRate, totalMonths) - 1);
  
  return emi;
};

/**
 * Calculate monthly interest
 * @param outstandingLoan Outstanding loan balance
 * @param annualInterestRate Annual interest rate (in percentage)
 * @returns Interest amount for the month
 */
export const calculateMonthlyInterest = (
  outstandingLoan: number,
  annualInterestRate: number
): number => {
  return outstandingLoan * (annualInterestRate / 12 / 100);
};

/**
 * Calculate total interest using Excel's CUMIPMT formula logic
 * @param loanAmount Initial loan amount
 * @param annualInterestRate Annual interest rate (in percentage)
 * @param tenureInYears Loan tenure in years
 * @returns Total interest over the loan term
 */
export const calculateTotalInterestWithoutPrepayment = (
  loanAmount: number,
  annualInterestRate: number,
  tenureInYears: number
): number => {
  // This mimics Excel's CUMIPMT function for the entire loan period
  // For a loan CUMIPMT(rate/12, nper*12, pv, 1, nper*12, 0)
  
  const monthlyRate = annualInterestRate / 12 / 100;
  const totalMonths = tenureInYears * 12;
  const monthlyPayment = calculateEMI(loanAmount, annualInterestRate, tenureInYears);
  
  // Handle edge case when interest rate is 0
  if (annualInterestRate === 0) {
    return 0;
  }
  
  let totalInterest = 0;
  let remainingBalance = loanAmount;
  
  for (let month = 1; month <= totalMonths; month++) {
    const interest = remainingBalance * monthlyRate;
    const principal = monthlyPayment - interest;
    
    totalInterest += interest;
    remainingBalance -= principal;
    
    // Prevent negative balance
    if (remainingBalance < 0) {
      remainingBalance = 0;
      break;
    }
  }
  
  return totalInterest;
};

/**
 * Type definition for loan parameter inputs
 */
export interface LoanParameters {
  loanAmount: number;
  interestRate: number;
  tenureInYears: number;
  extraEmiPerYear: number;
  emiHikePercentage: number;
}

/**
 * Type definition for a single month's amortization data
 */
export interface MonthlyAmortization {
  month: number;
  emi: number;
  towardsLoan: number;
  towardsInterest: number;
  outstandingLoan: number;
  prepayment: number;
  isPaid: boolean;
}

/**
 * Type definition for loan summary metrics
 */
export interface LoanSummaryMetrics {
  principleAmountPaid: number;
  interestWithoutPrepayment: number;
  interestWithPrepayment: number;
  totalAmountWithoutPrepayment: number;
  totalAmountWithPrepayment: number;
  totalMoneySaved: number;
  loanPaidInYears: number;
  loanPaidInMonths: number;
}

/**
 * Generate full amortization schedule with prepayments
 */
export const generateAmortizationSchedule = (
  params: LoanParameters
): {
  monthlyData: MonthlyAmortization[];
  summaryMetrics: LoanSummaryMetrics;
} => {
  const {
    loanAmount,
    interestRate,
    tenureInYears,
    extraEmiPerYear,
    emiHikePercentage,
  } = params;

  // Calculate base EMI without prepayments
  const baseEMI = calculateEMI(loanAmount, interestRate, tenureInYears);
  
  // Calculate total interest without prepayments using Excel's CUMIPMT logic
  const totalInterestWithoutPrepayment = calculateTotalInterestWithoutPrepayment(
    loanAmount, 
    interestRate, 
    tenureInYears
  );
  
  // Initialize variables for prepayment scenario
  const totalMonths = tenureInYears * 12;
  let currentEmi = baseEMI;
  let outstandingLoan = loanAmount;
  let currentMonth = 1;
  let totalInterestWithPrepayment = 0;
  let totalPrincipalPaid = 0;
  const monthlyData: MonthlyAmortization[] = [];
  
  // Keep the prepayment amount fixed at the initial EMI
  const fixedPrepaymentAmount = baseEMI;
  let lastYearProcessed = 0;
  
  // Process each month until loan is paid off or tenure is reached
  while (outstandingLoan > 0 && currentMonth <= totalMonths) {
    // Check if EMI should be hiked annually
    const currentYear = Math.floor((currentMonth - 1) / 12) + 1;
    if (emiHikePercentage > 0 && currentYear > lastYearProcessed) {
      // Only increase EMI after the first year
      if (currentYear > 1) {
        currentEmi = currentEmi * (1 + emiHikePercentage / 100);
      }
      
      lastYearProcessed = currentYear;
    }
    
    // Calculate interest for current month
    const monthlyInterest = calculateMonthlyInterest(outstandingLoan, interestRate);
    totalInterestWithPrepayment += monthlyInterest;
    
    // Calculate principal for current month
    let principalPayment = currentEmi - monthlyInterest;
    
    // Check if EMI is more than outstanding loan
    if (principalPayment > outstandingLoan) {
      principalPayment = outstandingLoan;
      currentEmi = principalPayment + monthlyInterest;
    }
    
    // Apply prepayment if applicable
    let prepayment = 0;
    if (extraEmiPerYear > 0 && currentMonth % (12 / extraEmiPerYear) === 0) {
      prepayment = fixedPrepaymentAmount;
      
      // Ensure prepayment doesn't exceed outstanding loan
      if (prepayment > outstandingLoan - principalPayment) {
        prepayment = outstandingLoan - principalPayment;
      }
    }
    
    // Update outstanding loan
    outstandingLoan = Math.max(0, outstandingLoan - principalPayment - prepayment);
    totalPrincipalPaid += principalPayment + prepayment;
    
    // Add data for current month
    monthlyData.push({
      month: currentMonth,
      emi: currentEmi,
      towardsLoan: principalPayment,
      towardsInterest: monthlyInterest,
      outstandingLoan: outstandingLoan,
      prepayment: prepayment,
      isPaid: outstandingLoan === 0
    });
    
    currentMonth++;
  }
  
  // Calculate summary metrics
  const loanPaidInMonths = monthlyData.length;
  const loanPaidInYears = loanPaidInMonths / 12;
  
  const summaryMetrics: LoanSummaryMetrics = {
    principleAmountPaid: loanAmount,
    interestWithoutPrepayment: totalInterestWithoutPrepayment,
    interestWithPrepayment: totalInterestWithPrepayment,
    totalAmountWithoutPrepayment: loanAmount + totalInterestWithoutPrepayment,
    totalAmountWithPrepayment: loanAmount + totalInterestWithPrepayment,
    totalMoneySaved: totalInterestWithoutPrepayment - totalInterestWithPrepayment,
    loanPaidInYears: Math.floor(loanPaidInYears),
    loanPaidInMonths: loanPaidInMonths
  };
  
  return { monthlyData, summaryMetrics };
};

/**
 * Format number as currency
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Format number as percentage
 */
export const formatPercentage = (value: number): string => {
  return `${value.toFixed(2)}%`;
};

/**
 * Format number with commas
 */
export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat().format(Math.round(num * 100) / 100);
};
