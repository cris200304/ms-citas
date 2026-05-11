package com.rednorte.ms.citas.controller;

import com.rednorte.ms.citas.dto.CitaRequest;
import com.rednorte.ms.citas.dto.CitaResponse;
import com.rednorte.ms.citas.service.CitaService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/citas")
@RequiredArgsConstructor
public class CitaController {

    private final CitaService citaService;

    @PostMapping
    public CitaResponse crearCita(@RequestBody CitaRequest request) {
        return citaService.crearCita(request);
    }

    @GetMapping
    public List<CitaResponse> listarCitas() {
        return citaService.listarCitas();
    }

    @PatchMapping("/{id}/estado")
    public CitaResponse actualizarEstado(
            @PathVariable Long id,
            @RequestParam String estado
    ) {
        return citaService.actualizarEstado(id, estado);
    }

    @DeleteMapping("/{id}")
    public String eliminarCita(@PathVariable Long id) {
        citaService.eliminarCita(id);
        return "Cita eliminada correctamente";
    }
}