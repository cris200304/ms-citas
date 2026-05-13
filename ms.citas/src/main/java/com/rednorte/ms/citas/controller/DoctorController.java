package com.rednorte.ms.citas.controller;

import com.rednorte.ms.citas.model.Doctor;
import com.rednorte.ms.citas.repository.DoctorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/doctores")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class DoctorController {

    private final DoctorRepository doctorRepository;

    @GetMapping
    public List<Doctor> listarDoctores() {
        return doctorRepository.findAll();
    }
}