package ptsd14.find.doctor;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class FindDoctorApplication {

	public static void main(String[] args) {
		SpringApplication.run(FindDoctorApplication.class, args);
	}

}
