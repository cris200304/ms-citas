package com.rednorte.ms.citas.repository;

import com.rednorte.ms.citas.model.Reasignacion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReasignacionRepository extends JpaRepository<Reasignacion, Long> {

    List<Reasignacion> findByEstado(String estado);

    List<Reasignacion> findByAdminId(Long adminId);

}