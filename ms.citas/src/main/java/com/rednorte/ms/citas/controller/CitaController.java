package com.rednorte.ms.citas.controller;

import com.rednorte.ms.citas.dto.CitaRequest;
import com.rednorte.ms.citas.dto.CitaResponse;
import com.rednorte.ms.citas.service.CitaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/citas")
@RequiredArgsConstructor
public class CitaController {

    private final CitaService citaService;

    @PostMapping
    public ResponseEntity<CitaResponse> crearCita(@RequestBody CitaRequest request) {
        return ResponseEntity.ok(citaService.crearCita(request));
    }

    @GetMapping
    public List<CitaResponse> listarCitas() {
        return citaService.listarCitas();
    }
}