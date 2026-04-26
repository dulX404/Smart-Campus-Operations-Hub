package com.smartcampus.backend.modules.tickets.repository;

import com.smartcampus.backend.modules.tickets.entity.Ticket;
import com.smartcampus.backend.modules.tickets.entity.TicketStatus;
import java.util.List;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface TicketRepository extends MongoRepository<Ticket, String> {
    List<Ticket> findAllByOrderByCreatedAtDesc();

    List<Ticket> findByCreatedByEmailOrderByCreatedAtDesc(String createdByEmail);

    List<Ticket> findByStatusOrderByCreatedAtDesc(TicketStatus status);
}
