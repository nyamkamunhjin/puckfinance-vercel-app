import React, { useState, useMemo } from "react";
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isSameDay 
} from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { cn } from "@/lib/utils";
import { Income } from "@/lib/binance";
import { TradeAccount } from "@/lib/trade-accounts";

interface AccountWithIncome {
  account: TradeAccount;
  incomeData: Income[];
}

interface DayIncomeData {
  date: Date;
  totalIncome: number;
  incomeByAccount: Record<string, number>;
  hasIncome: boolean;
}

interface TradingCalendarProps {
  accountsWithIncome: AccountWithIncome[];
  loading?: boolean;
  error?: string | null;
}

const TradingCalendar: React.FC<TradingCalendarProps> = ({ 
  accountsWithIncome,
  loading = false,
  error = null
}) => {
  // Calendar state
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

  // Calendar data processing
  const calendarData = useMemo(() => {
    // Get all days in the current month
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

    // Initialize income data for each day
    const daysData: DayIncomeData[] = daysInMonth.map(date => ({
      date,
      totalIncome: 0,
      incomeByAccount: {},
      hasIncome: false
    }));

    // Populate with income data
    accountsWithIncome.forEach(({ account, incomeData }) => {
      incomeData.forEach(income => {
        const incomeDate = new Date(income.time);
        const incomeValue = parseFloat(income.income);
        
        const dayData = daysData.find(day => isSameDay(day.date, incomeDate));
        if (dayData) {
          dayData.totalIncome += incomeValue;
          dayData.incomeByAccount[account.name] = (dayData.incomeByAccount[account.name] || 0) + incomeValue;
          dayData.hasIncome = true;
        }
      });
    });

    return daysData;
  }, [accountsWithIncome, currentMonth]);

  // Helper function to get previous month
  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  // Helper function to get next month
  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6 text-center">
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle>Trading Calendar - {format(currentMonth, 'MMMM yyyy')}</CardTitle>
          <div className="flex space-x-2">
            <button 
              onClick={prevMonth}
              className="px-3 py-1 text-sm rounded-md bg-gray-100 hover:bg-gray-200"
            >
              Previous
            </button>
            <button 
              onClick={() => setCurrentMonth(new Date())}
              className="px-3 py-1 text-sm rounded-md bg-gray-100 hover:bg-gray-200"
            >
              Today
            </button>
            <button 
              onClick={nextMonth}
              className="px-3 py-1 text-sm rounded-md bg-gray-100 hover:bg-gray-200"
            >
              Next
            </button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-1 font-medium mb-1 text-center">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="p-2">{day}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {/* First, add empty cells for days of the week before the start of the month */}
          {Array.from({ length: startOfMonth(currentMonth).getDay() }).map((_, index) => (
            <div key={`empty-start-${index}`} className="p-2 h-24 border rounded-md bg-gray-50"></div>
          ))}
          
          {/* Then render each day of the month */}
          {calendarData.map((day) => {
            const colorClass = day.totalIncome > 0 
              ? 'bg-green-50 hover:bg-green-100 border-green-200' 
              : day.totalIncome < 0 
                ? 'bg-red-50 hover:bg-red-100 border-red-200' 
                : 'bg-gray-50 hover:bg-gray-100';
            
            return (
              <div 
                key={format(day.date, 'yyyy-MM-dd')} 
                className={cn(
                  "p-2 h-24 border rounded-md transition-colors relative", 
                  colorClass
                )}
              >
                <div className="flex justify-between items-start">
                  <div className="text-sm font-medium">
                    {format(day.date, 'd')}
                  </div>
                  {day.hasIncome && (
                    <div className={cn(
                      "text-sm font-bold",
                      day.totalIncome > 0 ? "text-green-600" : "text-red-600"
                    )}>
                      {day.totalIncome.toFixed(2)}
                    </div>
                  )}
                </div>
                
                {day.hasIncome && (
                  <div className="mt-1 grid grid-cols-1 gap-1 max-h-16 overflow-y-auto">
                    {Object.entries(day.incomeByAccount)
                      .filter(([_, value]) => value !== 0)
                      .map(([account, value]) => (
                        <div 
                          key={account} 
                          className="flex justify-between items-center text-xs"
                        >
                          <span className="truncate max-w-[70%]">{account}:</span>
                          <span 
                            className={cn(
                              "font-medium",
                              value > 0 ? "text-green-600" : "text-red-600"
                            )}
                          >
                            {value.toFixed(2)}
                          </span>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            );
          })}
          
          {/* Finally, add empty cells for days of the week after the end of the month */}
          {Array.from({ length: 6 - endOfMonth(currentMonth).getDay() }).map((_, index) => (
            <div key={`empty-end-${index}`} className="p-2 h-24 border rounded-md bg-gray-50"></div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TradingCalendar; 