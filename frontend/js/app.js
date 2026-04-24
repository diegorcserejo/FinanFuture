const idadeAtualSlider = document.getElementById('idadeAtual');
const idadeAposSlider = document.getElementById('idadeAposentadoria');
const patrimonioSlider = document.getElementById('patrimonioAtual');
const aporteSlider = document.getElementById('aporteMensal');
const taxaJurosSlider = document.getElementById('taxaJuros');
const modoAvancadoCheck = document.getElementById('modoAvancado');
const painelAvancado = document.getElementById('painelAvancado');
const inflacaoSlider = document.getElementById('inflacao');
const btnCalcular = document.getElementById('btnCalcular');
const btnExport = document.getElementById('btnExportCSV');

const idadeAtualVal = document.getElementById('idadeAtualVal');
const idadeAposVal = document.getElementById('idadeAposVal');
const patrimonioAtualVal = document.getElementById('patrimonioAtualVal');
const aporteMensalVal = document.getElementById('aporteMensalVal');
const taxaJurosVal = document.getElementById('taxaJurosVal');
const inflacaoValSpan = document.getElementById('inflacaoVal');

const patrimonioFinalSpan = document.getElementById('patrimonioFinal');
const totalAportadoSpan = document.getElementById('totalAportado');
const jurosGanhosSpan = document.getElementById('jurosGanhos');
const tabelaCorpo = document.getElementById('tabelaCorpo');

let grafico = null;
let dadosAtuais = { anosArray: [], idadesArray: [], patrimonioArray: [], aportesPorAno: [], patrimonioRealArray: [] };

// Configuração da API
const API_URL = 'http://localhost:8080/api/aposentadoria/calcular';

function atualizarLabels() {
    idadeAtualVal.innerText = idadeAtualSlider.value;
    idadeAposVal.innerText = idadeAposSlider.value;
    patrimonioAtualVal.innerText = formatMoney(Number(patrimonioSlider.value));
    aporteMensalVal.innerText = formatMoney(Number(aporteSlider.value));
    taxaJurosVal.innerText = taxaJurosSlider.value + '%';
    if(inflacaoSlider) inflacaoValSpan.innerText = inflacaoSlider.value + '%';
    
    document.querySelectorAll('.value-badge').forEach(badge => {
        badge.style.transform = 'scale(1.1)';
        setTimeout(() => badge.style.transform = 'scale(1)', 150);
    });
}

idadeAtualSlider.addEventListener('input', atualizarLabels);
idadeAposSlider.addEventListener('input', () => {
    if(Number(idadeAposSlider.value) <= Number(idadeAtualSlider.value)) {
        idadeAposSlider.value = Number(idadeAtualSlider.value) + 1;
    }
    atualizarLabels();
});
patrimonioSlider.addEventListener('input', atualizarLabels);
aporteSlider.addEventListener('input', atualizarLabels);
taxaJurosSlider.addEventListener('input', atualizarLabels);
if(inflacaoSlider) inflacaoSlider.addEventListener('input', atualizarLabels);

modoAvancadoCheck.addEventListener('change', (e) => {
    painelAvancado.style.display = e.target.checked ? 'block' : 'none';
    if(e.target.checked) {
        painelAvancado.style.animation = 'slideDown 0.5s ease';
    }
    calcularProjecao();
});

const radiosAtivo = document.querySelectorAll('input[name="classeAtivo"]');
radiosAtivo.forEach(radio => {
    radio.addEventListener('change', () => {
        if(modoAvancadoCheck.checked) aplicarTaxaPorClasse();
        calcularProjecao();
    });
});

function aplicarTaxaPorClasse() {
    const classe = document.querySelector('input[name="classeAtivo"]:checked').value;
    let taxa = 5.0;
    if(classe === 'conservador') taxa = 4.0;
    else if(classe === 'moderado') taxa = 6.0;
    else if(classe === 'arrojado') taxa = 9.0;
    taxaJurosSlider.value = taxa;
    taxaJurosVal.innerText = taxa + '%';
}

