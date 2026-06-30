package com.rednorte.ms.citas.dto;

import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CitaRequest {

    private String paciente;

    private String rut;

    private String telefono;

    private String correo;

    private LocalDate fecha;

    private LocalTime hora;

    private String tipo;

    private String prioridad;

    // NUEVOS CAMPOS
    private String rutDoctor;

    private Long profesionId;
}