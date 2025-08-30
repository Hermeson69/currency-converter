import { ThemeProvider, useTheme } from "@/components/context/theme-provider";
import { Layout } from "@/components/layout/layout";
import { BrowserRouter } from "react-router-dom";
import { Home } from "./pages/home";

function App() {
   const { theme } = useTheme();
  const isLight = theme === "light";
  return (
    <BrowserRouter>
    <ThemeProvider defaultTheme="system">
      <Layout>
        <Home/>
      </Layout>
    </ThemeProvider>
    </BrowserRouter>

  )
}

export default App