async function calcularProjecao() {
    try {
        let idadeAtual = parseInt(idadeAtualSlider.value);
        let idadeApos = parseInt(idadeAposSlider.value);
        
        if(idadeApos <= idadeAtual) {
            alert("Idade de aposentadoria deve ser maior que a idade atual.");
            idadeAposSlider.value = idadeAtual + 1;
            idadeApos = idadeAtual + 1;
            atualizarLabels();
        }
        
        const anos = idadeApos - idadeAtual;
        if(anos <= 0) return;
        
        // Mostrar loading no botão
        const textoOriginal = btnCalcular.innerHTML;
        btnCalcular.innerHTML = '⏳ Calculando...';
        btnCalcular.disabled = true;
        
        // Preparar dados para API
        const requestBody = {
            idadeAtual: idadeAtual,
            idadeAposentadoria: idadeApos,
            patrimonioAtual: parseFloat(patrimonioSlider.value),
            aporteMensal: parseFloat(aporteSlider.value),
            taxaJurosReal: parseFloat(taxaJurosSlider.value),
            modoAvancado: modoAvancadoCheck.checked,
            inflacao: modoAvancadoCheck.checked ? parseFloat(inflacaoSlider.value) : 0,
            classeAtivo: document.querySelector('input[name="classeAtivo"]:checked')?.value || 'moderado'
        };
        
        // Chamar API
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody)
        });
        
        if (!response.ok) {
            const errorData = await response.text();
            throw new Error(errorData || 'Erro na comunicação com o servidor');
        }
        
        const data = await response.json();
        
        // Processar dados recebidos da API
        const anosArray = [];
        const idadesArray = [];
        const patrimonioArray = [];
        const aportesPorAno = [];
        const patrimonioRealArray = [];
        
        data.projecaoAnual.forEach(item => {
            anosArray.push(item.idade);
            idadesArray.push(item.idade);
            patrimonioArray.push(item.patrimonio);
            aportesPorAno.push(item.aporteAnual);
            if (modoAvancadoCheck.checked && item.patrimonioReal) {
                patrimonioRealArray.push(item.patrimonioReal);
            }
        });
        
        // Armazenar dados para exportação
        dadosAtuais = {
            anosArray: anosArray,
            idadesArray: idadesArray,
            patrimonioArray: patrimonioArray,
            aportesPorAno: aportesPorAno,
            patrimonioRealArray: patrimonioRealArray
        };
        
        // Atualizar resumo
        patrimonioFinalSpan.innerText = formatMoney(data.patrimonioFinal);
        totalAportadoSpan.innerText = formatMoney(data.totalAportado);
        jurosGanhosSpan.innerText = formatMoney(data.jurosGanhos);
        
        // Preencher tabela
        preencherTabela(anosArray, idadesArray, patrimonioArray, aportesPorAno, modoAvancadoCheck.checked, patrimonioRealArray);
        
        // Desenhar gráfico
        desenharGrafico(anosArray, patrimonioArray, modoAvancadoCheck.checked, patrimonioRealArray);
        
        // Feedback visual
        document.querySelector('.results-card').style.animation = 'none';
        setTimeout(() => {
            document.querySelector('.results-card').style.animation = 'slideRight 0.6s ease';
        }, 10);
        
    } catch(error) {
        console.error('Erro detalhado:', error);
        
        // Mensagem de erro mais amigável
        let mensagemErro = "Erro ao calcular projeção.\n\n";
        if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
            mensagemErro += "Não foi possível conectar ao servidor backend.\n\n";
            mensagemErro += "Verifique se o Spring Boot está rodando em:\n";
            mensagemErro += "http://localhost:8080\n\n";
            mensagemErro += "Para iniciar o backend, execute:\n";
            mensagemErro += "cd backend && mvn spring-boot:run";
        } else if (error.message.includes('400')) {
            mensagemErro += "Dados inválidos. Verifique os parâmetros informados.";
        } else {
            mensagemErro += `${error.message}`;
        }
        
        alert(mensagemErro);
    } finally {
        // Restaurar botão
        btnCalcular.innerHTML = 'Calcular Projeção';
        btnCalcular.disabled = false;
    }
}

function preencherTabela(anos, idades, patrimonios, aportesAnuais, modoAvancado, patrimRealArr) {
    tabelaCorpo.innerHTML = '';
    for(let i = 0; i < anos.length; i++) {
        const row = tabelaCorpo.insertRow();
        let anoCorrente = new Date().getFullYear() + (i+1);
        let celAno = row.insertCell(0);
        let celIdade = row.insertCell(1);
        let celPat = row.insertCell(2);
        let celAporte = row.insertCell(3);
        
        celAno.innerText = anoCorrente;
        celIdade.innerText = idades[i];
        celPat.innerText = formatMoney(patrimonios[i]);
        celAporte.innerText = formatMoney(aportesAnuais[i]);
        
        if(modoAvancado && patrimRealArr && patrimRealArr[i] !== undefined) {
            let celReal = row.insertCell(4);
            celReal.innerText = formatMoney(patrimRealArr[i]);
            if(i===0) {
                let headerRow = document.querySelector('#tabelaResumo thead tr');
                if(headerRow.children.length < 5) {
                    let thReal = document.createElement('th');
                    thReal.innerText = 'Patrimônio Real';
                    headerRow.appendChild(thReal);
                }
            }
        } else if(!modoAvancado) {
            let thead = document.querySelector('#tabelaResumo thead tr');
            if(thead.children.length > 4) {
                while(thead.children.length > 4) thead.removeChild(thead.lastChild);
            }
            for(let r of tabelaCorpo.rows) {
                while(r.cells.length > 4) r.deleteCell(4);
            }
        }
    }
}

