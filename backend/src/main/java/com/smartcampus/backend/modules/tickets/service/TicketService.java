package com.smartcampus.backend.modules.tickets.service;

import com.smartcampus.backend.modules.resources.entity.Resource;
import com.smartcampus.backend.modules.resources.repository.ResourceRepository;
import com.smartcampus.backend.modules.tickets.comment.Comment;
import com.smartcampus.backend.modules.tickets.comment.CommentRepository;
import com.smartcampus.backend.modules.tickets.dto.AssignTicketRequest;
import com.smartcampus.backend.modules.tickets.dto.CommentRequest;
import com.smartcampus.backend.modules.tickets.dto.CreateTicketRequest;
import com.smartcampus.backend.modules.tickets.dto.RejectTicketRequest;
import com.smartcampus.backend.modules.tickets.dto.ResolutionNotesRequest;
import com.smartcampus.backend.modules.tickets.dto.StatusUpdateRequest;
import com.smartcampus.backend.modules.tickets.dto.TicketDto;
import com.smartcampus.backend.modules.tickets.dto.UpdateTicketRequest;
import com.smartcampus.backend.modules.tickets.entity.Ticket;
import com.smartcampus.backend.modules.tickets.entity.TicketCategory;
import com.smartcampus.backend.modules.tickets.entity.TicketPriority;
import com.smartcampus.backend.modules.tickets.entity.TicketStatus;
import com.smartcampus.backend.modules.tickets.repository.TicketRepository;
import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.NoSuchElementException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
public class TicketService {

    private final TicketRepository ticketRepository;
    private final CommentRepository commentRepository;
    private final ResourceRepository resourceRepository;
    private final TicketFileStorageService fileStorageService;

    public TicketDto createTicket(CreateTicketRequest request, MultipartFile[] attachments, String creatorEmail) {
        validateContact(request.getPreferredContactEmail(), request.getPreferredContactPhone());

        Resource resource = null;
        if (hasText(request.getResourceId())) {
            resource = resourceRepository.findById(request.getResourceId())
                    .orElseThrow(() -> new NoSuchElementException("Resource not found with id: " + request.getResourceId()));
        }

        String location = firstNonBlank(request.getLocation(), resource != null ? resource.getLocation() : null);
        if (resource == null && !hasText(location)) {
            throw new IllegalArgumentException("Location is required when no specific resource is selected.");
        }

        LocalDateTime now = LocalDateTime.now();
        Ticket ticket = Ticket.builder()
                .createdByEmail(creatorEmail)
                .resourceId(resource != null ? resource.getId() : null)
                .resourceName(resource != null ? resource.getName() : null)
                .location(location)
                .category(request.getCategory())
                .description(request.getDescription())
                .priority(request.getPriority())
                .preferredContactName(request.getPreferredContactName())
                .preferredContactEmail(request.getPreferredContactEmail())
                .preferredContactPhone(request.getPreferredContactPhone())
                .attachments(fileStorageService.storeImages(attachments))
                .status(TicketStatus.OPEN)
                .createdAt(now)
                .updatedAt(now)
                .build();

        return toDto(ticketRepository.save(ticket));
    }

    public List<TicketDto> getMyTickets(String creatorEmail) {
        return ticketRepository.findByCreatedByEmailOrderByCreatedAtDesc(creatorEmail)
                .stream()
                .map(this::toDto)
                .toList();
    }

    public List<TicketDto> getAllTickets(TicketStatus status, TicketPriority priority, TicketCategory category, String assignedToEmail) {
        return ticketRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .filter(ticket -> status == null || ticket.getStatus() == status)
                .filter(ticket -> priority == null || ticket.getPriority() == priority)
                .filter(ticket -> category == null || ticket.getCategory() == category)
                .filter(ticket -> !hasText(assignedToEmail) || assignedToEmail.equalsIgnoreCase(ticket.getAssignedToEmail()))
                .map(this::toDto)
                .toList();
    }

    public TicketDto getTicket(String id, String email, boolean isAdmin) {
        Ticket ticket = requireAccessibleTicket(id, email, isAdmin);
        return toDto(ticket);
    }

