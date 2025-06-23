package ptsd14.find.doctor.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import ptsd14.find.doctor.model.AppointmentType;
import ptsd14.find.doctor.service.AppointmentTypeService;

@RestController
@RequestMapping("/api/appointment-types")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class AppointmentTypeController {

    private final AppointmentTypeService typeService;

    @GetMapping
    public ResponseEntity<Page<AppointmentType>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(typeService.getAll(PageRequest.of(page, size)));
    }
    @GetMapping("/{id}")
    public ResponseEntity<AppointmentType> getById(@PathVariable Long id) {
        return typeService.getById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
public ResponseEntity<?> create(@Valid @RequestBody AppointmentType type, BindingResult result) {
    if (result.hasErrors()) {
        Map<String, String> errors = new HashMap<>();
        result.getFieldErrors().forEach(error ->
            errors.put(error.getField(), error.getDefaultMessage())
        );
        return ResponseEntity.badRequest().body(errors);
    }
    AppointmentType saved = typeService.create(type);
    return ResponseEntity.status(HttpStatus.CREATED).body(saved);
}
    @PutMapping("/{id}")
    public ResponseEntity<AppointmentType> update(@PathVariable Long id, @RequestBody AppointmentType updateType) {
        AppointmentType type = typeService.findById(id)
        .orElseThrow(() -> new RuntimeException("Type is not found"));
        type.setName(updateType.getName());
        type.setPrice(updateType.getPrice());
        return ResponseEntity.ok(typeService.update(id, type));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        typeService.delete(id);
        return ResponseEntity.noContent().build();
    }
    
}
