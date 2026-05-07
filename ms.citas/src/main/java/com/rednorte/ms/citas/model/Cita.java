package com.rednorte.ms.citas.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "citas")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Cita {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String paciente;

    private LocalDate fecha;

    private LocalTime hora;

    private String estado;

    @ManyToOne
    @JoinColumn(name = "doctor_id")
    private Doctor doctor;
}