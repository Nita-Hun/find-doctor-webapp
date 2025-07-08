// package ptsd14.find.doctor.controller;

// import lombok.RequiredArgsConstructor;
// import org.springframework.http.ResponseEntity;
// import org.springframework.web.bind.annotation.*;
// import ptsd14.find.doctor.dto.RoleMetadataDto;
// import ptsd14.find.doctor.service.RoleMetadataService;

// import java.util.List;

// @RestController
// @RequestMapping("/api/roles")
// @RequiredArgsConstructor
// public class RoleMetadataController {

//     private final RoleMetadataService service;

//     @GetMapping
//     public ResponseEntity<List<RoleMetadataDto>> getAll() {
//         return ResponseEntity.ok(service.getAll());
//     }

//     @GetMapping("/{role}")
//     public ResponseEntity<RoleMetadataDto> getByRole(@PathVariable String role) {
//         return ResponseEntity.ok(service.getByRole(role));
//     }

//     @PostMapping
//     public ResponseEntity<RoleMetadataDto> create(@RequestBody RoleMetadataDto dto) {
//         return ResponseEntity.ok(service.create(dto));
//     }

//     @PutMapping("/{role}")
//     public ResponseEntity<RoleMetadataDto> update(
//             @PathVariable String role,
//             @RequestBody RoleMetadataDto dto) {
//         return ResponseEntity.ok(service.update(role, dto));
//     }

//     @DeleteMapping("/{role}")
//     public ResponseEntity<?> delete(@PathVariable String role) {
//         service.delete(role);
//         return ResponseEntity.noContent().build();
//     }
// }

