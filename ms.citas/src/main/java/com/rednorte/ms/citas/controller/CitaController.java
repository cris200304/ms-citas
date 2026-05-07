package com.rednorte.ms.citas.controller;

import com.rednorte.ms.citas.dto.CitaRequest;
import com.rednorte.ms.citas.dto.CitaResponse;
import com.rednorte.ms.citas.service.CitaService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/citas")
@RequiredArgsConstructor
public class CitaController {

    private final CitaService citaService;

    @PostMapping
    public CitaResponse crearCita(@RequestBody CitaRequest request) {
        return citaService.crearCita(request);
    }
}