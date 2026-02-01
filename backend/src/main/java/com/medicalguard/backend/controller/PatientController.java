package com.medicalguard.backend.controller;

import com.medicalguard.backend.dto.PatientDto;
import com.medicalguard.backend.service.PatientService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/patients")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class PatientController {

    private final PatientService service;

    @PostMapping
    public ResponseEntity<PatientDto> create(@RequestBody PatientDto dto) {
        return ResponseEntity.ok(service.create(dto));
    }

    @GetMapping
    public ResponseEntity<List<PatientDto>> getAll(@RequestParam(required = false) String dni) {
        if (dni != null) {
            return ResponseEntity.ok(service.searchByDni(dni));
        }
        return ResponseEntity.ok(service.getAll());
    }
}
