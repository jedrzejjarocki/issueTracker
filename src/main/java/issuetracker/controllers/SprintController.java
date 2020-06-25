package issuetracker.controllers;

import issuetracker.dtos.IssueContainerDto;
import issuetracker.dtos.SprintDto;
import issuetracker.dtos.common.DtoMapper;
import issuetracker.models.Sprint;
import issuetracker.models.common.IssueContainer;
import issuetracker.services.SprintService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

// @Todo leader role required
@RestController
@RequestMapping(value = "/api/sprints")
@RequiredArgsConstructor
public class SprintController {
    private final SprintService service;
    private final DtoMapper<IssueContainer, IssueContainerDto> mapper;

    @PostMapping
    public IssueContainerDto createSprint(@RequestBody Sprint sprint) { return mapper.toDto(service.addSprint(sprint), new SprintDto()); }

    @PutMapping
    public IssueContainerDto updateSprint(@RequestBody @Valid Sprint updated) { return mapper.toDto(service.updateSprint(updated), new SprintDto()); }

    @DeleteMapping("/{sprintId}")
    public void deleteSprint(@PathVariable int sprintId) {
        service.deleteSprint(sprintId);
    }
}
