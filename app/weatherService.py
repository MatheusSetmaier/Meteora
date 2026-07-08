import os
import json
import requests
from dotenv import load_dotenv
from app.redisClient import redis_client

load_dotenv()

API_KEY = os.getenv('WEATHER_API_KEY')

def get_weather(cidade: str):

    cidade = cidade.strip().lower()

    cache = redis_client.get(cidade)

    if cache:
        print('Dados retirados do cache')
        return json.loads(cache)

    print('Dados retirados da API')

    url = (
        f'https://weather.visualcrossing.com/'
        f'VisualCrossingWebServices/rest/services/timeline/'
        f'{cidade}?unitGroup=metric&key={API_KEY}'
    )

    response = requests.get(url)

    try:
        dados = response.json()
    except Exception:
        return {
            'erro': 'Cidade não encontrada'
        }

    traducao = {
        'Overcast': 'Nublado',
        'Clear': 'Céu limpo',
        'Partially cloudy': 'Parcialmente nublado',
        'Rain': 'Chuva',
        'Snow': 'Neve'
    }

    resultado = {
        'cidade': dados['resolvedAddress'].title(),
        'temperatura': dados['currentConditions']['temp'],
        'sensacao_termica': dados['currentConditions']['feelslike'],
        'umidade': dados['currentConditions']['humidity'],
        'vento': dados['currentConditions']['windspeed'],
        'pressao': dados['currentConditions']['pressure'],
        'visibilidade': dados['currentConditions']['visibility'],
        'condicao': traducao.get(
            dados['currentConditions']['conditions'],
            dados['currentConditions']['conditions']
    ),

    'previsao_horaria': [
        {
            'hora': hora['datetime'][:5],
            'temperatura': hora['temp'],
            'condicao': traducao.get(
                hora['conditions'],
                hora['conditions']
            )
        }

        for hora in dados['days'][0]['hours']

    ],

    'previsao_5_dias': [
        {
            'data': dia['datetime'],
            'temp_max': dia['tempmax'],
            'temp_min': dia['tempmin'],
            'condicao': traducao.get(
                dia['conditions'],
                dia['conditions']
            )
        }
        for dia in dados['days'][:5]
    ]
}

    redis_client.set(
        cidade,
        json.dumps(resultado),
        ex = 43200
    )

    return resultado