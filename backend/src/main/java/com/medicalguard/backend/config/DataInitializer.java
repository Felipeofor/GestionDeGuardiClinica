package com.medicalguard.backend.config;

import com.medicalguard.backend.domain.Role;
import com.medicalguard.backend.domain.User;
import com.medicalguard.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (userRepository.count() == 0) {
            User admin = User.builder()
                    .firstName("Admin")
                    .lastName("User")
                    .email("admin@clinic.com")
                    .password(passwordEncoder.encode("password"))
                    .role(Role.ADMIN_CLINICA)
                    .build();
            admin.setTenantId("CLINIC-A");
            admin.setActive(true);
            userRepository.save(admin);
            System.out.println("Default user created: admin@clinic.com / password (Tenant: CLINIC-A)");
        }
    }
}
