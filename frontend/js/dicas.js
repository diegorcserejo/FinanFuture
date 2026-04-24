function showTipDetail(tip) {
    const titles = {
        'comece-hoje': 'Comece hoje, não amanhã',
        'aporte-consistente': 'Aporte consistente > timing perfeito',
        'revise-gastos': 'Revise seus gastos anualmente',
        'diversifique': 'Diversifique seus investimentos',
        'reserva-emergencia': 'Reserva de emergência'
    };
    alert(` Dica: ${titles[tip]}\n\nEm breve mais detalhes sobre esta estratégia!`);
}

document.querySelector('.menu-toggle')?.addEventListener('click', () => {
    const navLinks = document.querySelector('.nav-links');
    navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
});
