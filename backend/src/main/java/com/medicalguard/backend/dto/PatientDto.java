package com.medicalguard.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PatientDto {
    private String id;
    private String dni;
    private String firstName;
    private String lastName;
    private String insurance;
    private LocalDate birthDate;
    private String tenantId;
}
