package issuetracker.controllers;

import issuetracker.dtos.common.DtoMapper;
import issuetracker.dtos.teamMember.TeamMemberDto;
import issuetracker.exceptions.ResourceNotFoundException;
import issuetracker.exceptions.UserIsAlreadyTeamMemberException;
import issuetracker.models.TeamMemberCreationRequestBody;
import issuetracker.models.TeamMemberUpdateRequestBody;
import issuetracker.models.project.TeamMember;
import issuetracker.services.TeamMemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

// @Todo leader role required
@RestController
@RequestMapping("/api/projects/{projectId}/team")
@RequiredArgsConstructor
public class TeamController {
    private final TeamMemberService service;
    private final DtoMapper<TeamMember, TeamMemberDto> mapper;

    @PostMapping
    public TeamMemberDto addMember(@RequestBody TeamMemberCreationRequestBody requestBody,
                                   @PathVariable int projectId)
            throws UserIsAlreadyTeamMemberException, ResourceNotFoundException {
        return mapper.toDto(service.addMember(projectId, requestBody), new TeamMemberDto());
    }

    @PutMapping("/{teamMemberId}")
    public TeamMemberDto updateMember(@RequestBody TeamMemberUpdateRequestBody requestBody,
                                      @PathVariable int projectId, @PathVariable int teamMemberId)
            throws ResourceNotFoundException {
        return mapper.toDto(service.updateMember(requestBody, teamMemberId, projectId), new TeamMemberDto());
    }

    @DeleteMapping("/{teamMemberId}")
    public void deleteMember(@PathVariable int projectId, @PathVariable int teamMemberId)
            throws ResourceNotFoundException {
        service.deleteMember(projectId, teamMemberId);
    }
}
