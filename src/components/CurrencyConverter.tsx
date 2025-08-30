import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeftRight, DollarSign, TrendingUp } from "lucide-react";
import { currencyApiService } from "@/api/currency"; // Ajuste o caminho conforme necessário

interface CurrencyConverterProps {
  // Props opcionais se necessário, mas para este exemplo, o componente é autônomo
}

export const CurrencyConverter = () => {
  const [value, setValue] = useState<number>(1);
  const [from, setFrom] = useState<string>("USD");
  const [to, setTo] = useState<string>("BRL");
  const [convertedValue, setConvertedValue] = useState<number | null>(null);
  const [rate, setRate] = useState<number | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleConvert = async () => {
    setLoading(true);
    setError(null);
    setConvertedValue(null);
    setRate(null);
    setLastUpdated(null);

    try {
      await currencyApiService.convertCurrency({ value, from, to });
      const response = await currencyApiService.getLastRates({ base_currency: from, currencies: [to] });
      const fetchedRate = response.data[to]?.value;
      const fetchedLastUpdated = response.meta.last_updated_at;

      const converted = value * fetchedRate;

      setConvertedValue(converted);
      setRate(fetchedRate);
      setLastUpdated(fetchedLastUpdated);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Ocorreu um erro desconhecido.");
      }
    } finally {
      setLoading(false);
    }
  };

  const formatValue = (val: number) => val.toFixed(2);
  const formatDate = (dateStr: string) => new Date(dateStr).toLocaleString();

  return (
    <Card className="overflow-hidden mt-10">
      <CardContent className="p-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold tracking-tighter">Conversor de Moedas</h2>
              <p className="text-sm text-muted-foreground">Converta valores entre moedas</p>
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-green-500" />
                <input
                  type="number"
                  value={value}
                  onChange={(e) => setValue(Number(e.target.value))}
                  className="border p-2 rounded w-full"
                  placeholder="Valor"
                />
              </div>
              <div className="flex gap-2">
                <select
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  className="border p-2 rounded flex-1"
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="BRL">BRL</option>
                </select>
                <ArrowLeftRight className="h-6 w-6 text-muted-foreground" />
                <select
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  className="border p-2 rounded flex-1"
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="BRL">BRL</option>
                </select>
              </div>
              <button
                onClick={handleConvert}
                disabled={loading}
                className="bg-blue-500 text-white p-2 rounded"
              >
                {loading ? "Convertendo..." : "Converter"}
              </button>
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
          </div>
          <div className="flex flex-col items-center justify-center">
            {convertedValue !== null && (
              <div className="space-y-2 text-center">
                <p className="text-5xl font-bold tracking-tighter">
                  {formatValue(convertedValue)} {to}
                </p>
                <p className="text-sm font-medium text-muted-foreground">
                  Taxa: 1 {from} = {formatValue(rate ?? 0)} {to}
                </p>
                <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
                  <TrendingUp className="h-3 w-3" />
                  Atualizado em: {lastUpdated ? formatDate(lastUpdated) : "N/A"}
                </div>
              </div>
            )}
            {convertedValue === null && !error && !loading && (
              <p className="text-muted-foreground">Aguardando conversão...</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};