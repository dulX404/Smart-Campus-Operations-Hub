package com.smartcampus.backend.modules.resources.repository;

import com.smartcampus.backend.modules.resources.entity.Resource;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ResourceRepository extends MongoRepository<Resource, String> {
}
