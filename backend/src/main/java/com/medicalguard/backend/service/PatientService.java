package com.medicalguard.backend.service;

import com.medicalguard.backend.domain.Paciente;
import com.medicalguard.backend.dto.PatientDto;
import com.medicalguard.backend.repository.PacienteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PatientService {

    private final PacienteRepository repository;

    public PatientDto create(PatientDto dto) {
        Paciente p = new Paciente();
        p.setDni(dto.getDni());
        p.setFirstName(dto.getFirstName());
        p.setLastName(dto.getLastName());
        p.setInsurance(dto.getInsurance());
        p.setBirthDate(dto.getBirthDate());

        // Tenant set automatically by aspect/User context
        p = repository.save(p);

        return mapToDto(p);
    }

    public List<PatientDto> searchByDni(String dni) {
        return repository.findByDni(dni).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public List<PatientDto> getAll() {
        return repository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    private PatientDto mapToDto(Paciente p) {
        return PatientDto.builder()
                .id(p.getId())
                .dni(p.getDni())
                .firstName(p.getFirstName())
                .lastName(p.getLastName())
                .insurance(p.getInsurance())
                .birthDate(p.getBirthDate())
                .tenantId(p.getTenantId())
                .build();
    }
}
