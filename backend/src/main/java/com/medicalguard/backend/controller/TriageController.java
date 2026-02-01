package com.medicalguard.backend.controller;

import com.medicalguard.backend.dto.AdmissionDto;
import com.medicalguard.backend.dto.CreateAdmissionRequest;
import com.medicalguard.backend.dto.UpdateStatusRequest;
import com.medicalguard.backend.dto.UpdateTriageRequest;
import com.medicalguard.backend.service.AdmissionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admissions")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class TriageController {

    private final AdmissionService service;

    @PostMapping
    public ResponseEntity<AdmissionDto> admit(@RequestBody CreateAdmissionRequest request) {
        return ResponseEntity.ok(service.createAdmission(request.getPatientId()));
    }

    @GetMapping
    public ResponseEntity<List<AdmissionDto>> getActive() {
        return ResponseEntity.ok(service.getAllActive());
    }

    @GetMapping("/patient/{patientId}/history")
    public ResponseEntity<List<AdmissionDto>> getHistory(@PathVariable String patientId) {
        return ResponseEntity.ok(service.getHistory(patientId));
    }

    @PutMapping("/{id}/triage")
    public ResponseEntity<AdmissionDto> triage(@PathVariable String id, @RequestBody UpdateTriageRequest request) {
        return ResponseEntity.ok(service.updateTriage(id, request.getLevel()));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<AdmissionDto> updateStatus(@PathVariable String id,
            @RequestBody UpdateStatusRequest request) {
        return ResponseEntity.ok(service.updateStatus(id, request.getStatus()));
    }
}
