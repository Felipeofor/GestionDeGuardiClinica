package com.medicalguard.backend.dto;

import com.medicalguard.backend.domain.AdmissionStatus;
import com.medicalguard.backend.domain.TriageLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AdmissionDto {
    private String id;
    private String patientId;
    private String patientName;
    private String patientDni;
    private TriageLevel triageLevel;
    private AdmissionStatus status;
    private LocalDateTime admissionTime;
    private LocalDateTime triageTime;
    private LocalDateTime attentionTime;
    private LocalDateTime dischargeTime;
    private String tenantId;
}
