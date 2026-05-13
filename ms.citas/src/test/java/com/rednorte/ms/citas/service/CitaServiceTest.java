package com.rednorte.ms.citas.service;

import com.rednorte.ms.citas.dto.CitaRequest;
import com.rednorte.ms.citas.dto.CitaResponse;
import com.rednorte.ms.citas.model.Cita;
import com.rednorte.ms.citas.model.Doctor;
import com.rednorte.ms.citas.repository.CitaRepository;
import com.rednorte.ms.citas.repository.DoctorRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CitaServiceTest {

    @Mock
    private CitaRepository citaRepository;

    @Mock
    private DoctorRepository doctorRepository;

    @InjectMocks
    private CitaService citaService;

    @Test
    void crearCita_deberiaCrearCitaCorrectamente() {

        Doctor doctor = Doctor.builder()
                .id(1L)
                .nombre("Ingrid Calderon")
                .especialidad("Cardiología")
                .build();

        CitaRequest request = new CitaRequest();
        request.setPaciente("Cristian Cerda");
        request.setFecha(LocalDate.of(2026, 5, 20));
        request.setHora(LocalTime.of(9, 0));
        request.setDoctorId(1L);

        Cita citaGuardada = Cita.builder()
                .id(1L)
                .paciente(request.getPaciente())
                .fecha(request.getFecha())
                .hora(request.getHora())
                .estado("PENDIENTE")
                .doctor(doctor)
                .build();

        when(doctorRepository.findById(1L)).thenReturn(Optional.of(doctor));
        when(citaRepository.existsByDoctorIdAndFechaAndHora(
                1L,
                request.getFecha(),
                request.getHora()
        )).thenReturn(false);

        when(citaRepository.save(any(Cita.class))).thenReturn(citaGuardada);

        CitaResponse response = citaService.crearCita(request);

        assertNotNull(response);
        assertEquals("Cristian Cerda", response.getPaciente());
        assertEquals("PENDIENTE", response.getEstado());

        verify(citaRepository, times(1)).save(any(Cita.class));
    }

    @Test
    void crearCita_deberiaLanzarErrorSiHorarioEstaOcupado() {

        Doctor doctor = Doctor.builder()
                .id(1L)
                .nombre("Ingrid Calderon")
                .especialidad("Cardiología")
                .build();

        CitaRequest request = new CitaRequest();
        request.setPaciente("Cristian Cerda");
        request.setFecha(LocalDate.of(2026, 5, 20));
        request.setHora(LocalTime.of(9, 0));
        request.setDoctorId(1L);

        when(doctorRepository.findById(1L)).thenReturn(Optional.of(doctor));

        when(citaRepository.existsByDoctorIdAndFechaAndHora(
                1L,
                request.getFecha(),
                request.getHora()
        )).thenReturn(true);

        RuntimeException exception = assertThrows(
                RuntimeException.class,
                () -> citaService.crearCita(request)
        );

        assertEquals(
                "El doctor ya tiene una cita en ese horario",
                exception.getMessage()
        );

        verify(citaRepository, never()).save(any(Cita.class));
    }
}