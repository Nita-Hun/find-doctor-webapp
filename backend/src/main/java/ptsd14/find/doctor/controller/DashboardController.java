package ptsd14.find.doctor.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import ptsd14.find.doctor.dto.DashboardStatsDto;
import ptsd14.find.doctor.repository.AppointmentRepository;
import ptsd14.find.doctor.repository.DoctorRepository;
import ptsd14.find.doctor.repository.PatientRepository;
import ptsd14.find.doctor.repository.SpecializationRepos;
import ptsd14.find.doctor.service.DashboardService;


@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    @Autowired
    private DoctorRepository doctorRepository;
    @Autowired
    private PatientRepository patientRepository;
    @Autowired
    private AppointmentRepository appointmentRepository;
    @Autowired
    private SpecializationRepos specializationRepository;
    @Autowired
    private DashboardService dashboardService;

    @GetMapping("/counts")
    @PreAuthorize("hasRole('ADMIN')")
    public Map<String, Long> getCounts() {
        Map<String, Long> counts = new HashMap<>();
        counts.put("doctors", doctorRepository.count());
        counts.put("patients", patientRepository.count());
        counts.put("appointments", appointmentRepository.count());
        counts.put("specializations", specializationRepository.count());
        return counts;
    }
    @GetMapping("/revenue")
    @PreAuthorize("hasRole('ADMIN')")
    public List<Map<String, Object>> getRevenueData() {
        List<Map<String, Object>> stats = new ArrayList<>();

        // Example static data
        stats.add(Map.of(
            "month", "Jan",
            "revenue", 5000
        ));
        stats.add(Map.of(
            "month", "Feb",
            "revenue", 6200
        ));
        stats.add(Map.of(
            "month", "Mar",
            "revenue", 5800
        ));
        stats.add(Map.of(
            "month", "Apr",
            "revenue", 7500
        ));

        return stats;
    }
    @GetMapping("/stats")
    @PreAuthorize("hasRole('ADMIN')")
    public DashboardStatsDto getDashboardStats() {
        return dashboardService.getDashboardStats();
    }
    @GetMapping("/upcoming")
    @PreAuthorize("hasRole('ADMIN')")
    public List<DashboardStatsDto.AppointmentSummary> getUpcomingAppointments() {
            return dashboardService.getUpcomingAppointments();
    }
}


