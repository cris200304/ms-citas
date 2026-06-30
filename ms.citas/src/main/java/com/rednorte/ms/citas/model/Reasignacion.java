package com.rednorte.ms.citas.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "reasignaciones")
public class Reasignacion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long citaId;

    private Long adminId;

    private String medicoAnterior;

    private String medicoNuevo;

    private LocalDateTime fechaAnterior;

    private LocalDateTime fechaNueva;

    private String motivoReasignacion;

    private String estado;

    // Constructor vacío requerido por JPA
    public Reasignacion() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getCitaId() {
        return citaId;
    }

    public void setCitaId(Long citaId) {
        this.citaId = citaId;
    }

    public Long getAdminId() {
        return adminId;
    }

    public void setAdminId(Long adminId) {
        this.adminId = adminId;
    }

    public String getMedicoAnterior() {
        return medicoAnterior;
    }

    public void setMedicoAnterior(String medicoAnterior) {
        this.medicoAnterior = medicoAnterior;
    }

    public String getMedicoNuevo() {
        return medicoNuevo;
    }

    public void setMedicoNuevo(String medicoNuevo) {
        this.medicoNuevo = medicoNuevo;
    }

    public LocalDateTime getFechaAnterior() {
        return fechaAnterior;
    }

    public void setFechaAnterior(LocalDateTime fechaAnterior) {
        this.fechaAnterior = fechaAnterior;
    }

    public LocalDateTime getFechaNueva() {
        return fechaNueva;
    }

    public void setFechaNueva(LocalDateTime fechaNueva) {
        this.fechaNueva = fechaNueva;
    }

    public String getMotivoReasignacion() {
        return motivoReasignacion;
    }

    public void setMotivoReasignacion(String motivoReasignacion) {
        this.motivoReasignacion = motivoReasignacion;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }
}