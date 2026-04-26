package com.smartcampus.backend.modules.tickets.service;

import com.smartcampus.backend.modules.tickets.entity.TicketAttachment;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

@Service
public class TicketFileStorageService {

    private static final long MAX_FILE_SIZE = 5 * 1024 * 1024;

    @Value("${app.uploads.ticket-dir:uploads/tickets}")
    private String ticketUploadDir;

    public List<TicketAttachment> storeImages(MultipartFile[] files) {
        if (files == null || files.length == 0) {
            return List.of();
        }

        List<MultipartFile> usableFiles = List.of(files).stream()
                .filter(file -> file != null && !file.isEmpty())
                .toList();

        if (usableFiles.size() > 3) {
            throw new IllegalArgumentException("A ticket can include up to 3 image attachments.");
        }

        Path uploadPath = uploadPath();
        try {
            Files.createDirectories(uploadPath);
        } catch (IOException exception) {
            throw new IllegalStateException("Could not create ticket upload directory.", exception);
        }

        List<TicketAttachment> attachments = new ArrayList<>();
        for (MultipartFile file : usableFiles) {
            validateImage(file);
            String originalName = StringUtils.cleanPath(file.getOriginalFilename() == null ? "ticket-image" : file.getOriginalFilename());
            String storedName = UUID.randomUUID() + extensionFrom(originalName, file.getContentType());
            Path destination = uploadPath.resolve(storedName).normalize();

            if (!destination.startsWith(uploadPath)) {
                throw new IllegalArgumentException("Invalid file name.");
            }

            try {
                Files.copy(file.getInputStream(), destination, StandardCopyOption.REPLACE_EXISTING);
            } catch (IOException exception) {
                throw new IllegalStateException("Could not store ticket attachment.", exception);
            }

            attachments.add(TicketAttachment.builder()
                    .originalFileName(originalName)
                    .storedFileName(storedName)
                    .contentType(file.getContentType())
                    .url("/uploads/tickets/" + storedName)
                    .size(file.getSize())
                    .build());
        }

        return attachments;
    }

    public void deleteImages(List<TicketAttachment> attachments) {
        if (attachments == null || attachments.isEmpty()) {
            return;
        }

        Path uploadPath = uploadPath();
        attachments.forEach(attachment -> {
            if (attachment.getStoredFileName() == null) {
                return;
            }
            try {
                Path filePath = uploadPath.resolve(attachment.getStoredFileName()).normalize();
                if (filePath.startsWith(uploadPath)) {
                    Files.deleteIfExists(filePath);
                }
            } catch (IOException ignored) {
                // Deleting the ticket should not fail because an old image is already missing.
            }
        });
    }

    private void validateImage(MultipartFile file) {
        if (file.getSize() > MAX_FILE_SIZE) {
            throw new IllegalArgumentException("Each attachment must be 5MB or smaller.");
        }

        String contentType = file.getContentType();
        if (contentType == null || !contentType.toLowerCase().startsWith("image/")) {
            throw new IllegalArgumentException("Only image attachments are allowed.");
        }
    }

    private String extensionFrom(String fileName, String contentType) {
        int dot = fileName.lastIndexOf('.');
        if (dot >= 0 && dot < fileName.length() - 1) {
            String extension = fileName.substring(dot).toLowerCase();
            if (extension.matches("\\.[a-z0-9]{1,8}")) {
                return extension;
            }
        }

        if ("image/png".equalsIgnoreCase(contentType)) return ".png";
        if ("image/gif".equalsIgnoreCase(contentType)) return ".gif";
        if ("image/webp".equalsIgnoreCase(contentType)) return ".webp";
        return ".jpg";
    }

    private Path uploadPath() {
        return Paths.get(ticketUploadDir).toAbsolutePath().normalize();
    }
}
