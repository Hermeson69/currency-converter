# Conversor de Moedas

## Descrição

Este é um conversor de moedas desenvolvido como parte de um desafio técnico. A aplicação permite converter valores entre moedas (USD, EUR, BRL) utilizando taxas de câmbio em tempo real obtidas de uma API pública (ex.: https://exchangerate.host/). Inclui uma interface web interativa com um formulário de conversão e um gráfico de tendências baseado nas taxas atuais. O projeto enfatiza organização de código, segurança de tipos com TypeScript e boas práticas de desenvolvimento web.

## Funcionalidades

- **Conversão de Moedas**: Insira um valor, selecione as moedas de origem e destino, e receba o valor convertido com a taxa atual e data de atualização.
- **Taxas em Tempo Real**: Busca taxas de câmbio via API pública.
- **Gráfico de Tendências**: Exibe um gráfico de linhas com taxas atuais replicadas ao longo de 7 dias.
- **Tratamento de Erros**: Exibe alertas para erros de API, moedas inválidas ou valores negativos.
- **Troca de Moedas**: Botão para inverter as moedas de origem e destino.

## Moedas Suportadas

- USD (Dólar Americano)
- EUR (Euro)
- BRL (Real Brasileiro)

As moedas são fixas para simplificar, mas podem ser expandidas com dados da API.

## Tecnologias e Ferramentas Utilizadas

### Stack Principal
- **Linguagem**: TypeScript (segurança de tipos e melhor experiência de desenvolvimento).
- **Framework**: React (interface e gerenciamento de estado).
- **Ferramenta de Build**: Vite (servidor de desenvolvimento rápido e build otimizado, configurado em `vite.config.ts`).
- **Runtime**: Node.js (v22+ recomendado).

### Dependências
- **Componentes UI**: shadcn/ui (componentes reutilizáveis como Card, Input, Select, Alert, Label).
- **Gráficos**: recharts (gráfico de linhas no `CurrencyHistoryChart`).
- **Ícones**: lucide-react (ícones como DollarSign, ArrowLeftRight, TrendingUp, X).
- **Manipulação de Datas**: date-fns (formatação de datas e subtração de dias no gráfico).
- **Serviço de API**: Axios ou Fetch (assumido em `currencyApiService` para requisições HTTP).

### Estrutura do Projeto
- `src/api/currency.ts`: Serviço de API para buscar taxas (ex.: `getLastRates`).
- `src/components/CurrencyConverter.tsx`: Componente principal com formulário e resultados.
- `src/components/CurrencyHistoryChart.tsx`: Componente do gráfico de tendências.
- `src/components/ui/*`: Componentes da shadcn/ui (ex.: Card, Input, Select).
- Configurações: `vite.config.ts`, `tsconfig.json`, `package.json`.

### Escolhas de Desenvolvimento
- **Integração com API**: Optou-se por usar uma API pública para taxas em tempo real, em vez de valores fixos, para adicionar realismo (diferencial).
- **Tratamento de Erros**: Incluiu alertas amigáveis para erros de API e validações (diferencial).
- **Interface**: Interface web com React para interatividade (diferencial).
- **Testes**: Adicionados testes unitários com Vitest (diferencial).
- **Gráfico**: Simplificado para exibir taxas atuais como tendência; poderia ser expandido para dados históricos reais.
- **Versionamento**: Commits claros e atômicos (ex.: "feat: adicionar componente conversor").

## Instalação e Execução

### Pré-requisitos
- Node.js (v18 ou superior).
- npm ou yarn como gerenciador de pacotes.

### Passos
1. Clone o repositório:

```bash
git clone https://github.com/Hermeson69/currency-converter.git
```

2. Vá até o projeto

```bash 
cd currency-converter
```

3. Iniciallize as Dependencias

```bash
npm install  # our npm i
yarn install
```

4. Vá até: ```bash https://app.currencyapi.com/ ``` cadastre-se e pegue sua chave da API

5. Crie um .env e coloque assim:

```env
VITE_CURRENCY_API_KEY= SUA_CHAVE_DA_API
```

6. Rode o programa

```bash
npm run dev # devido a config no vite.config.ts o server vai abrir automaticamente
```

## Melhorias Potenciais
- Adicionar mais moedas dinamicamente via API.
- Implementar busca de dados históricos reais para o gráfico.
- Fazer teste unitarios (já que é algo que não domino). 

MIT License

Copyright (c) 2025 Hermeson Alves de Olliveira