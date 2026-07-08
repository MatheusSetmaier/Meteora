let grafico = null;

async function buscarClima() {

    const cidade = document
        .getElementById('cidade')
        .value
        .trim();

    if (!cidade) {
        alert('Digite uma cidade.');
        return;
    }

    try {

        const resposta = await fetch(`/weather/${cidade}`);
        const dados = await resposta.json();

        if (dados.erro) {
            alert(dados.erro);
            return;
        }

        document.getElementById('cidadeNome').textContent = dados.cidade;
        document.getElementById('temperatura').textContent = `${dados.temperatura}°C`;
        document.getElementById('condicao').textContent = dados.condicao;
        document.getElementById('sensacao').textContent = `Sensação térmica: ${dados.sensacao_termica}°C`;
        document.getElementById('umidade').textContent = `${dados.umidade}%`;
        document.getElementById('vento').textContent = `${dados.vento} km/h`;
        document.getElementById('pressao').textContent = `${dados.pressao} hPa`;
        document.getElementById('visibilidade').textContent = `${dados.visibilidade} km`;
        document.getElementById('iconeClima').textContent = obterIcone(dados.condicao);

        document.getElementById('horaAtual').textContent =
            new Date().toLocaleTimeString('pt-BR', {
                hour: '2-digit',
                minute: '2-digit'
            });

        const agora = new Date();
        const proximaHora = (agora.getHours() + 1) % 24;

        const indiceInicial = dados.previsao_horaria.findIndex(h =>
            parseInt(h.hora.split(':')[0]) === proximaHora
        );

        const previsaoFiltrada = [
            ...dados.previsao_horaria.slice(indiceInicial),
            ...dados.previsao_horaria.slice(0, indiceInicial)
        ];

        const previsaoHora = document.getElementById('previsaoHora');

        previsaoHora.innerHTML = '';

        previsaoFiltrada
            .slice(0, 12)
            .forEach(hora => {

                previsaoHora.innerHTML += `
                    <div class="hour-card">
                        <h4>${hora.hora}</h4>
                        <span>${obterIcone(hora.condicao)}</span>
                        <p>${hora.temperatura}°</p>
                    </div>
                `;

            });

        const horas = previsaoFiltrada
            .slice(0, 12)
            .map(h => h.hora);

        const temperaturas = previsaoFiltrada
            .slice(0, 12)
            .map(h => h.temperatura);

        if (grafico) {
            grafico.destroy();
        }

        const ctx = document
            .getElementById('graficoTemperatura')
            .getContext('2d');

        grafico = new Chart(ctx, {
            type: 'line',
            data: {
                labels: horas,
                datasets: [
                    {

                        data: temperaturas,
                        borderColor: '#5cc8ff',
                        backgroundColor: '#5cc8ff',
                        borderWidth: 3,
                        pointRadius: 3,
                        pointHoverRadius: 6,
                        tension: 0.4,
                        fill: false

                    }

                ]

            },

            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: {
                    duration: 800
                },

                plugins: {
                    legend: {
                        display: false
                    },

                    tooltip: {
                        backgroundColor: '#0b3b80',
                        titleColor: '#ffffff',
                        bodyColor: '#ffffff',
                        displayColors: false
                    }

                },

                scales: {

                    x: {

                        ticks: {

                            color: '#ffffff',

                            font: {
                                size: 12
                            }

                        },

                        grid: {
                            color: 'rgba(255,255,255,.10)'
                        },

                        border: {
                            color: '#ffffff'
                        }

                    },

                    y: {
                        beginAtZero: false,

                        ticks: {
                            color: '#ffffff',
                            font: {
                                size: 12
                            }
                        },

                        grid: {
                            color: 'rgba(255,255,255,.10)'
                        },

                        border: {
                            color: '#ffffff'
                        }
                    }
                }
            }
        });
    }

    catch (erro) {
        console.error(erro);
        alert('Erro ao buscar o clima.');
    }
}

document
    .getElementById('cidade')
    .addEventListener('keypress', function (event) {

        if (event.key === 'Enter') {
            buscarClima();
        }
    });

function obterIcone(condicao) {

    condicao = condicao.toLowerCase();

    if (condicao.includes('chuva')) return '🌧️';
    if (condicao.includes('nublado')) return '☁️';
    if (condicao.includes('neve')) return '❄️';
    if (condicao.includes('tempestade')) return '⛈️';

    return '☀️';
}