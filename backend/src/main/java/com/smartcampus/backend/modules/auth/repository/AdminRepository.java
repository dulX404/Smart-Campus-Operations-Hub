package com.smartcampus.backend.modules.auth.repository;

import com.smartcampus.backend.modules.auth.entity.Admin;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

public interface AdminRepository extends MongoRepository<Admin, String> {
    Optional<Admin> findByEmail(String email);
}
