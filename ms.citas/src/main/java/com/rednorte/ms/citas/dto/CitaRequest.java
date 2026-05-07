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

    private LocalDate fecha;

    private LocalTime hora;

    private Long doctorId;
}