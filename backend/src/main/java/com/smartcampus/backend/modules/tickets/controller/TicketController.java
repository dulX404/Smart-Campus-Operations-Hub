package com.smartcampus.backend.modules.tickets.controller;

import com.smartcampus.backend.modules.tickets.comment.Comment;
import com.smartcampus.backend.modules.tickets.dto.AssignTicketRequest;
import com.smartcampus.backend.modules.tickets.dto.CommentRequest;
import com.smartcampus.backend.modules.tickets.dto.CreateTicketRequest;
import com.smartcampus.backend.modules.tickets.dto.RejectTicketRequest;
import com.smartcampus.backend.modules.tickets.dto.ResolutionNotesRequest;
import com.smartcampus.backend.modules.tickets.dto.StatusUpdateRequest;
import com.smartcampus.backend.modules.tickets.dto.TicketDto;
import com.smartcampus.backend.modules.tickets.dto.UpdateTicketRequest;
import com.smartcampus.backend.modules.tickets.entity.TicketCategory;
import com.smartcampus.backend.modules.tickets.entity.TicketPriority;
import com.smartcampus.backend.modules.tickets.entity.TicketStatus;
import com.smartcampus.backend.modules.tickets.service.TicketService;
import com.smartcampus.backend.response.ApiResponse;
import jakarta.validation.Valid;
import java.util.List;
import java.util.NoSuchElementException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/tickets")
@RequiredArgsConstructor
public class TicketController {

