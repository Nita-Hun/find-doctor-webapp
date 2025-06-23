package ptsd14.find.doctor.service;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import ptsd14.find.doctor.model.AppointmentType;
import ptsd14.find.doctor.repository.AppointmentTypeRepository;

@Service
@RequiredArgsConstructor
public class AppointmentTypeService {

     private final AppointmentTypeRepository typeRepos;

    // Get all (non-paginated, rarely used in production)
    public List<AppointmentType> getAll() {
        return typeRepos.findAll();
    }

    // Get all with pagination and sorting by updatedAt DESC
    public Page<AppointmentType> getAll(Pageable pageable) {
        Pageable sortedPageable = PageRequest.of(
            pageable.getPageNumber(), 
            pageable.getPageSize(), 
            Sort.by(Sort.Direction.DESC, "updatedAt")
        );
        return typeRepos.findAll(sortedPageable);
    }

    public Optional<AppointmentType> getById(Long id) {
        return typeRepos.findById(id);
    }

    public AppointmentType create(AppointmentType type) {
        return typeRepos.save(type);
    }
    public AppointmentType update(Long id, AppointmentType data) {
        return typeRepos.findById(id)
            .map(existing -> {
                existing.setName(data.getName());
                existing.setPrice(data.getPrice());
                return typeRepos.save(existing);
            })
            .orElseThrow(() -> new RuntimeException("Type not found with ID: " + id));
    }

    public void delete(Long id) {
        typeRepos.deleteById(id);
    }

    public Optional<AppointmentType> findById(Long id) {
        return typeRepos.findById(id);
    }
    
}
