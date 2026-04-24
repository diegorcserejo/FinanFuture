package com.finanfuture.service;


import com.finanfuture.model.ProjecaoRequest;
import com.finanfuture.model.ProjecaoResponse;
import org.springframework.stereotype.Service;

import java.time.Year;
import java.util.ArrayList;
import java.util.List;

@Service
public class AposentadoriaService {

    public ProjecaoResponse calcularProjecao(ProjecaoRequest request) {
        
        int idadeAtual = request.getIdadeAtual();
        int idadeAposentadoria = request.getIdadeAposentadoria();
        double patrimonioInicial = request.getPatrimonioAtual();
        double aporteMensal = request.getAporteMensal();
        double taxaJuros = request.getTaxaJurosReal() / 100.0;
        
        int anos = idadeAposentadoria - idadeAtual;
        double aporteAnual = aporteMensal * 12;
        
        double patrimonio = patrimonioInicial;
        double aporteAcumulado = 0;
        
        List<ProjecaoResponse.AnoProjecao> projecaoList = new ArrayList<>();
        
        double inflacaoAnual = 0;
        if (request.getModoAvancado() && request.getInflacao() != null) {
            inflacaoAnual = request.getInflacao() / 100.0;
        }
        
        double fatorInflacaoAcum = 1;
        int anoAtual = Year.now().getValue();
        
        for (int i = 1; i <= anos; i++) {
            // Fórmula de juros compostos com aporte anual
            patrimonio = patrimonio * (1 + taxaJuros) + aporteAnual;
            aporteAcumulado += aporteAnual;
            
            // Valor real ajustado pela inflação
            double patrimonioReal = patrimonio;
            if (request.getModoAvancado() && inflacaoAnual > 0) {
                fatorInflacaoAcum *= (1 + inflacaoAnual);
                patrimonioReal = patrimonio / fatorInflacaoAcum;
            }
            
            projecaoList.add(new ProjecaoResponse.AnoProjecao(
                anoAtual + i,
                idadeAtual + i,
                Math.round(patrimonio * 100.0) / 100.0,
                Math.round(aporteAnual * 100.0) / 100.0,
                Math.round(patrimonioReal * 100.0) / 100.0
            ));
        }
        
        double totalJuros = patrimonio - patrimonioInicial - aporteAcumulado;
        
        return new ProjecaoResponse(
            projecaoList,
            Math.round(patrimonio * 100.0) / 100.0,
            Math.round(aporteAcumulado * 100.0) / 100.0,
            Math.round(totalJuros * 100.0) / 100.0,
            anos
        );
    }
}