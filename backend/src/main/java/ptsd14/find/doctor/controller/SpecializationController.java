package ptsd14.find.doctor.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;
import ptsd14.find.doctor.dto.SpecializationDto;
import ptsd14.find.doctor.service.SpecializationService;
import java.util.List;

@RestController
@RequestMapping("/api/specializations")
@RequiredArgsConstructor
public class SpecializationController {

    private final SpecializationService specializationService;

    @GetMapping
    public ResponseEntity<List<SpecializationDto>> getAllSpecializations() {
        List<SpecializationDto> specializations = specializationService.findAll();
        return ResponseEntity.ok(specializations);
    }

    @GetMapping("/{id}")
    public ResponseEntity<SpecializationDto> getSpecializationById(@PathVariable Long id) {
        SpecializationDto specialization = specializationService.findById(id);
        return ResponseEntity.ok(specialization);
    }

    @PostMapping
    public ResponseEntity<SpecializationDto> createSpecialization(@RequestBody SpecializationDto specializationDto) {
        SpecializationDto createdSpecialization = specializationService.create(specializationDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdSpecialization);
    }

    @PostMapping("/{id}")
    public ResponseEntity<SpecializationDto> updateSpecialization(
            @PathVariable Long id,
            @RequestBody SpecializationDto specializationDto) {
        // Verify ID consistency
        if (specializationDto.getId() != null && !id.equals(specializationDto.getId())) {
            throw new IllegalArgumentException("ID in path doesn't match ID in body");
        }
        SpecializationDto updatedSpecialization = specializationService.update(id, specializationDto);
        return ResponseEntity.ok(updatedSpecialization);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSpecialization(@PathVariable Long id) {
        specializationService.delete(id);
        return ResponseEntity.noContent().build();
    }
}