    public TicketDto updateTicket(String id, UpdateTicketRequest request, String email, boolean isAdmin) {
        Ticket ticket = requireAccessibleTicket(id, email, isAdmin);
        if (!isAdmin && ticket.getStatus() != TicketStatus.OPEN) {
            throw new IllegalArgumentException("Only open tickets can be edited by the creator.");
        }

        Resource resource = null;
        if (request.getResourceId() != null) {
            if (hasText(request.getResourceId())) {
                resource = resourceRepository.findById(request.getResourceId())
                        .orElseThrow(() -> new NoSuchElementException("Resource not found with id: " + request.getResourceId()));
                ticket.setResourceId(resource.getId());
                ticket.setResourceName(resource.getName());
            } else {
                ticket.setResourceId(null);
                ticket.setResourceName(null);
            }
        }

        if (request.getLocation() != null) {
            ticket.setLocation(request.getLocation());
        } else if (resource != null && hasText(resource.getLocation())) {
            ticket.setLocation(resource.getLocation());
        }
        if (!hasText(ticket.getLocation()) && !hasText(ticket.getResourceId())) {
            throw new IllegalArgumentException("Location is required when no specific resource is selected.");
        }

        if (request.getCategory() != null) ticket.setCategory(request.getCategory());
        if (request.getDescription() != null) ticket.setDescription(request.getDescription());
        if (request.getPriority() != null) ticket.setPriority(request.getPriority());
        if (request.getPreferredContactName() != null) ticket.setPreferredContactName(request.getPreferredContactName());
        if (request.getPreferredContactEmail() != null) ticket.setPreferredContactEmail(request.getPreferredContactEmail());
        if (request.getPreferredContactPhone() != null) ticket.setPreferredContactPhone(request.getPreferredContactPhone());
        validateContact(ticket.getPreferredContactEmail(), ticket.getPreferredContactPhone());

        ticket.setUpdatedAt(LocalDateTime.now());
        return toDto(ticketRepository.save(ticket));
    }

    public void deleteTicket(String id, String email, boolean isAdmin) {
        Ticket ticket = requireAccessibleTicket(id, email, isAdmin);
        if (!isAdmin && ticket.getStatus() != TicketStatus.OPEN) {
            throw new IllegalArgumentException("Only open tickets can be deleted by the creator.");
        }
        commentRepository.deleteByTicketId(id);
        fileStorageService.deleteImages(ticket.getAttachments());
        ticketRepository.delete(ticket);
    }

    public TicketDto assignTicket(String id, AssignTicketRequest request) {
        Ticket ticket = requireTicket(id);
        ticket.setAssignedToEmail(request.getAssignedToEmail());
        ticket.setUpdatedAt(LocalDateTime.now());
        return toDto(ticketRepository.save(ticket));
    }

    public TicketDto updateStatus(String id, StatusUpdateRequest request) {
        Ticket ticket = requireTicket(id);
        TicketStatus target = request.getStatus();

        if (target == TicketStatus.REJECTED) {
            throw new IllegalArgumentException("Use the reject action to reject a ticket.");
        }

        if (target == TicketStatus.RESOLVED && hasText(request.getResolutionNotes())) {
            ticket.setResolutionNotes(request.getResolutionNotes());
        }

        validateStatusTransition(ticket, target);
        ticket.setStatus(target);
        ticket.setUpdatedAt(LocalDateTime.now());

        if (target == TicketStatus.RESOLVED) {
            ticket.setResolvedAt(LocalDateTime.now());
        }
        if (target == TicketStatus.CLOSED) {
            ticket.setClosedAt(LocalDateTime.now());
        }

        return toDto(ticketRepository.save(ticket));
    }

    public TicketDto rejectTicket(String id, RejectTicketRequest request) {
        Ticket ticket = requireTicket(id);
        if (ticket.getStatus() != TicketStatus.OPEN && ticket.getStatus() != TicketStatus.IN_PROGRESS) {
            throw new IllegalArgumentException("Only open or in-progress tickets can be rejected.");
        }
        ticket.setStatus(TicketStatus.REJECTED);
        ticket.setRejectionReason(request.getReason());
        ticket.setUpdatedAt(LocalDateTime.now());
        return toDto(ticketRepository.save(ticket));
    }

    public TicketDto updateResolutionNotes(String id, ResolutionNotesRequest request) {
        Ticket ticket = requireTicket(id);
        ticket.setResolutionNotes(request.getResolutionNotes());
        ticket.setUpdatedAt(LocalDateTime.now());
        return toDto(ticketRepository.save(ticket));
    }

    public List<Comment> getComments(String ticketId, String email, boolean isAdmin) {
        requireAccessibleTicket(ticketId, email, isAdmin);
        return commentRepository.findByTicketIdOrderByCreatedAtAsc(ticketId);
    }

    public Comment addComment(String ticketId, CommentRequest request, String email, boolean isAdmin) {
        requireAccessibleTicket(ticketId, email, isAdmin);
        LocalDateTime now = LocalDateTime.now();
        Comment comment = Comment.builder()
                .ticketId(ticketId)
                .authorEmail(email)
                .authorRole(isAdmin ? "ROLE_ADMIN" : "ROLE_STUDENT")
                .content(request.getContent())
                .createdAt(now)
                .updatedAt(now)
                .build();
        return commentRepository.save(comment);
    }

