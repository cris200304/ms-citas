package com.rednorte.ms.citas.repository;

import com.rednorte.ms.citas.model.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DoctorRepository extends JpaRepository<Doctor, Long> {
}