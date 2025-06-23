package ptsd14.find.doctor.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import lombok.RequiredArgsConstructor;
import ptsd14.find.doctor.dto.HospitalDto;
import ptsd14.find.doctor.service.HospitalService;

import java.util.List;

@RestController
@RequestMapping("/api/hospitals")
@RequiredArgsConstructor
public class HospitalController {

    private final HospitalService hospitalService;

    @GetMapping
    public ResponseEntity<List<HospitalDto>> getAllHospitals() {
        List<HospitalDto> hospitals = hospitalService.findAll();
        return ResponseEntity.ok(hospitals);
    }

    @GetMapping("/{id}")
    public ResponseEntity<HospitalDto> getHospitalById(@PathVariable Long id) {
        HospitalDto hospital = hospitalService.findById(id);
        return ResponseEntity.ok(hospital);
    }

    @PostMapping
    public ResponseEntity<HospitalDto> createHospital(@RequestBody HospitalDto hospitalDto) {
        HospitalDto createdHospital = hospitalService.create(hospitalDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdHospital);
    }

    @PostMapping("/{id}")
    public ResponseEntity<HospitalDto> updateHospital(
            @PathVariable Long id,
            @RequestBody HospitalDto hospitalDto) {
        HospitalDto updatedHospital = hospitalService.update(id, hospitalDto);
        return ResponseEntity.ok(updatedHospital);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteHospital(@PathVariable Long id) {
        hospitalService.delete(id);
        return ResponseEntity.noContent().build();
    }
}