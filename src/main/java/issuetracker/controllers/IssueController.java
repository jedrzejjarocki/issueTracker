package issuetracker.controllers;

import issuetracker.dtos.common.DtoMapper;
import issuetracker.dtos.issue.IssueDto;
import issuetracker.dtos.issue.IssueHistoryDto;
import issuetracker.exceptions.InvalidVersionException;
import issuetracker.models.issue.Issue;
import issuetracker.services.IssueService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects/{projectId}/issues")
@RequiredArgsConstructor
public class IssueController {

    private final IssueService service;
    private final DtoMapper<Issue, IssueDto> mapper;

    @GetMapping("/{id}/history")
    public List<IssueHistoryDto> getHistory(@PathVariable int id) {
        return service.getHistory(id);
    }

    @PostMapping
    public IssueDto create(@PathVariable int projectId, @RequestBody Issue issue, @RequestParam(required = false) Integer sprintId) {
        return mapper.toDto(service.addIssue(issue, projectId, sprintId), new IssueDto());
    }

    @PutMapping("/{id}")
    public IssueDto update(@PathVariable int id, @RequestBody Issue issue, @RequestParam(required = false) Integer listId) throws InvalidVersionException {
        return mapper.toDto(service.updateIssue(issue, 0, listId), new IssueDto());
    }

    @DeleteMapping("/{issueId}")
    public void delete(@PathVariable int issueId) {
        service.delete(issueId);
    }
}
