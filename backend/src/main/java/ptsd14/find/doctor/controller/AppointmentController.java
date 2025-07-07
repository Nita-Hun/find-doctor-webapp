package ptsd14.find.doctor.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import ptsd14.find.doctor.dto.AppointmentDto;
import ptsd14.find.doctor.service.AppointmentService;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/appointments")
@RequiredArgsConstructor
@CrossOrigin
public class AppointmentController {

    private final AppointmentService appointmentService;


    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<AppointmentDto>> getAllAppointments(
        @RequestParam(required = false, defaultValue = "0") Integer page,
        @RequestParam(defaultValue = "10") int size,
        @RequestParam(required = false) String search
    ) {
        int pageNumber = (page != null && page >= 0) ? page : 0;

        var pageable = PageRequest.of(pageNumber, size, Sort.by(Sort.Direction.ASC, "doctorFirstname"));
        Page<AppointmentDto> appointmentsPage = appointmentService.getAll(pageable, search);

        return ResponseEntity.ok(appointmentsPage);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AppointmentDto> getById(@PathVariable Long id) {
        return appointmentService.getById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping(consumes = "multipart/form-data")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AppointmentDto> create(
            @RequestParam("doctorId") Long doctorId,
            @RequestParam("patientId") Long patientId,
            @RequestParam("appointmentTypeId") Long appointmentTypeId,
            @RequestParam("dateTime") LocalDateTime dateTime,
            @RequestParam("note") String note,
            @RequestParam(value = "attachment", required = false) MultipartFile attachment
    ) {
        AppointmentDto dto = new AppointmentDto();
        dto.setDoctorId(doctorId);
        dto.setPatientId(patientId);
        dto.setAppointmentTypeId(appointmentTypeId);
        dto.setDateTime(dateTime);
        dto.setNote(note);

        // If a file is attached, upload it and set the URL
        if (attachment != null && !attachment.isEmpty()) {
            String fileUrl = saveAttachmentFile(attachment);
            dto.setAttachment(fileUrl);
        }

        return ResponseEntity.ok(appointmentService.create(dto));
    }

    @PutMapping(value = "/{id}", consumes = "multipart/form-data")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AppointmentDto> update(
            @PathVariable Long id,
            @RequestParam("doctorId") Long doctorId,
            @RequestParam("patientId") Long patientId,
            @RequestParam("appointmentTypeId") Long appointmentTypeId,
            @RequestParam("dateTime") LocalDateTime dateTime,
            @RequestParam("note") String note,
            @RequestParam(value = "attachment", required = false) MultipartFile attachment
    ) {
        AppointmentDto dto = new AppointmentDto();
        dto.setDoctorId(doctorId);
        dto.setPatientId(patientId);
        dto.setAppointmentTypeId(appointmentTypeId);
        dto.setDateTime(dateTime);
        dto.setNote(note);

        if (attachment != null && !attachment.isEmpty()) {
            String fileUrl = saveAttachmentFile(attachment);
            dto.setAttachment(fileUrl);
        }

        return ResponseEntity.ok(appointmentService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        appointmentService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/upload")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> uploadAttachment(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("File is empty");
        }

        String fileUrl = saveAttachmentFile(file);
        return ResponseEntity.ok(fileUrl);
    }

    private String saveAttachmentFile(MultipartFile file) {
        try {
            String filename = System.currentTimeMillis() + "_" + file.getOriginalFilename();
            String uploadDir = "uploads/appointments/";
            File dir = new File(uploadDir);
            if (!dir.exists()) {
                dir.mkdirs();
            }
            Path filepath = Paths.get(uploadDir + filename);
            Files.write(filepath, file.getBytes());
            return "/uploads/appointments/" + filename;
        } catch (IOException e) {
            throw new RuntimeException("Failed to save attachment file", e);
        }
    }
}
