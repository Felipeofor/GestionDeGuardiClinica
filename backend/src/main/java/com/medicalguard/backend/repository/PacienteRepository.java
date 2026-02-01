package com.medicalguard.backend.repository;

import com.medicalguard.backend.domain.Paciente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PacienteRepository extends JpaRepository<Paciente, String> {
    List<Paciente> findByDni(String dni);
}
