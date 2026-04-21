package com.smartcampus.backend.modules.auth.repository;

import com.smartcampus.backend.modules.auth.entity.User;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface UserRepository extends MongoRepository<User, String> {
}
