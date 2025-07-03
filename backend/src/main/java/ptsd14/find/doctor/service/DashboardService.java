package ptsd14.find.doctor.service;


import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ptsd14.find.doctor.dto.DashboardStatsDto;
import ptsd14.find.doctor.model.Appointment;
import ptsd14.find.doctor.repository.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final DoctorRepository doctorRepository;
    private final PatientRepository patientRepository;
    private final AppointmentRepository appointmentRepository;
    private final SpecializationRepos specializationRepository;
    private final PaymentRepository paymentRepository;

    public DashboardStatsDto getDashboardStats() {
    DashboardStatsDto dto = new DashboardStatsDto();

    dto.setDoctorCount(doctorRepository.count());
    dto.setPatientCount(patientRepository.count());
    dto.setAppointmentCount(appointmentRepository.count());
    dto.setSpecializationCount(specializationRepository.count());

    BigDecimal totalRevenue = paymentRepository.sumTotalRevenue();
    dto.setTotalRevenue(totalRevenue != null ? totalRevenue : BigDecimal.ZERO);

    // Pass start date for last 30 days revenue
    List<DashboardStatsDto.DailyRevenue> dailyRevenue = paymentRepository.findRevenueLast30Days(LocalDateTime.now().minusDays(30))
            .stream()
            .map(record -> {
                DashboardStatsDto.DailyRevenue r = new DashboardStatsDto.DailyRevenue();
                r.setDate((LocalDateTime) record[0]);
                r.setRevenue((BigDecimal) record[1]);
                return r;
            })
            .collect(Collectors.toList());
    dto.setRevenueLast30Days(dailyRevenue);

    return dto;
}

    public List<DashboardStatsDto.AppointmentSummary> getUpcomingAppointments() {
    List<Appointment> upcoming = appointmentRepository
        .findTop5ByDateTimeAfterOrderByDateTimeAsc(LocalDateTime.now());

    return upcoming.stream()
        .map(a -> {
            DashboardStatsDto.AppointmentSummary s = new DashboardStatsDto.AppointmentSummary();
            s.setId(a.getId());
            s.setPatientName(a.getPatient().getFirstname() + " " + a.getPatient().getLastname());
            s.setDoctorName(a.getDoctor().getFirstname() + " " + a.getDoctor().getLastname());
            s.setTypeName(a.getAppointmentType().getName());
            s.setStatus(a.getStatus());
            return s;
        })
        .collect(Collectors.toList());
}

}

