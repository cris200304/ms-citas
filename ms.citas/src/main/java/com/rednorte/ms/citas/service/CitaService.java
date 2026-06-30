package com.rednorte.ms.citas.service;

import com.rednorte.ms.citas.dto.CitaRequest;
import com.rednorte.ms.citas.dto.CitaResponse;
import com.rednorte.ms.citas.dto.CitaUpdateRequest;
import com.rednorte.ms.citas.enums.EstadoCita;
import com.rednorte.ms.citas.enums.PrioridadCita;
import com.rednorte.ms.citas.enums.TipoAtencion;
import com.rednorte.ms.citas.exception.CitaDuplicadaException;
import com.rednorte.ms.citas.exception.DoctorNoEncontradoException;
import com.rednorte.ms.citas.model.Cita;
import com.rednorte.ms.citas.model.Doctor;
import com.rednorte.ms.citas.model.Profesion;
import com.rednorte.ms.citas.repository.CitaRepository;
import com.rednorte.ms.citas.repository.DoctorRepository;
import com.rednorte.ms.citas.repository.ProfesionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CitaService {

    private final CitaRepository citaRepository;
    private final DoctorRepository doctorRepository;
    private final ProfesionRepository profesionRepository;

    public CitaResponse crearCita(CitaRequest request) {

        Doctor doctor = doctorRepository.findByRut(request.getRutDoctor())
                .orElseThrow(() -> new DoctorNoEncontradoException("Doctor no encontrado"));

        Profesion profesion = profesionRepository.findById(request.getProfesionId())
                .orElseThrow(() -> new RuntimeException("Profesión no encontrada"));

        validarDoctorProfesion(doctor, profesion);
        validarFechaYHora(request.getFecha(), request.getHora());

        boolean existeCita = citaRepository.existsByDoctor_IdAndFechaAndHora(
                doctor.getId(),
                request.getFecha(),
                request.getHora()
        );

        if (existeCita) {
            throw new CitaDuplicadaException("El doctor ya tiene una cita en ese horario");
        }

        Cita cita = Cita.builder()
                .paciente(request.getPaciente())
                .rut(request.getRut())
                .telefono(request.getTelefono())
                .correo(request.getCorreo())
                .fecha(request.getFecha())
                .hora(request.getHora())
                .tipo(TipoAtencion.valueOf(request.getTipo()))
                .prioridad(PrioridadCita.MEDIA)
                .estado(EstadoCita.PENDIENTE)
                .doctor(doctor)
                .profesion(profesion)
                .build();

        return convertirAResponse(citaRepository.save(cita));
    }

    public List<CitaResponse> buscarCitasPorRut(String rut) {
        return citaRepository.findByRut(rut)
                .stream()
                .map(this::convertirAResponse)
                .toList();
    }

    public List<CitaResponse> listarTodasLasCitas() {
        return citaRepository.findAll()
                .stream()
                .map(this::convertirAResponse)
                .toList();
    }

    public List<String> obtenerHorasDisponibles(String rutDoctor, LocalDate fecha) {

        validarFechaParaDisponibilidad(fecha);

        List<String> todasLasHoras = List.of(
                "08:00", "08:30",
                "09:00", "09:30",
                "10:00", "10:30",
                "11:00", "11:30",
                "12:00", "12:30",
                "13:00", "13:30",
                "14:00", "14:30",
                "15:00", "15:30",
                "16:00", "16:30",
                "17:00", "17:30",
                "18:00", "18:30"
        );

        List<String> horasOcupadas = citaRepository
                .findByDoctor_RutAndFecha(rutDoctor, fecha)
                .stream()
                .map(cita -> cita.getHora().toString().substring(0, 5))
                .toList();

        return todasLasHoras.stream()
                .filter(hora -> !horasOcupadas.contains(hora))
                .toList();
    }

    public CitaResponse actualizarCita(Long id, CitaUpdateRequest request) {

        Cita cita = citaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cita no encontrada"));

        Doctor doctor = doctorRepository.findByRut(request.getRutDoctor())
                .orElseThrow(() -> new DoctorNoEncontradoException("Doctor no encontrado"));

        Profesion profesion = profesionRepository.findById(request.getProfesionId())
                .orElseThrow(() -> new RuntimeException("Profesión no encontrada"));

        validarDoctorProfesion(doctor, profesion);
        validarFechaYHora(request.getFecha(), request.getHora());

        cita.setDoctor(doctor);
        cita.setProfesion(profesion);
        cita.setTipo(TipoAtencion.valueOf(request.getTipo()));
        cita.setPrioridad(PrioridadCita.valueOf(request.getPrioridad()));
        cita.setEstado(EstadoCita.valueOf(request.getEstado()));
        cita.setFecha(request.getFecha());
        cita.setHora(request.getHora());

        return convertirAResponse(citaRepository.save(cita));
    }

    private void validarDoctorProfesion(Doctor doctor, Profesion profesion) {
        boolean tieneProfesion = doctor.getProfesiones()
                .stream()
                .anyMatch(p -> p.getId().equals(profesion.getId()));

        if (!tieneProfesion) {
            throw new RuntimeException("El profesional no posee la profesión seleccionada");
        }
    }

    private void validarFechaYHora(LocalDate fecha, LocalTime hora) {
        validarFechaParaDisponibilidad(fecha);

        if (hora.isBefore(LocalTime.of(8, 0)) || hora.isAfter(LocalTime.of(18, 30))) {
            throw new RuntimeException("Las horas médicas solo pueden agendarse entre las 08:00 y las 18:30");
        }
    }

    private void validarFechaParaDisponibilidad(LocalDate fecha) {
        if (fecha.isBefore(LocalDate.now())) {
            throw new RuntimeException("No se pueden agendar horas en fechas pasadas");
        }

        if (fecha.getDayOfWeek() == DayOfWeek.SATURDAY || fecha.getDayOfWeek() == DayOfWeek.SUNDAY) {
            throw new RuntimeException("Solo se permiten citas de lunes a viernes");
        }
    }

    private CitaResponse convertirAResponse(Cita cita) {
        return CitaResponse.builder()
                .id(cita.getId())
                .paciente(cita.getPaciente())
                .rut(cita.getRut())
                .telefono(cita.getTelefono())
                .correo(cita.getCorreo())
                .fecha(cita.getFecha())
                .hora(cita.getHora())
                .estado(cita.getEstado().name())
                .tipo(cita.getTipo().name())
                .prioridad(cita.getPrioridad().name())
                .doctorNombre(cita.getDoctor().getNombre())
                .rutDoctor(cita.getDoctor().getRut())
                .profesionId(cita.getProfesion().getId())
                .profesion(cita.getProfesion().getNombre())
                .build();
    }
}