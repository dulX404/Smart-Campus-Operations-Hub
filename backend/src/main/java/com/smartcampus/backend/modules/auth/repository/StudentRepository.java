package com.smartcampus.backend.modules.auth.repository;

import com.smartcampus.backend.modules.auth.entity.Student;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

public interface StudentRepository extends MongoRepository<Student, String> {
    Optional<Student> findByEmail(String email);
}
