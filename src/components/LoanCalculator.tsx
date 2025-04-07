
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import LoanForm from "./LoanForm";
import SummaryMetrics from "./SummaryMetrics";
import AmortizationTable from "./AmortizationTable";
import LoanCharts from "./LoanCharts";
import { generateAmortizationSchedule, LoanParameters, MonthlyAmortization, LoanSummaryMetrics, calculateEMI } from "@/utils/loanCalculations";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/utils/loanCalculations";

const LoanCalculator = () => {
  const { theme, setTheme } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [monthlyData, setMonthlyData] = useState<MonthlyAmortization[]>([]);
  const [summaryMetrics, setSummaryMetrics] = useState<LoanSummaryMetrics | null>(null);
  const [standardEMI, setStandardEMI] = useState<number>(0);
  const [calculationComplete, setCalculationComplete] = useState(false);

  const handleCalculate = (params: LoanParameters) => {
    setIsLoading(true);
    
    // Simulate heavy calculation with timeout
    setTimeout(() => {
      try {
        const result = generateAmortizationSchedule(params);
        setMonthlyData(result.monthlyData);
        setSummaryMetrics(result.summaryMetrics);
        
        // Calculate the standard EMI for display
        const emi = calculateEMI(params.loanAmount, params.interestRate, params.tenureInYears);
        setStandardEMI(emi);
        
        setCalculationComplete(true);
      } catch (error) {
        console.error("Calculation error:", error);
        // Here you would normally show an error toast
      } finally {
        setIsLoading(false);
      }
    }, 500);
  };

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold">
            Loan Prepayment Calculator
          </h1>
          <Button variant="outline" size="icon" onClick={toggleTheme}>
            {theme === "light" ? (
              <MoonIcon className="h-5 w-5" />
            ) : (
              <SunIcon className="h-5 w-5" />
            )}
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>

        <LoanForm onCalculate={handleCalculate} isLoading={isLoading} />

        {calculationComplete && standardEMI > 0 && (
          <Card className="w-full mb-8">
            <CardContent className="pt-6">
              <div className="text-center">
                <h2 className="text-lg font-medium text-muted-foreground">Standard Monthly EMI</h2>
                <p className="text-4xl font-bold mt-1">{formatCurrency(standardEMI)}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {calculationComplete && summaryMetrics && (
          <>
            <SummaryMetrics metrics={summaryMetrics} />
            <LoanCharts monthlyData={monthlyData} summaryMetrics={summaryMetrics} />
            <AmortizationTable data={monthlyData} />
          </>
        )}
      </div>
    </div>
  );
};

export default LoanCalculator;
