package com.rednorte.ms.citas.dto;

import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CitaResponse {

    private Long id;

    private String paciente;

    private LocalDate fecha;

    private LocalTime hora;

    private String estado;

    private String doctorNombre;

    private String especialidad;
}