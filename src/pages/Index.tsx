
import { ThemeProvider } from "next-themes";
import LoanCalculator from "@/components/LoanCalculator";

const Index = () => {
  return (
    <ThemeProvider attribute="class">
      <LoanCalculator />
    </ThemeProvider>
  );
};

export default Index;
