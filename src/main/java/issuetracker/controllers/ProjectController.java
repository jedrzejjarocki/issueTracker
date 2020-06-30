package issuetracker.controllers;

import issuetracker.dtos.ProjectDto;
import issuetracker.dtos.common.DtoMapper;
import issuetracker.exceptions.ResourceNotFoundException;
import issuetracker.models.Project;
import issuetracker.services.ProjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.Set;
import java.util.stream.Collectors;


@RestController
@RequestMapping(value = "/api/projects")
@RequiredArgsConstructor
public class ProjectController {
    private final ProjectService service;
    private final DtoMapper<Project, ProjectDto> mapper;

    @GetMapping
    public Set<ProjectDto> getAll(Principal principal) {
        return service.getAllByUsername(principal.getName())
                .stream().map(project -> mapper.toDto(project, new ProjectDto()))
                .collect(Collectors.toSet());
    }

    //@TODO allow only if user is team member
    @GetMapping("/{id}")
    public ProjectDto getById(@PathVariable int id) {
        return mapper.toDto(service.getById(id), new ProjectDto());
    }

    @PostMapping
    public ProjectDto create(@RequestBody Project project, Principal principal) throws ResourceNotFoundException {
        return mapper.toDto(service.createProject(project, principal.getName()), new ProjectDto());
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable int id) {
        service.delete(id);
    }
}
