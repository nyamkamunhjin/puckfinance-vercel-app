import React, { FC, useMemo } from 'react';
import { Income } from '@/lib/binance';
import { CartesianGrid, Line, LineChart, XAxis, YAxis, AreaChart, Area } from 'recharts';

import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from '@/components/ui/chart';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface IProps {
    incomeData: Income[];
}

const chartConfig = {
    income: {
        label: '$',
        color: 'oklch(0.723 0.219 149.579)',
    },
} satisfies ChartConfig;

/**
 * ProfitChart - Displays income data in a line chart
 * @param {IProps} props - Component props containing income data
 * @returns {JSX.Element} Line chart visualization of income data
 */
const ProfitChart: FC<IProps> = ({ incomeData }) => {
    const normalizedIncomeData = useMemo(
        () =>
            {
              let accumulatedIncome = 0;
              return incomeData.sort((a, b) => a.time - b.time).map((item) => {
                accumulatedIncome += parseFloat(item.income);
                return {
                  date: new Date(item.time).toLocaleDateString(),
                  income: accumulatedIncome,
                }
              })
            },
        [incomeData]
    );

    console.log(normalizedIncomeData);

    return (
        <Card className="p-4">
          <CardHeader>
            <CardTitle>Income Over Time</CardTitle>
          </CardHeader>
          <CardContent>
          <ChartContainer className="h-96 aspect-auto" config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={normalizedIncomeData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
             <defs>
              <linearGradient id="fillIncome" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="oklch(0.723 0.219 149.579)"
                  stopOpacity={0.7}
                />
                <stop
                  offset="70%"
                  stopColor="oklch(0.723 0.219 149.579)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={true}
              content={<ChartTooltipContent />}
            />
            
            <Area
              dataKey="income"
              type="natural"
              fillOpacity={1}
              fill="url(#fillIncome)"
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => `$${value.toLocaleString()}`}
            />
          </AreaChart>
        </ChartContainer>
          </CardContent>
        </Card>
    );
};

export default ProfitChart;
