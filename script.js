const inputPesos = document.getElementById('pesos');
const selectMoneda = document.getElementById('moneda');
const btnConvertir = document.getElementById('convertir');
const resultado = document.getElementById('resultado');
const errorDiv = document.getElementById('error');
const ctx = document.getElementById('grafico').getContext('2d');

let chart;

btnConvertir.addEventListener('click', async () => {
    const pesos = parseFloat(inputPesos.value);
    const moneda = selectMoneda.value;

    if (!pesos || !moneda) {
    resultado.textContent = '...';
    errorDiv.textContent = 'Debes ingresar un monto válido y una moneda.';
    return;
    }

    try {
    errorDiv.textContent = '';
    const res = await fetch('https://mindicador.cl/api');
    const data = await res.json();

    const valorMoneda = data[moneda].valor;
    const conversion = (pesos / valorMoneda).toFixed(2);
    resultado.textContent = `Resultado: $${conversion}`;

    await mostrarGrafico(moneda);
    } catch (error) {
    errorDiv.textContent = 'Error al obtener datos. Intenta más tarde.';
    }
});

async function mostrarGrafico(moneda) {
    try {
    const res = await fetch(`https://mindicador.cl/api/${moneda}`);
    const data = await res.json();

    const ultimos10 = data.serie.slice(0, 10).reverse();
    const labels = ultimos10.map(item => new Date(item.fecha).toLocaleDateString());
    const valores = ultimos10.map(item => item.valor);

    if (chart) chart.destroy();

    chart = new Chart(ctx, {
        type: 'line',
        data: {
        labels,
        datasets: [{
            label: `Historial últimos 10 días (${moneda})`,
            data: valores,
            borderColor: '#FF4081',
            backgroundColor: 'rgba(255,64,129,0.1)',
            fill: true,
            tension: 0.3
        }]
        },
        options: {
        responsive: true,
        scales: {
            y: { beginAtZero: false }
        }
        }
    });
    } catch (err) {
    errorDiv.textContent = 'Error al generar el gráfico.';
    }
}
