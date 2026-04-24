package com.finanfuture.model;

import java.util.List;

public class ProjecaoResponse {
    private List<AnoProjecao> projecaoAnual;
    private Double patrimonioFinal;
    private Double totalAportado;
    private Double jurosGanhos;
    private Integer anosTotais;

    public static class AnoProjecao {
        private Integer ano;
        private Integer idade;
        private Double patrimonio;
        private Double aporteAnual;
        private Double patrimonioReal;

        public AnoProjecao(Integer ano, Integer idade, Double patrimonio, Double aporteAnual, Double patrimonioReal) {
            this.ano = ano;
            this.idade = idade;
            this.patrimonio = patrimonio;
            this.aporteAnual = aporteAnual;
            this.patrimonioReal = patrimonioReal;
        }

        // Getters
        public Integer getAno() { return ano; }
        public Integer getIdade() { return idade; }
        public Double getPatrimonio() { return patrimonio; }
        public Double getAporteAnual() { return aporteAnual; }
        public Double getPatrimonioReal() { return patrimonioReal; }
    }

    public ProjecaoResponse(List<AnoProjecao> projecaoAnual, Double patrimonioFinal, 
                            Double totalAportado, Double jurosGanhos, Integer anosTotais) {
        this.projecaoAnual = projecaoAnual;
        this.patrimonioFinal = patrimonioFinal;
        this.totalAportado = totalAportado;
        this.jurosGanhos = jurosGanhos;
        this.anosTotais = anosTotais;
    }

    // Getters
    public List<AnoProjecao> getProjecaoAnual() { return projecaoAnual; }
    public Double getPatrimonioFinal() { return patrimonioFinal; }
    public Double getTotalAportado() { return totalAportado; }
    public Double getJurosGanhos() { return jurosGanhos; }
    public Integer getAnosTotais() { return anosTotais; }
}