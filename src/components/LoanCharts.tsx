
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { MonthlyAmortization, LoanSummaryMetrics } from "@/utils/loanCalculations";

interface LoanChartsProps {
  monthlyData: MonthlyAmortization[];
  summaryMetrics: LoanSummaryMetrics;
}

const LoanCharts = ({ monthlyData, summaryMetrics }: LoanChartsProps) => {
  // Process data for Area Chart
  const areaChartData = monthlyData.filter((_, index) => index % 12 === 0).map((item) => ({
    year: Math.ceil(item.month / 12),
    principal: item.outstandingLoan,
  }));

  // Process data for Pie Chart
  const pieChartData = [
    { name: "Principal", value: summaryMetrics.principleAmountPaid },
    { name: "Interest", value: summaryMetrics.interestWithPrepayment },
  ];

  // Process data for Bar Chart - Monthly contribution to principal vs interest
  const barChartData = monthlyData.filter((_, index) => index % 12 === 0).map((item) => ({
    year: Math.ceil(item.month / 12),
    principal: item.towardsLoan,
    interest: item.towardsInterest,
  }));

  // Colors for charts
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* Outstanding Principal Over Time */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Outstanding Principal Over Time</CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={areaChartData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" label={{ value: "Year", position: "insideBottom", offset: -5 }} />
              <YAxis label={{ value: "Amount (₹)", angle: -90, position: "insideLeft" }} />
              <Tooltip formatter={(value: number) => new Intl.NumberFormat("en-IN").format(value)} />
              <Legend />
              <Area
                type="monotone"
                dataKey="principal"
                name="Outstanding Principal"
                stroke="#0088FE"
                fill="#0088FE"
                fillOpacity={0.3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Principal vs Interest Breakdown */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Principal vs Interest</CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieChartData}
                cx="50%"
                cy="50%"
                labelLine={true}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => new Intl.NumberFormat("en-IN").format(value)} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* EMI Breakdown by Year */}
      <Card className="w-full lg:col-span-2">
        <CardHeader>
          <CardTitle>Yearly EMI Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={barChartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" label={{ value: "Year", position: "insideBottom", offset: -5 }} />
              <YAxis label={{ value: "Amount (₹)", angle: -90, position: "insideLeft" }} />
              <Tooltip formatter={(value: number) => new Intl.NumberFormat("en-IN").format(value)} />
              <Legend />
              <Bar dataKey="principal" name="Towards Principal" fill="#00C49F" />
              <Bar dataKey="interest" name="Towards Interest" fill="#FF8042" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoanCharts;
