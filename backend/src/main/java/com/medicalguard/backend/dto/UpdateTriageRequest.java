package com.medicalguard.backend.dto;

import com.medicalguard.backend.domain.TriageLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UpdateTriageRequest {
    private TriageLevel level;
}
