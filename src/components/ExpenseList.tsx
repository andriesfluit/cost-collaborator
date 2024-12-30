import { useState } from 'react';
import type { Expense } from './ExpenseForm';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

type ExpenseListProps = {
  expenses: Expense[];
};

export const ExpenseList = ({ expenses }: ExpenseListProps) => {
  const [sortField, setSortField] = useState<keyof Expense>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const sortedExpenses = [...expenses].sort((a, b) => {
    if (sortField === 'amount') {
      return sortDirection === 'asc' ? a.amount - b.amount : b.amount - a.amount;
    }
    return sortDirection === 'asc' 
      ? a[sortField].localeCompare(b[sortField])
      : b[sortField].localeCompare(a[sortField]);
  });

  const toggleSort = (field: keyof Expense) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString();
  };

  const formatAmount = (amount: number) => {
    return amount.toLocaleString('de-DE', {
      style: 'currency',
      currency: 'EUR'
    });
  };

  const getSplitLabel = (splitType: string) => {
    switch (splitType) {
      case 'restaurant': return '50/50';
      case 'no-kids': return '60/40';
      case 'kids': return '35/65';
      default: return splitType;
    }
  };

  return (
    <div className="rounded-xl border bg-white overflow-hidden">
      <ScrollArea className="h-[400px] md:h-[500px]">
        <Table>
          <TableHeader className="bg-gray-50 sticky top-0">
            <TableRow>
              <TableHead className="w-[100px]">
                <Button variant="ghost" onClick={() => toggleSort('date')} className="text-xs md:text-sm">
                  Date <ArrowUpDown className="ml-1 h-3 w-3 md:h-4 md:w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => toggleSort('amount')} className="text-xs md:text-sm">
                  Amount <ArrowUpDown className="ml-1 h-3 w-3 md:h-4 md:w-4" />
                </Button>
              </TableHead>
              <TableHead className="hidden md:table-cell">
                <Button variant="ghost" onClick={() => toggleSort('description')} className="text-xs md:text-sm">
                  Description <ArrowUpDown className="ml-1 h-3 w-3 md:h-4 md:w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => toggleSort('category')} className="text-xs md:text-sm">
                  Category <ArrowUpDown className="ml-1 h-3 w-3 md:h-4 md:w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => toggleSort('payer')} className="text-xs md:text-sm">
                  Paid By <ArrowUpDown className="ml-1 h-3 w-3 md:h-4 md:w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => toggleSort('splitType')} className="text-xs md:text-sm">
                  Split <ArrowUpDown className="ml-1 h-3 w-3 md:h-4 md:w-4" />
                </Button>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedExpenses.map((expense) => (
              <TableRow key={expense.id} className="hover:bg-gray-50">
                <TableCell className="text-xs md:text-sm">{formatDate(expense.date)}</TableCell>
                <TableCell className="text-xs md:text-sm font-medium">{formatAmount(expense.amount)}</TableCell>
                <TableCell className="hidden md:table-cell text-xs md:text-sm">{expense.description}</TableCell>
                <TableCell className="text-xs md:text-sm">{expense.category}</TableCell>
                <TableCell className="text-xs md:text-sm">{expense.payer}</TableCell>
                <TableCell className="text-xs md:text-sm">{getSplitLabel(expense.splitType)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  );
};