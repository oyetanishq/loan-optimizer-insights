
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoanParameters } from "@/utils/loanCalculations";

interface LoanFormProps {
  onCalculate: (params: LoanParameters) => void;
  isLoading: boolean;
}

const LoanForm = ({ onCalculate, isLoading }: LoanFormProps) => {
  const [formData, setFormData] = useState<LoanParameters>({
    loanAmount: 5000000,
    interestRate: 8,
    tenureInYears: 25,
    extraEmiPerYear: 1,
    emiHikePercentage: 10,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: parseFloat(value),
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCalculate(formData);
  };

  return (
    <Card className="w-full md:max-w-2xl mx-auto mb-8">
      <CardHeader>
        <CardTitle className="text-xl md:text-2xl font-bold">
          Loan Prepayment Calculator
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Loan Details</h3>
            
            <div className="space-y-2">
              <label htmlFor="loanAmount" className="text-sm font-medium">
                Loan Amount
              </label>
              <Input
                id="loanAmount"
                name="loanAmount"
                type="number"
                value={formData.loanAmount}
                onChange={handleInputChange}
                required
                min="1"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="interestRate" className="text-sm font-medium">
                Rate of Interest (%)
              </label>
              <Input
                id="interestRate"
                name="interestRate"
                type="number"
                value={formData.interestRate}
                onChange={handleInputChange}
                required
                min="0"
                step="0.01"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="tenureInYears" className="text-sm font-medium">
                Tenure (Years)
              </label>
              <Input
                id="tenureInYears"
                name="tenureInYears"
                type="number"
                value={formData.tenureInYears}
                onChange={handleInputChange}
                required
                min="1"
                max="50"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="extraEmiPerYear" className="text-sm font-medium">
                Extra EMI Every Year
              </label>
              <Input
                id="extraEmiPerYear"
                name="extraEmiPerYear"
                type="number"
                value={formData.extraEmiPerYear}
                onChange={handleInputChange}
                required
                min="0"
                max="12"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="emiHikePercentage" className="text-sm font-medium">
                Hike EMI by % Every Year
              </label>
              <Input
                id="emiHikePercentage"
                name="emiHikePercentage"
                type="number"
                value={formData.emiHikePercentage}
                onChange={handleInputChange}
                required
                min="0"
                step="0.1"
              />
            </div>
          </div>
          
          <div className="flex justify-center pt-4">
            <Button type="submit" className="w-full md:w-auto" disabled={isLoading}>
              {isLoading ? "Calculating..." : "Calculate"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default LoanForm;
