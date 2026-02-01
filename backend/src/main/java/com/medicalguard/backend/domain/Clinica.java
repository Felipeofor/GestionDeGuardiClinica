package com.medicalguard.backend.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "clinicas")
@Getter
@Setter
public class Clinica {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id; // This is the tenantId used elsewhere

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String address;

    // Triage Config could be a JSON column or separate fields
    private Integer limitRedMinutes;
    private Integer limitOrangeMinutes;
    // ...
}
