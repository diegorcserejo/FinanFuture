package com.finanfuture.controller;

import com.finanfuture.model.ProjecaoRequest;
import com.finanfuture.model.ProjecaoResponse;
import com.finanfuture.service.AposentadoriaService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/aposentadoria")
@CrossOrigin(origins = "*") // Permite acesso do frontend
public class AposentadoriaController {

    @Autowired
    private AposentadoriaService aposentadoriaService;

    @PostMapping("/calcular")
    public ResponseEntity<ProjecaoResponse> calcularProjecao(@Valid @RequestBody ProjecaoRequest request) {
        
        // Validação adicional
        if (request.getIdadeAposentadoria() <= request.getIdadeAtual()) {
            throw new IllegalArgumentException("Idade de aposentadoria deve ser maior que idade atual");
        }
        
        ProjecaoResponse response = aposentadoriaService.calcularProjecao(request);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("API FinanFuture está rodando! 🚀");
    }
}