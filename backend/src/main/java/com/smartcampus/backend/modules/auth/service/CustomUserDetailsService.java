package com.smartcampus.backend.modules.auth.service;

import com.smartcampus.backend.modules.auth.entity.Admin;
import com.smartcampus.backend.modules.auth.entity.Student;
import com.smartcampus.backend.modules.auth.repository.AdminRepository;
import com.smartcampus.backend.modules.auth.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final AdminRepository adminRepository;
    private final StudentRepository studentRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        // First check in Admin collection
        Optional<Admin> admin = adminRepository.findByEmail(email);
        if (admin.isPresent()) {
            Admin a = admin.get();
            return org.springframework.security.core.userdetails.User.withUsername(a.getEmail())
                    .password(a.getPassword() != null ? a.getPassword() : "{noop}password")
                    .roles("ADMIN")
                    .build();
        }

        // Then check in Student collection
        Optional<Student> student = studentRepository.findByEmail(email);
        if (student.isPresent()) {
            Student s = student.get();
            return org.springframework.security.core.userdetails.User.withUsername(s.getEmail())
                    .password(s.getPassword() != null ? s.getPassword() : "{noop}password")
                    .roles("STUDENT")
                    .build();
        }

        throw new UsernameNotFoundException("User not found with email: " + email);
    }
}
