package com.smartcampus.backend.modules.tickets.repository;

import com.smartcampus.backend.modules.tickets.entity.Ticket;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface TicketRepository extends MongoRepository<Ticket, String> {
}
