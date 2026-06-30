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

    private String rut;

    private String telefono;

    private String correo;

    private LocalDate fecha;

    private LocalTime hora;

    private String estado;

    private String tipo;

    private String prioridad;

    private String doctorNombre;

    // NUEVOS CAMPOS
    private String rutDoctor;

    private Long profesionId;

    private String profesion;
}