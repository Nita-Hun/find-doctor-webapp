package ptsd14.find.doctor.config;

import org.springframework.context.annotation.Configuration;

import ptsd14.find.doctor.mapper.HospitalMapper;
import ptsd14.find.doctor.mapperImpl.HospitalImpleMapper;

import org.springframework.context.annotation.Bean;

@Configuration
public class MapperConfig {
    @Bean
    public HospitalMapper hospitalMapper() {
        return new HospitalImpleMapper();
    }
}