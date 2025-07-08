// package ptsd14.find.doctor.controller;

// import lombok.RequiredArgsConstructor;
// import org.springframework.web.bind.annotation.*;
// import ptsd14.find.doctor.model.RolePermission;
// import ptsd14.find.doctor.repository.RolePermissionRepos;

// import java.util.List;

// @RestController
// @RequestMapping("/api/permissions")
// @RequiredArgsConstructor
// public class PermissionController {

//     private final RolePermissionRepos repo;

//     @GetMapping
//     public List<RolePermission> getAll() {
//         return repo.findAll();
//     }

//     @GetMapping("/role/{role}")
//     public List<RolePermission> getByRole(@PathVariable String role) {
//         return repo.findByRole(Enum.valueOf(ptsd14.find.doctor.model.Role.class, role.toUpperCase()));
//     }

//     @PutMapping("/{id}")
//     public RolePermission update(@PathVariable Long id, @RequestBody RolePermission updated) {
//         RolePermission p = repo.findById(id).orElseThrow();
//         p.setCanView(updated.isCanView());
//         p.setCanCreate(updated.isCanCreate());
//         p.setCanEdit(updated.isCanEdit());
//         p.setCanDelete(updated.isCanDelete());
//         p.setStatus(updated.isStatus());
//         return repo.save(p);
//     }
// }

