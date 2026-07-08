## Meteora

É uma aplicação web desenvolvida em Python com FastAPI que consulta dados meteorológicos em tempo real utilizando a Visual Crossing Weather API. A aplicação utiliza Redis para armazenar consultas em cache, reduzindo o tempo de resposta e o número de requisições externas.

Funcionalidades

- Consulta de clima por cidade
- Temperatura atual
- Sensação térmica
- Umidade do ar
- Condição climática

Tecnologias

- Python
- FastAPI
- Redis
- Docker
- Docker Compose
- HTML5
- CSS3
- JavaScript
- Render

Demonstração

https://meteoraapi-0tct.onrender.com

Pré-requisitos

- Git
- Docker Desktop

Instalação

1 - Crie uma conta em https://www.visualcrossing.com/ e obtenha uma key da API

2 - Clone o repositório

```bash
git clone https://github.com/MatheusSetmaier/Meteora.git

cd Meteora
```

3 - Configurar as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto contendo:

```env
WEATHER_API_KEY = //chave da API
REDIS_HOST = localhost
REDIS_PORT = 6379
```

4 - Iniciar a aplicação

Execute:

```bash
docker compose up --build
```

Após a inicialização, acesse:

```
http://localhost:8000
```
