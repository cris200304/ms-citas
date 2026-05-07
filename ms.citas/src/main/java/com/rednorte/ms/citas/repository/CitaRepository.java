package com.rednorte.ms.citas.repository;

import com.rednorte.ms.citas.model.Cita;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CitaRepository extends JpaRepository<Cita, Long> {
}