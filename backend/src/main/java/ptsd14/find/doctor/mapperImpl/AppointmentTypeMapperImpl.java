package ptsd14.find.doctor.mapperImpl;

import org.springframework.stereotype.Component;
import ptsd14.find.doctor.dto.AppointmentTypeDto;
import ptsd14.find.doctor.mapper.AppointmentTypeMapper;
import ptsd14.find.doctor.model.AppointmentType;

@Component
public class AppointmentTypeMapperImpl implements AppointmentTypeMapper {

    @Override
    public AppointmentTypeDto toDto(AppointmentType entity) {
        if (entity == null) {
            return null;
        }

        AppointmentTypeDto dto = new AppointmentTypeDto();
        dto.setId(entity.getId());
        dto.setName(entity.getName());
        dto.setPrice(entity.getPrice());
        dto.setCreatedAt(entity.getCreatedAt());
        dto.setUpdatedAt(entity.getUpdatedAt());
        return dto;
    }

    @Override
    public AppointmentType toEntity(AppointmentTypeDto dto) {
        if (dto == null) {
            return null;
        }

        AppointmentType entity = new AppointmentType();
        entity.setId(dto.getId());
        entity.setName(dto.getName());
        entity.setPrice(dto.getPrice());
        return entity;
    }

    @Override
    public void updateFromDto(AppointmentTypeDto dto, AppointmentType entity) {
        if (dto == null) {
            return;
        }

        if (dto.getName() != null) {
            entity.setName(dto.getName());
        }
        if (dto.getPrice() != null) {
            entity.setPrice(dto.getPrice());
        }
    }
}

