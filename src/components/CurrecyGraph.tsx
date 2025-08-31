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
import { currencyApiService } from "@/api/currency";

interface ChartDataItem {
  date: string;
  [currency: string]: number | string;
}

interface CurrencyHistoryChartProps {
  days?: number;
}

export function CurrencyHistoryChart({
  days = 7,
}: CurrencyHistoryChartProps) {
  const [chartData, setChartData] = useState<ChartDataItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const currencies = ["BRL", "EUR"]; // Moedas para rastrear, base é USD
  const colors = ["#a256eb", "#f97316"];

  useEffect(() => {
    const fetchRealTimeRates = async () => {
      try {
        const response = await currencyApiService.getLastRates({
          base_currency: "USD",
          currencies,
        });

        const ratesData: Record<string, number> = {};
        currencies.forEach((currency) => {
          ratesData[currency] = response.data[currency]?.value ?? 0;
        });

        // Gera dados replicando as taxas atuais para todos os dias (linha horizontal)
        const data: ChartDataItem[] = [];
        const today = new Date();

        for (let i = days - 1; i >= 0; i--) {
          const date = format(subDays(today, i), "dd/MM");
          const rates: ChartDataItem = { date };

          currencies.forEach((currency) => {
            rates[currency] = Number(ratesData[currency].toFixed(4));
          });

          // Inclui a base USD como 1
          rates["USD"] = 1;

          data.push(rates);
        }

        setChartData(data);
        setError(null);
      } catch (err) {
        setError("Falha ao carregar taxas em tempo real.");
      }
    };

    fetchRealTimeRates();
  }, [days]);

  return (
    <Card className="flex-1 mt-10">
      <CardHeader>
        <CardTitle>Real-Time Exchange Rates (Base: USD)</CardTitle>
      </CardHeader>
      <CardContent>
        {error && <p className="text-red-500">{error}</p>}
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
              {["USD", ...currencies].map((currency, index) => (
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