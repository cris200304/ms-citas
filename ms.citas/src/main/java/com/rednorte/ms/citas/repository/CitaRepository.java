package com.rednorte.ms.citas.repository;

import com.rednorte.ms.citas.enums.EstadoCita;
import com.rednorte.ms.citas.enums.PrioridadCita;
import com.rednorte.ms.citas.model.Cita;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public interface CitaRepository extends JpaRepository<Cita, Long> {

    boolean existsByDoctor_IdAndFechaAndHora(
            Long doctorId,
            LocalDate fecha,
            LocalTime hora
    );

    List<Cita> findByRut(String rut);

    List<Cita> findByEstado(EstadoCita estado);

    List<Cita> findByPrioridad(PrioridadCita prioridad);

    // NUEVO MÉTODO
    List<Cita> findByDoctor_RutAndFecha(
            String rutDoctor,
            LocalDate fecha
    );
}
