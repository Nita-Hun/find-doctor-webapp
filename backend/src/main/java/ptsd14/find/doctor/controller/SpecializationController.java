package ptsd14.find.doctor.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;
import ptsd14.find.doctor.dto.SpecializationDto;
import ptsd14.find.doctor.service.SpecializationService;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/specializations")
@RequiredArgsConstructor
public class SpecializationController {

    private final SpecializationService specializationService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<SpecializationDto>> getAllSpecializations() {
        List<SpecializationDto> list = specializationService.findAll();
        return ResponseEntity.ok(list);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<SpecializationDto> getById(@PathVariable Long id) {
        Optional<SpecializationDto> dto = specializationService.getById(id);
        return dto.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound(). build());
    }

    @GetMapping("/check-name")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Boolean>> checkNameUnique(
            @RequestParam String name,
            @RequestParam(required = false) Long excludeId) {
        boolean isUnique = specializationService.isNameUnique(name, excludeId);
        return ResponseEntity.ok(Map.of("isUnique", isUnique));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<SpecializationDto> create(@RequestBody SpecializationDto dto) {
        SpecializationDto created = specializationService.create(dto);
        return ResponseEntity.ok(created);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<SpecializationDto> update(
            @PathVariable Long id,
            @RequestBody SpecializationDto dto) {
        SpecializationDto updated = specializationService.update(id, dto);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        specializationService.delete(id);
        return ResponseEntity.noContent().build();
    }
}