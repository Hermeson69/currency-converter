import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeftRight, DollarSign, TrendingUp, X } from "lucide-react";
import { currencyApiService } from "@/api/currency";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem } from "./ui/select";
import { SelectTrigger } from "@radix-ui/react-select";
import { Label } from "./ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

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
      const response = await currencyApiService.getLastRates({
        base_currency: from,
        currencies: [to],
      });
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

  const formatValue = (val: number) => val.toFixed(1);
  const formatDate = (dateStr: string) => new Date(dateStr).toLocaleString();

  return (
    <>
      {error && (
        <div className="fixed top-2 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4">
          <Alert variant="destructive" className="relative">
            <button
              onClick={() => setError(null)}
              className="absolute top-2 right-2 text-muted-foreground hover:text-red-500"
              aria-label="Fechar alerta"
              type="button"
            >
              <X className="w-4 h-4" />
            </button>
            <AlertTitle>Erro</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      )}
      <Card className="overflow-hidden mt-10">
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl font-bold tracking-tighter">
            Conversor de Moedas
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            Converta valores entre moedas
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div className="flex flex-col gap-4">
                <Label className="text-lg text-muted-foreground">
                  <DollarSign className="h-5 w-5 text-green-500" /> Valor:
                </Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    value={value}
                    onChange={(e) => setValue(Number(e.target.value))}
                    className="border p-2 rounded w-full"
                    placeholder="Valor"
                  />
                </div>
                <div className="flex gap-2">
                  <Select value={from} onValueChange={setFrom}>
                    <SelectTrigger className="w-[120px] border p-2 rounded flex-1">
                      {from}
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="EUR">EUR</SelectItem>
                      <SelectItem value="BRL">BRL</SelectItem>
                    </SelectContent>
                  </Select>
                  <ArrowLeftRight
                    className="h-6 w-6 text-muted-foreground mt-2 cursor-pointer"
                    onClick={() => {
                      setFrom(to);
                      setTo(from);
                      setConvertedValue(null);
                      setRate(null);
                      setLastUpdated(null);
                    }}
                  />
                  <Select value={to} onValueChange={setTo}>
                    <SelectTrigger className="w-[120px] border p-2 rounded flex-1">
                      {to}
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="EUR">EUR</SelectItem>
                      <SelectItem value="BRL">BRL</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <button
                  onClick={handleConvert}
                  disabled={loading}
                  className="bg-blue-500 text-white p-2 rounded"
                >
                  {loading ? "Convertendo..." : "Converter"}
                </button>
              </div>
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
    </>
  );
};
