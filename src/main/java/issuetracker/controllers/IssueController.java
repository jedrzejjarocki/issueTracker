package issuetracker.controllers;

import issuetracker.dtos.IssueDto;
import issuetracker.dtos.IssueHistoryDto;
import issuetracker.dtos.common.DtoMapper;
import issuetracker.exceptions.InvalidVersionException;
import issuetracker.models.Issue;
import issuetracker.services.IssueService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/issues")
@RequiredArgsConstructor
public class IssueController {

    private final IssueService service;
    private final DtoMapper<Issue, IssueDto> mapper;

    @GetMapping("/{id}/history")
    public List<IssueHistoryDto> getHistory(@PathVariable int id) {
        return service.getHistory(id);
    }

    @PostMapping
    public IssueDto create(@RequestBody Issue issue) {
        return mapper.toDto(service.addIssue(issue), new IssueDto());
    }

    @PutMapping
    public IssueDto update(@RequestBody Issue issue) throws InvalidVersionException {
        return mapper.toDto(service.updateIssue(issue), new IssueDto());
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable int id) {
        service.delete(id);
    }
}
