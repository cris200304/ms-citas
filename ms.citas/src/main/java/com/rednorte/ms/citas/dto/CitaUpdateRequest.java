package com.rednorte.ms.citas.dto;

import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CitaUpdateRequest {

    private String rutDoctor;

    private Long profesionId;

    private String tipo;

    private String prioridad;

    private String estado;

    private LocalDate fecha;

    private LocalTime hora;
}