package com.medicalguard.backend.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "ingresos")
@Getter
@Setter
public class Ingreso extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "paciente_id")
    private Paciente paciente;

    // Although tenantId is in BaseEntity, we implicitly relate to Clinica via
    // tenantId.
    // If we want an explicit Join, we can map Clinica:
    // @ManyToOne
    // @JoinColumn(name = "tenant_id", insertable = false, updatable = false)
    // private Clinica clinica;

    @Enumerated(EnumType.STRING)
    private TriageLevel triageLevel;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AdmissionStatus status;

    private LocalDateTime admissionTime; // Hora ingreso administrativo
    private LocalDateTime triageTime; // Hora triage realizado
    private LocalDateTime attentionTime; // Hora atención médico
    private LocalDateTime dischargeTime; // Hora egreso

    @PrePersist
    @Override
    public void prePersist() {
        super.prePersist();
        if (this.admissionTime == null) {
            this.admissionTime = LocalDateTime.now();
        }
        if (this.status == null) {
            this.status = AdmissionStatus.EN_ESPERA;
        }
    }
}
