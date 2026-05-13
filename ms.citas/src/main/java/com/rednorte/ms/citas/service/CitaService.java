package com.rednorte.ms.citas.service;

import com.rednorte.ms.citas.dto.CitaRequest;
import com.rednorte.ms.citas.dto.CitaResponse;
import com.rednorte.ms.citas.model.Cita;
import com.rednorte.ms.citas.model.Doctor;
import com.rednorte.ms.citas.repository.CitaRepository;
import com.rednorte.ms.citas.repository.DoctorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CitaService {

    private final CitaRepository citaRepository;
    private final DoctorRepository doctorRepository;

    public CitaResponse crearCita(CitaRequest request) {

        Doctor doctor = doctorRepository.findById(request.getDoctorId())
                .orElseThrow(() -> new RuntimeException("Doctor no encontrado"));

        boolean existeCita = citaRepository.existsByDoctorIdAndFechaAndHora(
                request.getDoctorId(),
                request.getFecha(),
                request.getHora()
        );

        if (existeCita) {
            throw new RuntimeException("El doctor ya tiene una cita en ese horario");
        }

        Cita cita = Cita.builder()
                .paciente(request.getPaciente())
                .fecha(request.getFecha())
                .hora(request.getHora())
                .estado("PENDIENTE")
                .doctor(doctor)
                .build();

        Cita citaGuardada = citaRepository.save(cita);

        return CitaResponse.builder()
                .id(citaGuardada.getId())
                .paciente(citaGuardada.getPaciente())
                .fecha(citaGuardada.getFecha())
                .hora(citaGuardada.getHora())
                .estado(citaGuardada.getEstado())
                .doctorNombre(doctor.getNombre())
                .especialidad(doctor.getEspecialidad())
                .build();
    }
}