
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { formatCurrency, formatNumber, MonthlyAmortization } from "@/utils/loanCalculations";

interface AmortizationTableProps {
  data: MonthlyAmortization[];
}

const AmortizationTable = ({ data }: AmortizationTableProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredData = searchTerm
    ? data.filter((item) => 
        item.month.toString().includes(searchTerm) ||
        item.emi.toString().includes(searchTerm) ||
        item.towardsLoan.toString().includes(searchTerm)
      )
    : data;

  const totalPages = Math.ceil(filteredData.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const currentData = filteredData.slice(startIndex, startIndex + pageSize);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const pagesToShow = 5;
  const pageNumbers = [];
  let startPage = Math.max(1, currentPage - Math.floor(pagesToShow / 2));
  let endPage = Math.min(totalPages, startPage + pagesToShow - 1);

  if (endPage - startPage + 1 < pagesToShow) {
    startPage = Math.max(1, endPage - pagesToShow + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <Card className="w-full mb-8">
      <CardHeader>
        <CardTitle>Amortization Schedule</CardTitle>
        <div className="mt-2">
          <Input
            placeholder="Search by month or amount..."
            value={searchTerm}
            onChange={handleSearch}
            className="max-w-xs"
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead>Month</TableHead>
                <TableHead>EMI</TableHead>
                <TableHead>Towards Loan</TableHead>
                <TableHead>Towards Interest</TableHead>
                <TableHead>Outstanding Loan</TableHead>
                <TableHead>Prepayment</TableHead>
                <TableHead>Salary</TableHead>
                <TableHead>Increment</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentData.map((item) => (
                <TableRow
                  key={item.month}
                  className={item.isPaid ? "bg-green-50 dark:bg-green-950/20" : ""}
                >
                  <TableCell>{item.month}</TableCell>
                  <TableCell>{formatCurrency(item.emi)}</TableCell>
                  <TableCell>{formatCurrency(item.towardsLoan)}</TableCell>
                  <TableCell>{formatCurrency(item.towardsInterest)}</TableCell>
                  <TableCell>{formatCurrency(item.outstandingLoan)}</TableCell>
                  <TableCell>
                    {item.prepayment > 0 ? formatCurrency(item.prepayment) : "-"}
                  </TableCell>
                  <TableCell>{formatCurrency(item.salaryWithJobSwitch)}</TableCell>
                  <TableCell>
                    {item.increment > 0 ? formatCurrency(item.increment) : "-"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {totalPages > 1 && (
          <Pagination className="mt-4">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
              
              {startPage > 1 && (
                <>
                  <PaginationItem>
                    <PaginationLink onClick={() => handlePageChange(1)} className="cursor-pointer">
                      1
                    </PaginationLink>
                  </PaginationItem>
                  {startPage > 2 && (
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                  )}
                </>
              )}
              
              {pageNumbers.map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    isActive={page === currentPage}
                    onClick={() => handlePageChange(page)}
                    className="cursor-pointer"
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}
              
              {endPage < totalPages && (
                <>
                  {endPage < totalPages - 1 && (
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                  )}
                  <PaginationItem>
                    <PaginationLink
                      onClick={() => handlePageChange(totalPages)}
                      className="cursor-pointer"
                    >
                      {totalPages}
                    </PaginationLink>
                  </PaginationItem>
                </>
              )}
              
              <PaginationItem>
                <PaginationNext
                  onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                  className={
                    currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </CardContent>
    </Card>
  );
};

export default AmortizationTable;
