import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { format } from "date-fns";

interface ChartData {
  time: number;
  value: number;
}

interface CardChartProps {
  title: string;
  data: ChartData[];
  valuePrefix?: string;
  valueSuffix?: string;
  color?: string;
}

export function CardChart({
  title,
  data,
  valuePrefix = "",
  valueSuffix = "",
  color = "#3b82f6"
}: CardChartProps) {
  const formatTooltipValue = (value: number) => {
    return `${valuePrefix}${value.toFixed(2)}${valueSuffix}`;
  };

  const formatXAxis = (timestamp: number) => {
    return format(new Date(timestamp), 'MMM dd');
  };

  return (
    <Card className="col-span-1 md:col-span-2">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{
                top: 10,
                right: 30,
                left: 0,
                bottom: 0,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis 
                dataKey="time" 
                tickFormatter={formatXAxis} 
                minTickGap={40}
              />
              <YAxis 
                tickFormatter={(value) => `${valuePrefix}${value.toFixed(0)}${valueSuffix}`}
              />
              <Tooltip 
                formatter={formatTooltipValue}
                labelFormatter={(value) => format(new Date(value as number), 'PPP')}
                contentStyle={{ 
                  backgroundColor: "var(--background)", 
                  borderColor: "var(--border)" 
                }}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke={color}
                fill={color}
                fillOpacity={0.2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
} 