package com.medicalguard.backend.repository;

import com.medicalguard.backend.domain.Ingreso;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IngresoRepository extends JpaRepository<Ingreso, String> {
    List<Ingreso> findByPacienteIdOrderByAdmissionTimeDesc(String patientId);
}
