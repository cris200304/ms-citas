package com.rednorte.ms.citas.controller;

import com.rednorte.ms.citas.dto.CitaRequest;
import com.rednorte.ms.citas.dto.CitaResponse;
import com.rednorte.ms.citas.dto.CitaUpdateRequest;
import com.rednorte.ms.citas.service.CitaService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
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
    public List<CitaResponse> listarTodas() {
        return citaService.listarTodasLasCitas();
    }

    @GetMapping("/rut/{rut}")
    public List<CitaResponse> buscarPorRut(@PathVariable String rut) {
        return citaService.buscarCitasPorRut(rut);
    }

    @PutMapping("/{id}")
    public CitaResponse actualizarCita(
            @PathVariable Long id,
            @RequestBody CitaUpdateRequest request
    ) {
        return citaService.actualizarCita(id, request);
    }

    @GetMapping("/disponibles")
    public List<String> obtenerHorasDisponibles(
            @RequestParam String rutDoctor,
            @RequestParam LocalDate fecha
    ) {
        return citaService.obtenerHorasDisponibles(rutDoctor, fecha);
    }

    @GetMapping("/ping")
    public String ping() {
        return "ms-citas OK";
    }
}