    private final TicketService ticketService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<TicketDto>> createTicket(
            @Valid @RequestPart("ticket") CreateTicketRequest request,
            @RequestPart(value = "attachments", required = false) MultipartFile[] attachments,
            Authentication authentication) {
        TicketDto ticket = ticketService.createTicket(request, attachments, authentication.getName());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Ticket created successfully", ticket));
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<List<TicketDto>>> getMyTickets(Authentication authentication) {
        List<TicketDto> tickets = ticketService.getMyTickets(authentication.getName());
        return ResponseEntity.ok(ApiResponse.success("My tickets retrieved", tickets));
    }

    @GetMapping("/create")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<List<TicketDto>>> getMyTicketsLegacy(Authentication authentication) {
        List<TicketDto> tickets = ticketService.getMyTickets(authentication.getName());
        return ResponseEntity.ok(ApiResponse.success("My tickets retrieved", tickets));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<TicketDto>>> getAllTickets(
            @RequestParam(required = false) TicketStatus status,
            @RequestParam(required = false) TicketPriority priority,
            @RequestParam(required = false) TicketCategory category,
            @RequestParam(required = false) String assignedToEmail) {
        List<TicketDto> tickets = ticketService.getAllTickets(status, priority, category, assignedToEmail);
        return ResponseEntity.ok(ApiResponse.success("Tickets retrieved", tickets));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('STUDENT','ADMIN')")
    public ResponseEntity<ApiResponse<TicketDto>> getTicket(@PathVariable String id, Authentication authentication) {
        TicketDto ticket = ticketService.getTicket(id, authentication.getName(), isAdmin(authentication));
        return ResponseEntity.ok(ApiResponse.success("Ticket retrieved", ticket));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('STUDENT','ADMIN')")
    public ResponseEntity<ApiResponse<TicketDto>> updateTicket(
            @PathVariable String id,
            @RequestBody UpdateTicketRequest request,
            Authentication authentication) {
        TicketDto ticket = ticketService.updateTicket(id, request, authentication.getName(), isAdmin(authentication));
        return ResponseEntity.ok(ApiResponse.success("Ticket updated successfully", ticket));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('STUDENT','ADMIN')")
    public ResponseEntity<ApiResponse<Object>> deleteTicket(@PathVariable String id, Authentication authentication) {
        ticketService.deleteTicket(id, authentication.getName(), isAdmin(authentication));
        return ResponseEntity.ok(ApiResponse.success("Ticket deleted successfully", null));
    }

    @PostMapping("/{id}/assign")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<TicketDto>> assignTicket(
            @PathVariable String id,
            @Valid @RequestBody AssignTicketRequest request) {
        TicketDto ticket = ticketService.assignTicket(id, request);
        return ResponseEntity.ok(ApiResponse.success("Ticket assigned successfully", ticket));
    }

    @PostMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<TicketDto>> updateStatus(
            @PathVariable String id,
            @Valid @RequestBody StatusUpdateRequest request) {
        TicketDto ticket = ticketService.updateStatus(id, request);
        return ResponseEntity.ok(ApiResponse.success("Ticket status updated successfully", ticket));
    }

    @PostMapping("/{id}/reject")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<TicketDto>> rejectTicket(
            @PathVariable String id,
            @Valid @RequestBody RejectTicketRequest request) {
        TicketDto ticket = ticketService.rejectTicket(id, request);
        return ResponseEntity.ok(ApiResponse.success("Ticket rejected successfully", ticket));
    }

    @PostMapping("/{id}/resolution")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<TicketDto>> updateResolutionNotes(
            @PathVariable String id,
            @Valid @RequestBody ResolutionNotesRequest request) {
        TicketDto ticket = ticketService.updateResolutionNotes(id, request);
        return ResponseEntity.ok(ApiResponse.success("Resolution notes saved", ticket));
    }

    @GetMapping("/{id}/comments")
    @PreAuthorize("hasAnyRole('STUDENT','ADMIN')")
    public ResponseEntity<ApiResponse<List<Comment>>> getComments(@PathVariable String id, Authentication authentication) {
        List<Comment> comments = ticketService.getComments(id, authentication.getName(), isAdmin(authentication));
        return ResponseEntity.ok(ApiResponse.success("Comments retrieved", comments));
    }

    @PostMapping("/{id}/comments")
    @PreAuthorize("hasAnyRole('STUDENT','ADMIN')")
    public ResponseEntity<ApiResponse<Comment>> addComment(
            @PathVariable String id,
            @Valid @RequestBody CommentRequest request,
            Authentication authentication) {
        Comment comment = ticketService.addComment(id, request, authentication.getName(), isAdmin(authentication));
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Comment added", comment));
    }

    @PutMapping("/{id}/comments/{commentId}")
    @PreAuthorize("hasAnyRole('STUDENT','ADMIN')")
    public ResponseEntity<ApiResponse<Comment>> updateComment(
            @PathVariable String id,
            @PathVariable String commentId,
            @Valid @RequestBody CommentRequest request,
            Authentication authentication) {
        Comment comment = ticketService.updateComment(id, commentId, request, authentication.getName(), isAdmin(authentication));
        return ResponseEntity.ok(ApiResponse.success("Comment updated", comment));
    }

    @DeleteMapping("/{id}/comments/{commentId}")
    @PreAuthorize("hasAnyRole('STUDENT','ADMIN')")
    public ResponseEntity<ApiResponse<Object>> deleteComment(
            @PathVariable String id,
            @PathVariable String commentId,
            Authentication authentication) {
        ticketService.deleteComment(id, commentId, authentication.getName(), isAdmin(authentication));
        return ResponseEntity.ok(ApiResponse.success("Comment deleted", null));
    }

    @ExceptionHandler(NoSuchElementException.class)
    public ResponseEntity<ApiResponse<Object>> handleNotFound(NoSuchElementException exception) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.error(exception.getMessage()));
    }

    @ExceptionHandler({IllegalArgumentException.class, IllegalStateException.class})
    public ResponseEntity<ApiResponse<Object>> handleBadRequest(RuntimeException exception) {
        return ResponseEntity.badRequest().body(ApiResponse.error(exception.getMessage()));
    }

    private boolean isAdmin(Authentication authentication) {
        return authentication.getAuthorities()
                .stream()
                .anyMatch(authority -> "ROLE_ADMIN".equals(authority.getAuthority()));
    }
}
