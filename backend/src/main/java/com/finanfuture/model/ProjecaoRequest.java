package com.finanfuture.model;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public class ProjecaoRequest {
    
    @NotNull(message = "Idade atual é obrigatória")
    @Min(value = 18, message = "Idade mínima é 18 anos")
    private Integer idadeAtual;
    
    @NotNull(message = "Idade de aposentadoria é obrigatória")
    @Min(value = 40, message = "Idade de aposentadoria mínima é 40 anos")
    private Integer idadeAposentadoria;
    
    @NotNull(message = "Patrimônio atual é obrigatório")
    @Min(value = 0, message = "Patrimônio não pode ser negativo")
    private Double patrimonioAtual;
    
    @NotNull(message = "Aporte mensal é obrigatório")
    @Min(value = 0, message = "Aporte mensal não pode ser negativo")
    private Double aporteMensal;
    
    @NotNull(message = "Taxa de juros é obrigatória")
    private Double taxaJurosReal;
    
    private Boolean modoAvancado = false;
    private Double inflacao = 0.0;
    private String classeAtivo = "moderado";

    // Getters e Setters
    public Integer getIdadeAtual() { return idadeAtual; }
    public void setIdadeAtual(Integer idadeAtual) { this.idadeAtual = idadeAtual; }
    
    public Integer getIdadeAposentadoria() { return idadeAposentadoria; }
    public void setIdadeAposentadoria(Integer idadeAposentadoria) { this.idadeAposentadoria = idadeAposentadoria; }
    
    public Double getPatrimonioAtual() { return patrimonioAtual; }
    public void setPatrimonioAtual(Double patrimonioAtual) { this.patrimonioAtual = patrimonioAtual; }
    
    public Double getAporteMensal() { return aporteMensal; }
    public void setAporteMensal(Double aporteMensal) { this.aporteMensal = aporteMensal; }
    
    public Double getTaxaJurosReal() { return taxaJurosReal; }
    public void setTaxaJurosReal(Double taxaJurosReal) { this.taxaJurosReal = taxaJurosReal; }
    
    public Boolean getModoAvancado() { return modoAvancado; }
    public void setModoAvancado(Boolean modoAvancado) { this.modoAvancado = modoAvancado; }
    
    public Double getInflacao() { return inflacao; }
    public void setInflacao(Double inflacao) { this.inflacao = inflacao; }
    
    public String getClasseAtivo() { return classeAtivo; }
    public void setClasseAtivo(String classeAtivo) { this.classeAtivo = classeAtivo; }
}