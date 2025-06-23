package ptsd14.find.doctor.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ptsd14.find.doctor.dto.DoctorDto;
import ptsd14.find.doctor.service.DoctorService;

@RestController
@RequestMapping("/api/doctors")
@RequiredArgsConstructor
@CrossOrigin
public class DoctorController {

    private final DoctorService doctorService;

    @GetMapping
    public ResponseEntity<Page<DoctorDto>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return ResponseEntity.ok(doctorService.getAll(PageRequest.of(page, size)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<DoctorDto> getById(@PathVariable Long id) {
        return doctorService.getById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<DoctorDto> create(@RequestBody DoctorDto dto) {
        return ResponseEntity.ok(doctorService.create(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<DoctorDto> update(@PathVariable Long id, @RequestBody DoctorDto dto) {
        return ResponseEntity.ok(doctorService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        doctorService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
