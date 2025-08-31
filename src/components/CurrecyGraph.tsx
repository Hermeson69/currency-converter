import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format, subDays } from "date-fns";

interface ChartDataItem {
  date: string;
  [currency: string]: number | string;
}

interface CurrencyHistoryChartProps {
  days?: number;
  baseCurrency?: string;
}

export function CurrencyHistoryChart({
  days = 7,
  baseCurrency = "USD",
}: CurrencyHistoryChartProps) {
  const [chartData, setChartData] = useState<ChartDataItem[]>([]);
  const currencies = ["BRL","USD", "EUR"]; // Include USD regardless of baseCurrency
  const colors = ["#a256eb", "#f97316", "#ec4899"];

  // Fixed rates from CurrencyApiService.fallbackConversion
  const FIXED_RATES: Record<string, Record<string, number>> = {
    USD: { BRL: 5, EUR: 0.9, USD: 1 }, 
    EUR: { BRL: 6, USD: 1 / 0.9 },
    BRL: { USD: 1 / 5, EUR: 1 / 6 },
  };

  useEffect(() => {
    const generateFixedRateData = () => {
      const data: ChartDataItem[] = [];
      const today = new Date();

      for (let i = days - 1; i >= 0; i--) {
        const date = format(subDays(today, i), "dd/MM");
        const rates: ChartDataItem = { date };

        currencies.forEach((currency) => {
          const value = FIXED_RATES[baseCurrency]?.[currency] ?? 0;
          rates[currency] = Number(value.toFixed(4));
        });

        data.push(rates);
      }

      setChartData(data);
    };

    generateFixedRateData();
  }, [days, baseCurrency]);

  return (
    <Card className="flex-1 mt-10">
      <CardHeader>
        <CardTitle>Historical Exchange Rates (Base: {baseCurrency})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <XAxis
                dataKey="date"
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value.toFixed(2)}`}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-lg border bg-background p-2 shadow-sm">
                        <div className="grid grid-cols-1 gap-2">
                          {payload.map((entry, index) => (
                            <div key={index} className="flex flex-col">
                              <span className="text-[0.70rem] uppercase text-muted-foreground">
                                {entry.name}
                              </span>
                              <span
                                className="font-bold"
                                style={{ color: entry.color }}
                              >
                                {Number(entry.value).toFixed(4)} {entry.name}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              {currencies.map((currency, index) => (
                <Line
                  key={currency}
                  type="monotone"
                  dataKey={currency}
                  stroke={colors[index % colors.length]}
                  strokeWidth={2}
                  dot={false}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}