function desenharGrafico(anosLabels, valores, modoAvancado, valoresReais) {
    const ctx = document.getElementById('graficoEvolucao').getContext('2d');
    if(grafico) grafico.destroy();
    
    const datasets = [{
        label: 'Patrimônio Nominal',
        data: valores,
        borderColor: '#667eea',
        backgroundColor: 'rgba(102,126,234,0.1)',
        borderWidth: 3,
        tension: 0.4,
        fill: true,
        pointRadius: 4,
        pointHoverRadius: 8,
        pointBackgroundColor: '#764ba2'
    }];
    
    if(modoAvancado && valoresReais && valoresReais.length) {
        datasets.push({
            label: 'Patrimônio Real (poder de compra)',
            data: valoresReais,
            borderColor: '#f6ad55',
            backgroundColor: 'rgba(246,173,85,0.1)',
            borderWidth: 2,
            borderDash: [8, 4],
            tension: 0.4,
            fill: false,
            pointRadius: 3
        });
    }
    
    grafico = new Chart(ctx, {
        type: 'line',
        data: {
            labels: anosLabels.map((idade, idx) => `${new Date().getFullYear()+idx+1}`),
            datasets: datasets
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            animation: {
                duration: 1000,
                easing: 'easeInOutQuart'
            },
            plugins: {
                tooltip: { 
                    callbacks: { 
                        label: (ctx) => `${ctx.dataset.label}: ${formatMoney(ctx.raw)}` 
                    }
                },
                legend: { position: 'top' }
            }
        }
    });
}

function formatMoney(value) {
    return new Intl.NumberFormat('pt-BR', { 
        style: 'currency', 
        currency: 'BRL',
        minimumFractionDigits: 2 
    }).format(value);
}

function exportarCSV() {
    if (dadosAtuais.patrimonioArray.length === 0) {
        alert('Calcule uma projeção primeiro antes de exportar!');
        return;
    }
    
    const linhas = [];
    const cabecalho = ['Ano', 'Idade', 'Patrimônio (R$)', 'Aporte anual (R$)'];
    const modoAvanc = modoAvancadoCheck.checked;
    if(modoAvanc && dadosAtuais.patrimonioRealArray.length > 0) {
        cabecalho.push('Patrimônio Real (R$)');
    }
    linhas.push(cabecalho);
    
    for(let i = 0; i < dadosAtuais.patrimonioArray.length; i++) {
        const anoAtual = new Date().getFullYear() + (i+1);
        const linha = [
            anoAtual,
            dadosAtuais.idadesArray[i],
            dadosAtuais.patrimonioArray[i],
            dadosAtuais.aportesPorAno[i]
        ];
        if(modoAvanc && dadosAtuais.patrimonioRealArray[i] !== undefined) {
            linha.push(dadosAtuais.patrimonioRealArray[i]);
        }
        linhas.push(linha);
    }
    
    const ws = XLSX.utils.aoa_to_sheet(linhas);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Projecao_Aposentadoria');
    XLSX.writeFile(wb, `projecao_aposentadoria_${new Date().toISOString().slice(0,19)}.xlsx`);
}

// Event listeners
btnCalcular.addEventListener('click', calcularProjecao);
btnExport.addEventListener('click', exportarCSV);

// Auto-calcular quando sliders/radios mudarem (exceto modo avançado que já chama)
document.querySelectorAll('input[type="range"], input[type="radio"]').forEach(el => {
    el.addEventListener('input', () => { 
        if(el.id !== 'modoAvancado') calcularProjecao(); 
    });
});

// Inicialização
atualizarLabels();

// Tentar calcular ao carregar a página (se backend estiver rodando)
setTimeout(() => {
    calcularProjecao();
}, 100);

// Menu mobile toggle
document.querySelector('.menu-toggle')?.addEventListener('click', () => {
    const navLinks = document.querySelector('.nav-links');
    navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
});