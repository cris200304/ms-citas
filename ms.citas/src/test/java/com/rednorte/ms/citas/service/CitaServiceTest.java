package com.rednorte.ms.citas.service;

import com.rednorte.ms.citas.dto.CitaRequest;
import com.rednorte.ms.citas.dto.CitaResponse;
import com.rednorte.ms.citas.enums.EstadoCita;
import com.rednorte.ms.citas.enums.PrioridadCita;
import com.rednorte.ms.citas.enums.TipoAtencion;
import com.rednorte.ms.citas.exception.CitaDuplicadaException;
import com.rednorte.ms.citas.model.Cita;
import com.rednorte.ms.citas.model.Doctor;
import com.rednorte.ms.citas.model.Profesion;
import com.rednorte.ms.citas.repository.CitaRepository;
import com.rednorte.ms.citas.repository.DoctorRepository;
import com.rednorte.ms.citas.repository.ProfesionRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CitaServiceTest {

    @Mock
    private CitaRepository citaRepository;

    @Mock
    private DoctorRepository doctorRepository;

    @Mock
    private ProfesionRepository profesionRepository;

    @InjectMocks
    private CitaService citaService;

    @Test
    void crearCita_deberiaCrearCitaCorrectamente() {

        LocalDate fechaValida = obtenerProximoDiaHabil();

        Profesion profesion = Profesion.builder()
                .id(1L)
                .nombre("Cardiología")
                .build();

        Doctor doctor = Doctor.builder()
                .id(1L)
                .rut("11111111-1")
                .nombre("Ingrid Calderon")
                .profesiones(Set.of(profesion))
                .build();
        /*Primero se crean objetos simulados que representan la información
         que normalmente vendría desde la base de datos.*/

        CitaRequest request = CitaRequest.builder()
                .paciente("Cristian Cerda")
                .rut("22222222-2")
                .telefono("912345678")
                .correo("cristian@correo.cl")
                .fecha(fechaValida)
                .hora(LocalTime.of(9, 0))
                .tipo("CONSULTA_MEDICA")
                .prioridad("BAJA")
                .rutDoctor("11111111-1")
                .profesionId(1L)
                .build();
        /*Luego se construye la solicitud exactamente igual
        a como llegaría desde el Frontend mediante una petición HTTP.*/

        Cita citaGuardada = Cita.builder()
                .id(1L)
                .paciente(request.getPaciente())
                .rut(request.getRut())
                .telefono(request.getTelefono())
                .correo(request.getCorreo())
                .fecha(request.getFecha())
                .hora(request.getHora())
                .tipo(TipoAtencion.CONSULTA_MEDICA)
                .prioridad(PrioridadCita.BAJA)
                .estado(EstadoCita.PENDIENTE)
                .doctor(doctor)
                .profesion(profesion)
                .build();

        when(doctorRepository.findByRut("11111111-1")).thenReturn(Optional.of(doctor));
        when(profesionRepository.findById(1L)).thenReturn(Optional.of(profesion));
        when(citaRepository.existsByDoctor_IdAndFechaAndHora(
                doctor.getId(),
                request.getFecha(),
                request.getHora()
        )).thenReturn(false);
        /*Utilizando Mockito se simula el comportamiento de los repositorios. En lugar
        de consultar PostgreSQL, se devuelve la información previamente preparada,
        permitiendo aislar completamente la lógica del servicio.*/

        when(citaRepository.save(any(Cita.class))).thenReturn(citaGuardada);
        /*También se simula el guardado de la cita para evitar modificar
        realmente la base de datos durante la prueba.*/

        CitaResponse response = citaService.crearCita(request);
        /*En este punto se ejecuta el metodo real del servicio
        utilizando únicamente objetos simulados.*/

        assertNotNull(response);
        assertEquals("Cristian Cerda", response.getPaciente());
        assertEquals("PENDIENTE", response.getEstado());
        assertEquals("CONSULTA_MEDICA", response.getTipo());
        assertEquals("BAJA", response.getPrioridad());

        /*Se verifica que el servicio haya generado correctamente la respuesta
        esperada, validando los datos del paciente, el estado de la cita,
        el tipo de atención y la prioridad.*/

        verify(citaRepository, times(1)).save(any(Cita.class));
        /*Se comprueba que el repositorio haya recibido
         exactamente una solicitud para guardar la nueva cita.*/
    }

    @Test
    void crearCita_deberiaLanzarErrorSiHorarioEstaOcupado() {
        /*Además del caso exitoso, se validó una regla de negocio crítica:
         impedir que un médico tenga dos citas asignadas para el mismo horario.*/

        LocalDate fechaValida = obtenerProximoDiaHabil();

        Profesion profesion = Profesion.builder()
                .id(1L)
                .nombre("Cardiología")
                .build();

        Doctor doctor = Doctor.builder()
                .id(1L)
                .rut("11111111-1")
                .nombre("Ingrid Calderon")
                .profesiones(Set.of(profesion))
                .build();

        CitaRequest request = CitaRequest.builder()
                .paciente("Cristian Cerda")
                .rut("22222222-2")
                .telefono("912345678")
                .correo("cristian@correo.cl")
                .fecha(fechaValida)
                .hora(LocalTime.of(9, 0))
                .tipo("CONSULTA_MEDICA")
                .prioridad("BAJA")
                .rutDoctor("11111111-1")
                .profesionId(1L)
                .build();

        when(doctorRepository.findByRut("11111111-1")).thenReturn(Optional.of(doctor));
        when(profesionRepository.findById(1L)).thenReturn(Optional.of(profesion));
        when(citaRepository.existsByDoctor_IdAndFechaAndHora(
                doctor.getId(),
                request.getFecha(),
                request.getHora()
        )).thenReturn(true);

        CitaDuplicadaException exception = assertThrows(
                CitaDuplicadaException.class,
                () -> citaService.crearCita(request)
        );
        /*Se verifica que el servicio lance correctamente la excepción
         personalizada cuando se intenta registrar una cita duplicada.*/

        assertEquals("El doctor ya tiene una cita en ese horario", exception.getMessage());

        verify(citaRepository, never()).save(any(Cita.class));
        /*También se comprueba que la cita nunca sea almacenada
        en la base de datos cuando la validación falla.*/
    }

    private LocalDate obtenerProximoDiaHabil() {
        LocalDate fecha = LocalDate.now().plusDays(1);

        while (fecha.getDayOfWeek() == DayOfWeek.SATURDAY ||
                fecha.getDayOfWeek() == DayOfWeek.SUNDAY) {
            fecha = fecha.plusDays(1);
        }

        return fecha;
    }
}