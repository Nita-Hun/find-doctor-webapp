package ptsd14.find.doctor.mapper;

import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;
import ptsd14.find.doctor.dto.HospitalDto;
import ptsd14.find.doctor.model.Hospital;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-07-07T15:48:49+0700",
    comments = "version: 1.5.5.Final, compiler: Eclipse JDT (IDE) 3.42.50.v20250628-1110, environment: Java 21.0.7 (Eclipse Adoptium)"
)
@Component
public class HospitalMapperImpl implements HospitalMapper {

    @Override
    public HospitalDto toDto(Hospital hospital) {
        if ( hospital == null ) {
            return null;
        }

        HospitalDto hospitalDto = new HospitalDto();

        hospitalDto.setAddress( hospital.getAddress() );
        hospitalDto.setCreatedAt( hospital.getCreatedAt() );
        hospitalDto.setId( hospital.getId() );
        hospitalDto.setName( hospital.getName() );
        hospitalDto.setPhone( hospital.getPhone() );
        hospitalDto.setUpdatedAt( hospital.getUpdatedAt() );

        return hospitalDto;
    }

    @Override
    public Hospital toEntity(HospitalDto dto) {
        if ( dto == null ) {
            return null;
        }

        Hospital hospital = new Hospital();

        hospital.setAddress( dto.getAddress() );
        hospital.setId( dto.getId() );
        hospital.setName( dto.getName() );
        hospital.setPhone( dto.getPhone() );

        return hospital;
    }

    @Override
    public void updateFromDto(HospitalDto dto, Hospital entity) {
        if ( dto == null ) {
            return;
        }

        if ( dto.getAddress() != null ) {
            entity.setAddress( dto.getAddress() );
        }
        if ( dto.getName() != null ) {
            entity.setName( dto.getName() );
        }
        if ( dto.getPhone() != null ) {
            entity.setPhone( dto.getPhone() );
        }
    }
}
