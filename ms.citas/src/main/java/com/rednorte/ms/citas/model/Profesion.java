package com.rednorte.ms.citas.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "profesiones")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Profesion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombre;
}