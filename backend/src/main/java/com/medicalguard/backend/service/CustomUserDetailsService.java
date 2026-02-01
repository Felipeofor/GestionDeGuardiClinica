package com.medicalguard.backend.service;

import com.medicalguard.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // Here we rely on the implementation of findAll (which uses the aspect)
        // OR we bypass the tenant filter if we want global login.
        // For strict multi-tenancy, finding a user should respect the tenant filter if
        // set.
        // However, during login (before token), the tenant filter might be set by
        // header.
        // If it is set, findByEmail will only look in that tenant.
        // If we want to allow login without header (e.g. deduce tenant from email), we
        // would need a global search.
        // For MVP, we assume header is present during login or we are already
        // authenticated.

        return userRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + username));
    }
}
