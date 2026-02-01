package com.medicalguard.backend.service;

import com.medicalguard.backend.domain.AdmissionStatus;
import com.medicalguard.backend.domain.Ingreso;
import com.medicalguard.backend.domain.Paciente;
import com.medicalguard.backend.domain.TriageLevel;
import com.medicalguard.backend.dto.AdmissionDto;
import com.medicalguard.backend.repository.IngresoRepository;
import com.medicalguard.backend.repository.PacienteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdmissionService {

    private final IngresoRepository ingresoRepository;
    private final PacienteRepository pacienteRepository;

    @Transactional
    public AdmissionDto createAdmission(String patientId) {
        if (patientId == null)
            throw new IllegalArgumentException("Patient ID cannot be null");
        Paciente p = pacienteRepository.findById(patientId)
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        Ingreso ingreso = new Ingreso();
        ingreso.setPaciente(p);
        ingreso.setStatus(AdmissionStatus.EN_ESPERA);

        ingreso = ingresoRepository.save(ingreso);
        return mapToDto(ingreso);
    }

    @Transactional
    public AdmissionDto updateTriage(String id, TriageLevel level) {
        Ingreso admission = getAdmission(id);
        admission.setTriageLevel(level);
        admission.setTriageTime(LocalDateTime.now());
        admission.setStatus(AdmissionStatus.ESPERANDO_MEDICO);

        return mapToDto(ingresoRepository.save(admission));
    }

    @Transactional
    public AdmissionDto updateStatus(String id, AdmissionStatus status) {
        Ingreso admission = getAdmission(id);
        admission.setStatus(status);

        if (status == AdmissionStatus.EN_ATENCION) {
            admission.setAttentionTime(LocalDateTime.now());
        } else if (status == AdmissionStatus.ALTA || status == AdmissionStatus.DERIVADO) {
            admission.setDischargeTime(LocalDateTime.now());
        }

        return mapToDto(ingresoRepository.save(admission));
    }

    public List<AdmissionDto> getHistory(String patientId) {
        return ingresoRepository.findByPacienteIdOrderByAdmissionTimeDesc(patientId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public List<AdmissionDto> getAllActive() {
        // Simple filter in memory for MVP, ideally DB query "status NOT IN (...)"
        return ingresoRepository.findAll().stream()
                .filter(i -> i.getStatus() != AdmissionStatus.ALTA && i.getStatus() != AdmissionStatus.DERIVADO)
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    private Ingreso getAdmission(String id) {
        if (id == null)
            throw new IllegalArgumentException("Admission ID cannot be null");
        return ingresoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Admission not found"));
    }

    private AdmissionDto mapToDto(Ingreso i) {
        return AdmissionDto.builder()
                .id(i.getId())
                .patientId(i.getPaciente().getId())
                .patientName(i.getPaciente().getFirstName() + " " + i.getPaciente().getLastName())
                .patientDni(i.getPaciente().getDni())
                .triageLevel(i.getTriageLevel())
                .status(i.getStatus())
                .admissionTime(i.getAdmissionTime())
                .triageTime(i.getTriageTime())
                .attentionTime(i.getAttentionTime())
                .dischargeTime(i.getDischargeTime())
                .tenantId(i.getTenantId())
                .build();
    }
}
