package issuetracker.controllers;

import issuetracker.dtos.TeamMemberDto;
import issuetracker.dtos.common.DtoMapper;
import issuetracker.models.TeamMember;
import issuetracker.models.TeamMemberInvitationToken;
import issuetracker.services.TeamMemberService;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnitRunner;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.mockito.Mockito.*;

@RunWith(MockitoJUnitRunner.class)
public class TeamControllerTest {
    @Mock private TeamMemberService service;
    @Mock private DtoMapper<TeamMember, TeamMemberDto> mapper;
    @InjectMocks private TeamController controller;

    @Test
    public void addMember() {
        TeamMember teamMember = new TeamMember();
        when(service.addMember(teamMember)).thenAnswer(i -> {
            TeamMember argument = i.getArgument(0, TeamMember.class);
            argument.setId(1);
            return argument;
        });

        ArgumentCaptor<TeamMember> memberArg = ArgumentCaptor.forClass(TeamMember.class);
        when(mapper.toDto(memberArg.capture(), any(TeamMemberDto.class))).thenAnswer(i -> {
            TeamMember argument = i.getArgument(0, TeamMember.class);
            TeamMemberDto dto = new TeamMemberDto();
            dto.setId(argument.getId());
            return dto;
        });

        TeamMemberDto resultDto = controller.addMember(teamMember);
        verify(service).addMember(teamMember);
        assertEquals(memberArg.getValue().getId(), 1);
        assertEquals(resultDto.getId(), memberArg.getValue().getId());
    }

    @Test
    public void inviteMember() {
        TeamMemberInvitationToken invitation = new TeamMemberInvitationToken();
        controller.inviteMember(invitation);
        verify(service).inviteMember(invitation);
    }

    @Test
    public void updateMember() {
        TeamMember member = new TeamMember();
        when(service.updateMember(member)).thenReturn(member);
        when(mapper.toDto(any(TeamMember.class), any(TeamMemberDto.class))).thenReturn(new TeamMemberDto());

        TeamMemberDto resultDto = controller.updateMember(member);
        verify(service).updateMember(member);
        assertNotNull(resultDto);
    }

    @Test
    public void deleteMember() {
        int id = 1;
        controller.deleteMember(id);
        verify(service).deleteMember(id);
    }
}