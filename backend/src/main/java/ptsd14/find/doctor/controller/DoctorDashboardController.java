package ptsd14.find.doctor.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ptsd14.find.doctor.dto.DoctorDashboardDto;
import ptsd14.find.doctor.model.Doctor;
import ptsd14.find.doctor.service.DoctorService;

@RestController
@RequestMapping("/api/doctor/dashboard")
@RequiredArgsConstructor
public class DoctorDashboardController {

    private final DoctorService doctorService;

    @GetMapping
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<DoctorDashboardDto> getMyDashboard() {
        Doctor doctor = doctorService.getDoctorForCurrentUser();
        DoctorDashboardDto dto = doctorService.getDashboard(doctor.getId());
        return ResponseEntity.ok(dto);
    }

}

