
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatNumber, LoanSummaryMetrics } from "@/utils/loanCalculations";

interface SummaryMetricsProps {
  metrics: LoanSummaryMetrics;
}

const SummaryMetrics = ({ metrics }: SummaryMetricsProps) => {
  return (
    <Card className="w-full mb-8">
      <CardHeader>
        <CardTitle>Loan Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-primary/10 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-muted-foreground">Principal Amount</h3>
            <p className="text-2xl font-semibold">{formatCurrency(metrics.principleAmountPaid)}</p>
          </div>
          
          <div className="bg-secondary/10 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-muted-foreground">Interest (Without Prepayment)</h3>
            <p className="text-2xl font-semibold">{formatCurrency(metrics.interestWithoutPrepayment)}</p>
          </div>
          
          <div className="bg-primary/10 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-muted-foreground">Interest (With Prepayment)</h3>
            <p className="text-2xl font-semibold">{formatCurrency(metrics.interestWithPrepayment)}</p>
          </div>
          
          <div className="bg-secondary/10 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-muted-foreground">Total Amount (Without Prepayment)</h3>
            <p className="text-2xl font-semibold">{formatCurrency(metrics.totalAmountWithoutPrepayment)}</p>
          </div>
          
          <div className="bg-primary/10 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-muted-foreground">Total Amount (With Prepayment)</h3>
            <p className="text-2xl font-semibold">{formatCurrency(metrics.totalAmountWithPrepayment)}</p>
          </div>
          
          <div className="bg-green-600/10 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-muted-foreground">Total Money Saved</h3>
            <p className="text-2xl font-semibold text-green-600">{formatCurrency(metrics.totalMoneySaved)}</p>
          </div>
          
          <div className="bg-blue-500/10 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-muted-foreground">Loan Paid In</h3>
            <p className="text-2xl font-semibold">
              {metrics.loanPaidInYears} years {metrics.loanPaidInMonths % 12} months
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SummaryMetrics;
