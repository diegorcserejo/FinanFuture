package main.java.com.finanfuture;

import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/aposentadoria")
public class AposentadoriaController {

    @PostMapping("/projetar")
    public ProjecaoResponse projetar(@RequestBody ProjecaoRequest request) {
        int idadeAtual = request.idadeAtual;
        int idadeApos = request.idadeAposentadoria;
        double patrimonioInicial = request.patrimonioAtual;
        double aporteMensal = request.aporteMensal;
        double taxaJurosAnual = request.taxaJurosReal / 100.0;
        int anos = idadeApos - idadeAtual;

        double aporteAnual = aporteMensal * 12;
        double patrimonio = patrimonioInicial;
        List<Double> evolucao = new ArrayList<>();
        List<Integer> idades = new ArrayList<>();

        for (int i = 1; i <= anos; i++) {
            patrimonio = patrimonio * (1 + taxaJurosAnual) + aporteAnual;
            evolucao.add(patrimonio);
            idades.add(idadeAtual + i);
        }

        double totalAportado = aporteAnual * anos;
        double jurosGanhos = patrimonio - patrimonioInicial - totalAportado;

        return new ProjecaoResponse(evolucao, idades, patrimonio, totalAportado, jurosGanhos);
    }

    record ProjecaoRequest(int idadeAtual, int idadeAposentadoria, double patrimonioAtual, double aporteMensal, double taxaJurosReal) {}
    record ProjecaoResponse(List<Double> evolucaoPatrimonio, List<Integer> idades, double patrimonioFinal, double totalAportado, double jurosGanhos) {}
}