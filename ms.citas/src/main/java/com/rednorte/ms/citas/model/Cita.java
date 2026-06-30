package com.rednorte.ms.citas.model;

import com.rednorte.ms.citas.enums.EstadoCita;
import com.rednorte.ms.citas.enums.PrioridadCita;
import com.rednorte.ms.citas.enums.TipoAtencion;
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

    private String rut;

    private String telefono;

    private String correo;

    private LocalDate fecha;

    private LocalTime hora;

    @Enumerated(EnumType.STRING)
    private EstadoCita estado;

    @Enumerated(EnumType.STRING)
    private TipoAtencion tipo;

    @Enumerated(EnumType.STRING)
    private PrioridadCita prioridad;

    @ManyToOne
    @JoinColumn(name = "doctor_id")
    private Doctor doctor;

    @ManyToOne
    @JoinColumn(name = "profesion_id")
    private Profesion profesion;
}