package issuetracker.controllers;

import issuetracker.dtos.IssueContainer.IssueContainerDto;
import issuetracker.dtos.IssueContainer.SprintDto;
import issuetracker.dtos.common.DtoMapper;
import issuetracker.models.issueContainer.IssueContainer;
import issuetracker.models.issueContainer.Sprint;
import issuetracker.services.SprintService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

// @Todo leader role required
@RestController
@RequestMapping(value = "/api/projects/{projectId}/sprints")
@RequiredArgsConstructor
public class SprintController {
    private final SprintService service;
    private final DtoMapper<IssueContainer, IssueContainerDto> mapper;

    @PostMapping
    public IssueContainerDto createSprint(@PathVariable int projectId, @RequestBody Sprint sprint) {
        return mapper.toDto(service.addSprint(projectId, sprint), new SprintDto());
    }

    @PutMapping("/{sprintId}")
    public IssueContainerDto updateSprint(@PathVariable int sprintId, @RequestBody @Valid Sprint updated) {
        updated.setId(sprintId);
        return mapper.toDto(service.updateSprint(updated), new SprintDto());
    }

    @DeleteMapping("/{sprintId}")
    public void deleteSprint(@PathVariable int sprintId) {
        service.deleteSprint(sprintId);
    }
}
