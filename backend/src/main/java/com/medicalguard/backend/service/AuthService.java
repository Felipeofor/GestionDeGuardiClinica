package com.medicalguard.backend.service;

import com.medicalguard.backend.config.JwtTokenProvider;
import com.medicalguard.backend.config.TenantContext;
import com.medicalguard.backend.domain.User;
import com.medicalguard.backend.dto.AuthRequest;
import com.medicalguard.backend.dto.AuthResponse;
import com.medicalguard.backend.dto.RegisterRequest;
import com.medicalguard.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final AuthenticationManager authenticationManager;

    public AuthResponse register(RegisterRequest request) {
        // Build User
        User user = new User();
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole());

        // Explicitly set Tenant ID for the user
        // Note: BaseEntity might overwrite it with TenantContext if present.
        // But for Registration, we might be Admin creating users, or super admin.
        // If we registered via a public endpoint, we must provide tenantId.
        if (request.getTenantId() != null) {
            TenantContext.setCurrentTenant(request.getTenantId());
            user.setTenantId(request.getTenantId());
        }

        userRepository.save(user);

        var jwt = jwtTokenProvider.generateToken(user, user.getTenantId());
        return AuthResponse.builder()
                .token(jwt)
                .email(user.getEmail())
                .role(user.getRole().name())
                .tenantId(user.getTenantId())
                .build();
    }

    public AuthResponse authenticate(AuthRequest request) {
        // If Request comes with TenantID (e.g. multi-tenant login), we can set context?
        // Actually UsernamePasswordAuthenticationToken does not care about tenant yet.
        // But the DAO provider calls loadUserByUsername.
        // If our loadUserByUsername respects the Aspect, we MUST set the tenant context
        // BEFORE calling authenticate.

        if (request.getTenantId() != null) {
            TenantContext.setCurrentTenant(request.getTenantId());
        }

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

        var user = userRepository.findByEmail(request.getEmail())
                .orElseThrow();

        var jwt = jwtTokenProvider.generateToken(user, user.getTenantId());

        return AuthResponse.builder()
                .token(jwt)
                .email(user.getEmail())
                .role(user.getRole().name())
                .tenantId(user.getTenantId())
                .build();
    }
}
