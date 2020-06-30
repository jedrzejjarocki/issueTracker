package issuetracker.controllers;

import issuetracker.dtos.TeamMemberDto;
import issuetracker.dtos.common.DtoMapper;
import issuetracker.exceptions.ResourceNotFoundException;
import issuetracker.exceptions.UserIsAlreadyTeamMemberException;
import issuetracker.models.TeamMember;
import issuetracker.models.TeamMemberInvitationToken;
import issuetracker.services.TeamMemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

// @Todo leader role required
@RestController
@RequestMapping("/api/members")
@RequiredArgsConstructor
public class TeamController {
    private final TeamMemberService service;
    private final DtoMapper<TeamMember, TeamMemberDto> mapper;

    @PostMapping
    public TeamMemberDto addMember(@RequestBody TeamMember member) throws UserIsAlreadyTeamMemberException, ResourceNotFoundException {
        return mapper.toDto(service.addMember(member), new TeamMemberDto());
    }

    @PostMapping("/invitations")
    public void inviteMember(@RequestBody TeamMemberInvitationToken invitationToken) {
        service.inviteMember(invitationToken);
    }

    @PutMapping
    public TeamMemberDto updateMember(@RequestBody TeamMember member) throws ResourceNotFoundException {
        return mapper.toDto(service.updateMember(member), new TeamMemberDto());
    }

    @DeleteMapping("/{teamMemberId}")
    public void deleteMember(@PathVariable int teamMemberId) throws ResourceNotFoundException {
        service.deleteMember(teamMemberId);
    }
}
