package com.rednorte.ms.citas.repository;

import com.rednorte.ms.citas.model.Cita;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.time.LocalTime;

public interface CitaRepository extends JpaRepository<Cita, Long> {

    boolean existsByDoctorIdAndFechaAndHora(
            Long doctorId,
            LocalDate fecha,
            LocalTime hora
    );
}