import { CurrencyHistoryChart } from "@/components/CurrecyGraph"
import { CurrencyConverter } from "@/components/CurrencyConverter"

export const Home = () =>{
    return(
        <>
        <CurrencyConverter/>
        <CurrencyHistoryChart days={29}/>
        </>
    )
}