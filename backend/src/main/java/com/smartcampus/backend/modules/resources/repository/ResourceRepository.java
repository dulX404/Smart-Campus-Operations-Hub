package com.smartcampus.backend.modules.resources.repository;

import com.smartcampus.backend.modules.resources.entity.Resource;
import com.smartcampus.backend.modules.resources.entity.ResourceStatus;
import com.smartcampus.backend.modules.resources.entity.ResourceType;
import java.util.List;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ResourceRepository extends MongoRepository<Resource, String> {

    List<Resource> findByType(ResourceType type);

    List<Resource> findByStatus(ResourceStatus status);

    List<Resource> findByLocationIgnoreCase(String location);

    List<Resource> findByCapacityGreaterThanEqual(int capacity);
}
