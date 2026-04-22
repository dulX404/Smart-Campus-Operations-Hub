package com.smartcampus.backend.modules.auth.service;

import com.smartcampus.backend.modules.auth.dto.AdminDto;
import com.smartcampus.backend.modules.auth.dto.StudentDto;
import com.smartcampus.backend.modules.auth.entity.Admin;
import com.smartcampus.backend.modules.auth.entity.Student;
import com.smartcampus.backend.modules.auth.repository.AdminRepository;
import com.smartcampus.backend.modules.auth.repository.StudentRepository;
import com.smartcampus.backend.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final AdminRepository adminRepository;
    private final StudentRepository studentRepository;
    private final PasswordEncoder passwordEncoder;

    public String authenticateAndGenerateToken(String email, String password) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(email, password)
            );
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            return jwtUtil.generateToken(userDetails);
        } catch (Exception ex) {
            System.out.println("Authentication failed for user: " + email);
            ex.printStackTrace();
            return null;
        }
    }

    public AdminDto registerAdmin(Admin admin) {
        admin.setPassword(passwordEncoder.encode(admin.getPassword()));
        Admin savedAdmin = adminRepository.save(admin);
        return AdminDto.builder()
                .id(savedAdmin.getId())
                .fullName(savedAdmin.getFullName())
                .email(savedAdmin.getEmail())
                .department(savedAdmin.getDepartment())
                .build();
    }

    public StudentDto registerStudent(Student student) {
        student.setPassword(passwordEncoder.encode(student.getPassword()));
        Student savedStudent = studentRepository.save(student);
        return StudentDto.builder()
                .id(savedStudent.getId())
                .fullName(savedStudent.getFullName())
                .email(savedStudent.getEmail())
                .studentId(savedStudent.getStudentId())
                .major(savedStudent.getMajor())
                .build();
    }

    public Object getProfile(String email) {
        // Check Admin
        var admin = adminRepository.findByEmail(email);
        if (admin.isPresent()) return registerAdmin(admin.get()); // Using registration mapping for simplicity, or create a dedicated mapper

        // Check Student
        var student = studentRepository.findByEmail(email);
        if (student.isPresent()) {
            Student s = student.get();
            return StudentDto.builder()
                .id(s.getId())
                .fullName(s.getFullName())
                .email(s.getEmail())
                .studentId(s.getStudentId())
                .major(s.getMajor())
                .build();
        }
        
        throw new RuntimeException("User not found");
    }
}
