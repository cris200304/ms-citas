package com.rednorte.ms.citas.exception;

public class DoctorNoEncontradoException extends RuntimeException {

    public DoctorNoEncontradoException(String mensaje) {
        super(mensaje);
    }
}