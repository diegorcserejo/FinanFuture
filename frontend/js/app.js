// Elementos DOM
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

// Spans
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

function atualizarLabels() {
    idadeAtualVal.innerText = idadeAtualSlider.value;
    idadeAposVal.innerText = idadeAposSlider.value;
    patrimonioAtualVal.innerText = formatMoney(Number(patrimonioSlider.value));
    aporteMensalVal.innerText = formatMoney(Number(aporteSlider.value));
    taxaJurosVal.innerText = taxaJurosSlider.value + '%';
    if(inflacaoSlider) inflacaoValSpan.innerText = inflacaoSlider.value + '%';
    
    // Adicionar efeito de vibração nos números
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

function calcularProjecao() {
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
        
        let patrimonioInicial = parseFloat(patrimonioSlider.value);
        let aporteMensal = parseFloat(aporteSlider.value);
        let taxaJurosAnual = parseFloat(taxaJurosSlider.value) / 100;
        let inflacaoAnual = 0;
        let modoAvancado = modoAvancadoCheck.checked;
        
        if(modoAvancado && inflacaoSlider) {
            inflacaoAnual = parseFloat(inflacaoSlider.value) / 100;
        }
        
        let aporteAnual = aporteMensal * 12;
        let patrimonio = patrimonioInicial;
        let anosArray = [];
        let idadesArray = [];
        let patrimonioArray = [];
        let aporteAcumulado = 0;
        let aportesPorAno = [];
        
        for(let ano = 1; ano <= anos; ano++) {
            patrimonio = patrimonio * (1 + taxaJurosAnual) + aporteAnual;
            aporteAcumulado += aporteAnual;
            
            let idadeCorrente = idadeAtual + ano;
            anosArray.push(idadeAtual + ano);
            idadesArray.push(idadeCorrente);
            patrimonioArray.push(patrimonio);
            aportesPorAno.push(aporteAnual);
        }
        
        let patrimonioRealArray = [];
        if(modoAvancado && inflacaoAnual > 0) {
            let fatorInflacaoAcum = 1;
            for(let i=0; i<patrimonioArray.length; i++) {
                fatorInflacaoAcum *= (1 + inflacaoAnual);
                let valorReal = patrimonioArray[i] / fatorInflacaoAcum;
                patrimonioRealArray.push(valorReal);
            }
        }
        
        const patrimonioFinal = patrimonio;
        const totalJuros = patrimonioFinal - patrimonioInicial - aporteAcumulado;
        
        patrimonioFinalSpan.innerText = formatMoney(patrimonioFinal);
        totalAportadoSpan.innerText = formatMoney(aporteAcumulado);
        jurosGanhosSpan.innerText = formatMoney(totalJuros);
        
        preencherTabela(anosArray, idadesArray, patrimonioArray, aportesPorAno, modoAvancado, patrimonioRealArray);
        desenharGrafico(anosArray, patrimonioArray, modoAvancado, patrimonioRealArray);
        
        // Feedback visual
        document.querySelector('.results-card').style.animation = 'none';
        setTimeout(() => {
            document.querySelector('.results-card').style.animation = 'slideRight 0.6s ease';
        }, 10);
        
    } catch(error) {
        console.error(error);
        alert("Erro no cálculo, verifique os parâmetros.");
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
    const linhas = [];
    const cabecalho = ['Ano', 'Idade', 'Patrimônio (R$)', 'Aporte anual (R$)'];
    const modoAvanc = modoAvancadoCheck.checked;
    if(modoAvanc) cabecalho.push('Patrimônio Real (R$)');
    linhas.push(cabecalho);
    
    const rows = tabelaCorpo.querySelectorAll('tr');
    for(let row of rows) {
        let linhaDados = [];
        for(let cell of row.cells) {
            linhaDados.push(cell.innerText.trim());
        }
        if(linhaDados.length) linhas.push(linhaDados);
    }
    const ws = XLSX.utils.aoa_to_sheet(linhas);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Projecao');
    XLSX.writeFile(wb, `projecao_${new Date().toISOString().slice(0,19)}.xlsx`);
}

btnCalcular.addEventListener('click', calcularProjecao);
btnExport.addEventListener('click', exportarCSV);

document.querySelectorAll('input[type="range"], input[type="radio"]').forEach(el => {
    el.addEventListener('input', () => { 
        if(el.id !== 'modoAvancado') calcularProjecao(); 
    });
});

atualizarLabels();
calcularProjecao();

// Menu mobile toggle
document.querySelector('.menu-toggle')?.addEventListener('click', () => {
    const navLinks = document.querySelector('.nav-links');
    navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
});