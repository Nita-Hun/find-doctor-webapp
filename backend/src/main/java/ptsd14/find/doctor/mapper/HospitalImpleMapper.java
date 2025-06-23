package ptsd14.find.doctor.mapper;

import org.springframework.aot.generate.Generated;
import org.springframework.stereotype.Component;

import ptsd14.find.doctor.dto.HospitalDto;
import ptsd14.find.doctor.model.Hospital;

@Generated
@Component
public class HospitalImpleMapper implements HospitalMapper {

    @Override
    public HospitalDto toDto(Hospital hospital) {
        if (hospital == null) {
            return null;
        }
        
        HospitalDto hospitalDto = new HospitalDto();
        hospitalDto.setId(hospital.getId());
        hospitalDto.setName(hospital.getName());
        hospitalDto.setAddress(hospital.getAddress());
        hospitalDto.setPhone(hospital.getPhone());
        return hospitalDto;
    }

    @Override
    public Hospital toEntity(HospitalDto dto) {
        if (dto == null) {
            return null;
        }
        
        Hospital hospital = new Hospital();
        hospital.setId(dto.getId());
        hospital.setName(dto.getName());
        hospital.setAddress(dto.getAddress());
        hospital.setPhone(dto.getPhone());
        return hospital;
    }

    @Override
    public void updateFromDto(HospitalDto dto, Hospital entity) {
        if (dto == null) {
            return;
        }
        
        if (dto.getName() != null) {
            entity.setName(dto.getName());
        }
        if (dto.getAddress() != null) {
            entity.setAddress(dto.getAddress());
        }
        if (dto.getPhone() != null) {
            entity.setPhone(dto.getPhone());
        }
    }
    
}
