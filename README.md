# FinanFuture - Simulador de Aposentadoria

![Versão](https://img.shields.io/badge/version-1.0.0-blue)
![Java](https://img.shields.io/badge/Java-17-orange)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.1.5-green)
![Vue.js](https://img.shields.io/badge/Vue.js-3.x-brightgreen)
![License](https://img.shields.io/badge/license-MIT-lightgrey)

## Sobre o Projeto

O FinanFuture é uma aplicação para planejamento de aposentadoria que integra um backend em Java com Spring Boot e um frontend interativo. A solução permite calcular projeções financeiras com base em juros compostos, inflação e diferentes perfis de investimento.

## Funcionalidades

* Simulador com cálculo de juros compostos
* Visualização gráfica da evolução patrimonial
* Modo avançado com inclusão de inflação e classes de ativos
* Exportação de resultados em formato CSV
* Interface responsiva compatível com dispositivos móveis
* Conteúdo de educação financeira integrado
* Sugestões e estratégias de investimento

## Perfis de Investimento

| Perfil      | Taxa Real Anual | Descrição                        |
| ----------- | --------------- | -------------------------------- |
| Conservador | 4%              | Foco em renda fixa e baixo risco |
| Moderado    | 6%              | Carteira diversificada           |
| Arrojado    | 9%              | Maior exposição a renda variável |

## Arquitetura do Projeto

```
FinanFuture/
├── backend/
│   ├── pom.xml
│   └── src/
│       └── main/
│           └── java/
│               └── com/
│                   └── finanfuture/
│                       ├── FinanfutureApplication.java
│                       ├── controller/
│                       │   └── AposentadoriaController.java
│                       ├── service/
│                       │   └── AposentadoriaService.java
│                       ├── model/
│                       │   ├── ProjecaoRequest.java
│                       │   └── ProjecaoResponse.java
│                       └── config/
│                           └── WebConfig.java
├── frontend/
│   ├── index.html
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   └── app.js
│   └── pages/
│       ├── educacao.html
│       └── dicas.html
└── README.md

## Tecnologias Utilizadas

### Backend

* Java 17
* Spring Boot 3.1.5
* Maven
* SpringDoc OpenAPI (Swagger)

### Frontend

* Vue.js 3
* Chart.js
* SheetJS
* CSS3

## Pré-requisitos

### Backend

* Java JDK 17 ou superior
* Maven 3.8 ou superior

### Frontend

* Navegador moderno (Chrome, Firefox, Edge)
* Live Server (opcional)

### Verificação de Ambiente

```bash
java -version
javac -version
mvn --version
```

## Instalação e Execução

### 1. Clonar o repositório

```bash
git clone https://github.com/seu-usuario/FinanFuture.git
cd FinanFuture
```

### 2. Executar o Backend

```bash
cd backend

mvn spring-boot:run

# ou (Windows)
.\mvnw.cmd spring-boot:run

# ou (Linux/Mac)
./mvnw spring-boot:run
```

A API estará disponível em:
[http://localhost:8080](http://localhost:8080)

### 3. Executar o Frontend

```bash
cd frontend

npx live-server

# ou
python -m http.server 8000
```

Acesse:
[http://localhost:8080](http://localhost:8080) (ou a porta configurada)

## Endpoints da API

### POST /api/aposentadoria/calcular

Realiza o cálculo da projeção de aposentadoria.

#### Request

```json
{
  "idadeAtual": 30,
  "idadeAposentadoria": 60,
  "patrimonioAtual": 50000,
  "aporteMensal": 1000,
  "taxaJurosReal": 5.0,
  "modoAvancado": true,
  "inflacao": 3.0,
  "classeAtivo": "moderado"
}
```

#### Response

```json
{
  "projecaoAnual": [
    {
      "ano": 2025,
      "idade": 31,
      "patrimonio": 65400.00,
      "aporteAnual": 12000,
      "patrimonioReal": 63500.00
    }
  ],
  "patrimonioFinal": 1250000.00,
  "totalAportado": 360000.00,
  "jurosGanhos": 840000.00,
  "anosTotais": 30
}
```

### GET /api/aposentadoria/health

Verifica o status da aplicação.

## Uso da Aplicação

### Simulação Básica

1. Informar:

   * Idade atual
   * Idade de aposentadoria
   * Patrimônio atual
   * Aporte mensal
   * Taxa de juros

2. Executar o cálculo

3. Visualizar:

   * Gráfico de evolução patrimonial
   * Tabela detalhada
   * Resumo financeiro

### Modo Avançado

* Ativar a opção de modo avançado
* Informar a inflação média
* Selecionar o perfil de investimento

### Exportação

Permite exportar os resultados em formato CSV para análise externa.

## Teste da API com cURL

```bash
curl http://localhost:8080/api/aposentadoria/health

curl -X POST http://localhost:8080/api/aposentadoria/calcular \
  -H "Content-Type: application/json" \
  -d '{
    "idadeAtual": 30,
    "idadeAposentadoria": 60,
    "patrimonioAtual": 50000,
    "aporteMensal": 1000,
    "taxaJurosReal": 5.0,
    "modoAvancado": false
  }'
```

## Documentação da API

Disponível em:

[http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)