    public Comment updateComment(String ticketId, String commentId, CommentRequest request, String email, boolean isAdmin) {
        requireAccessibleTicket(ticketId, email, isAdmin);
        Comment comment = requireComment(ticketId, commentId);
        enforceCommentOwnership(comment, email, isAdmin);
        comment.setContent(request.getContent());
        comment.setUpdatedAt(LocalDateTime.now());
        return commentRepository.save(comment);
    }

    public void deleteComment(String ticketId, String commentId, String email, boolean isAdmin) {
        requireAccessibleTicket(ticketId, email, isAdmin);
        Comment comment = requireComment(ticketId, commentId);
        enforceCommentOwnership(comment, email, isAdmin);
        commentRepository.delete(comment);
    }

    private Ticket requireAccessibleTicket(String id, String email, boolean isAdmin) {
        Ticket ticket = requireTicket(id);
        if (!isAdmin && !email.equalsIgnoreCase(ticket.getCreatedByEmail())) {
            throw new IllegalArgumentException("You can only access your own tickets.");
        }
        return ticket;
    }

    private Ticket requireTicket(String id) {
        return ticketRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Ticket not found with id: " + id));
    }

    private Comment requireComment(String ticketId, String commentId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new NoSuchElementException("Comment not found with id: " + commentId));
        if (!ticketId.equals(comment.getTicketId())) {
            throw new NoSuchElementException("Comment not found for this ticket.");
        }
        return comment;
    }

    private void validateStatusTransition(Ticket ticket, TicketStatus target) {
        TicketStatus current = ticket.getStatus();
        boolean valid = (current == TicketStatus.OPEN && target == TicketStatus.IN_PROGRESS)
                || (current == TicketStatus.IN_PROGRESS && target == TicketStatus.RESOLVED)
                || (current == TicketStatus.RESOLVED && target == TicketStatus.CLOSED);

        if (!valid) {
            throw new IllegalArgumentException("Invalid status transition: " + current + " -> " + target);
        }

        if (target == TicketStatus.RESOLVED && !hasText(ticket.getResolutionNotes())) {
            throw new IllegalArgumentException("Resolution notes are required before resolving a ticket.");
        }
    }

    private void enforceCommentOwnership(Comment comment, String email, boolean isAdmin) {
        if (!isAdmin && !email.equalsIgnoreCase(comment.getAuthorEmail())) {
            throw new IllegalArgumentException("You can only edit or delete your own comments.");
        }
    }

    private void validateContact(String email, String phone) {
        if (!hasText(email) && !hasText(phone)) {
            throw new IllegalArgumentException("Preferred email or phone is required.");
        }
    }

    private TicketDto toDto(Ticket ticket) {
        TicketDto dto = new TicketDto();
        dto.setId(ticket.getId());
        dto.setCreatedByEmail(ticket.getCreatedByEmail());
        dto.setResourceId(ticket.getResourceId());
        dto.setResourceName(ticket.getResourceName());
        dto.setLocation(ticket.getLocation());
        dto.setCategory(ticket.getCategory());
        dto.setDescription(ticket.getDescription());
        dto.setPriority(ticket.getPriority());
        dto.setPreferredContactName(ticket.getPreferredContactName());
        dto.setPreferredContactEmail(ticket.getPreferredContactEmail());
        dto.setPreferredContactPhone(ticket.getPreferredContactPhone());
        dto.setAttachments(ticket.getAttachments());
        dto.setStatus(ticket.getStatus());
        dto.setAssignedToEmail(ticket.getAssignedToEmail());
        dto.setResolutionNotes(ticket.getResolutionNotes());
        dto.setRejectionReason(ticket.getRejectionReason());
        dto.setCreatedAt(ticket.getCreatedAt());
        dto.setUpdatedAt(ticket.getUpdatedAt());
        dto.setResolvedAt(ticket.getResolvedAt());
        dto.setClosedAt(ticket.getClosedAt());
        dto.setComments(commentRepository.findByTicketIdOrderByCreatedAtAsc(ticket.getId())
                .stream()
                .sorted(Comparator.comparing(Comment::getCreatedAt, Comparator.nullsLast(Comparator.naturalOrder())))
                .toList());
        return dto;
    }

    private String firstNonBlank(String first, String second) {
        return hasText(first) ? first : second;
    }

    private boolean hasText(String value) {
        return value != null && !value.trim().isEmpty();
    }
}
