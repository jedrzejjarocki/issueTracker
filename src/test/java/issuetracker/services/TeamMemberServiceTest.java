package issuetracker.services;

import issuetracker.exceptions.LackOfProjectLeaderNotAllowed;
import issuetracker.exceptions.ResourceNotFoundException;
import issuetracker.exceptions.UserIsAlreadyTeamMemberException;
import issuetracker.models.Project;
import issuetracker.models.TeamMember;
import issuetracker.models.TeamMemberInvitationToken;
import issuetracker.models.User;
import issuetracker.repositories.*;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.internal.util.collections.Sets;
import org.mockito.junit.MockitoJUnitRunner;

import java.io.IOException;
import java.util.Optional;

import static issuetracker.models.TeamMember.ProjectRole.DEVELOPER;
import static issuetracker.models.TeamMember.ProjectRole.LEADER;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

@RunWith(MockitoJUnitRunner.class)
public class TeamMemberServiceTest {

    @Mock private TeamMemberRepository repository;
    @Mock private ProjectRepository projectRepository;
    @Mock private IssueRepository issueRepository;
    @Mock private UserRepository userRepository;
    @Mock private TeamMemberInvitationRepository invitationRepository;
    @Mock private MailSenderService mailSenderService;

    @InjectMocks
    private TeamMemberService service;

    private Project getProjectWithOneLeader() {
        Project project = new Project();

        TeamMember leader = new TeamMember();
        leader.setId(1);
        leader.setRole(LEADER);
        leader.setProject(project);

        project.setTeam(Sets.newSet(leader));
        return project;
    }

    private Project getProjectWithMultipleLeaders() {
        Project project = new Project();

        TeamMember leader = new TeamMember();
        leader.setId(1);
        leader.setRole(LEADER);
        leader.setProject(project);

        TeamMember leader2 = new TeamMember();
        leader2.setId(2);
        leader2.setRole(LEADER);
        leader2.setProject(project);

        project.setTeam(Sets.newSet(leader, leader2));
        return project;
    }

    @Test
    public void getById() {
        when(repository.findById(1)).thenReturn(Optional.of(new TeamMember()));
        when(repository.findById(2)).thenReturn(Optional.empty());

        service.getById(1);
        verify(repository).findById(1);

        assertThrows(ResourceNotFoundException.class, () -> service.getById(2));
    }

    @Test
    public void addMember() {
        User user = new User();
        user.setId(1);

        TeamMember teamMember = new TeamMember();
        teamMember.setUser(user);

        Project project = new Project();
        project.setId(1);
        project.setTeam(Sets.newSet(teamMember));
        teamMember.setProject(project);

        User newUser = new User();
        TeamMember newMember = new TeamMember();
        newMember.setUser(newUser);
        newMember.setProject(project);

        when(projectRepository.findById(project.getId())).thenReturn(Optional.of(project));
        when(repository.save(newMember)).thenReturn(newMember);

        service.addMember(newMember);
        verify(projectRepository).findById(newMember.getProject().getId());
        verify(repository).save(newMember);

        assertThrows(UserIsAlreadyTeamMemberException.class, () -> service.addMember(teamMember));
    }

    @Test
    public void addMemberWithToken() {
        TeamMemberInvitationToken invitation = new TeamMemberInvitationToken();
        when(invitationRepository.findByToken(invitation.getToken())).thenReturn(Optional.of(invitation));
        when(invitationRepository.findByToken("not valid")).thenReturn(Optional.empty());

        service.addMember(new User(), invitation.getToken());
        verify(invitationRepository).findByToken(invitation.getToken());
        verify(repository).save(any(TeamMember.class));

        assertThrows(ResourceNotFoundException.class,() -> service.addMember(new User(), "not valid"));
    }

    @Test public void deleteMemberDeveloper() {
        TeamMember developer = new TeamMember();
        developer.setId(1);
        developer.setRole(DEVELOPER);

        when(repository.findById(developer.getId())).thenReturn(Optional.of(developer));

        service.deleteMember(developer.getId());
        verify(repository).findById(developer.getId());
        verify(issueRepository).replaceAssignee(developer, null);
        verify(repository).delete(developer);
        verifyNoInteractions(projectRepository);
    }

    @Test
    public void deletesLeaderIfMoreLeadersInProject() {
        Project project = getProjectWithMultipleLeaders();
        TeamMember leader = project.getTeam().stream().findFirst().get();

        when(repository.findById(leader.getId())).thenReturn(Optional.of(leader));

        service.deleteMember(leader.getId());
        verify(repository).findById(leader.getId());
        verify(issueRepository).replaceAssignee(leader, null);
        verify(repository).delete(leader);
    }

    @Test
    public void throwsWhenTryingToDeleteOnlyLeader() {
        Project project = getProjectWithOneLeader();
        TeamMember leader = project.getTeam().stream().findFirst().get();

        when(repository.findById(leader.getId())).thenReturn(Optional.of(leader));

        assertThrows(LackOfProjectLeaderNotAllowed.class, () -> {
            service.deleteMember(leader.getId());
            verify(repository).findById(leader.getId());
            verifyNoInteractions(issueRepository);
            verifyNoMoreInteractions(repository);
        });
    }

    @Test
    public void updatesMember() {
        TeamMember fromDb = new TeamMember();
        fromDb.setId(1);
        fromDb.setRole(DEVELOPER);

        TeamMember updated = new TeamMember();
        updated.setId(fromDb.getId());
        updated.setRole(LEADER);

        when(repository.findById(updated.getId())).thenReturn(Optional.of(fromDb));

        service.updateMember(updated);
        verify(repository).save(updated);
    }

    @Test
    public void throwsWhenTryingToChangeRoleOfOnlyLeader() {
        Project project = getProjectWithOneLeader();
        TeamMember leader = project.getTeam().stream().findFirst().get();

        TeamMember updated = new TeamMember();
        updated.setId(leader.getId());
        updated.setRole(DEVELOPER);

        project.setTeam(Sets.newSet(leader));

        when(repository.findById(updated.getId())).thenReturn(Optional.of(leader));

        assertThrows(LackOfProjectLeaderNotAllowed.class, () -> {
            service.updateMember(updated);
            verifyNoInteractions(repository);
        });
    }

    @Test
    public void updatesLeaderIfMoreThanOneLeaderInProject() {
        Project project = getProjectWithMultipleLeaders();
        TeamMember leader = project.getTeam().stream().findFirst().get();

        TeamMember updated = new TeamMember();
        updated.setId(leader.getId());
        updated.setRole(DEVELOPER);

        when(repository.findById(updated.getId())).thenReturn(Optional.of(leader));

        service.updateMember(updated);

        verify(repository).findById(updated.getId());
        verify(repository).save(leader);
    }

    @Test
    public void throwsIfTryingToInviteToNonexistentProject() {
        TeamMemberInvitationToken invitation = new TeamMemberInvitationToken();
        invitation.setProject(new Project());

        when(projectRepository.findById(invitation.getProject().getId())).thenThrow(ResourceNotFoundException.class);

        assertThrows(ResourceNotFoundException.class, () -> {
            service.inviteMember(invitation);
            verify(projectRepository).findById(invitation.getProject().getId());
            verifyNoInteractions(userRepository);
            verifyNoInteractions(invitationRepository);
            verifyNoInteractions(mailSenderService);
        });
    }

    @Test
    public void addsMemberIfInvitedUserInDb() {
        TeamMemberInvitationToken invitation = new TeamMemberInvitationToken();
        Project project = new Project();
        project.setId(1);
        invitation.setProject(project);
        invitation.setEmail("test@test.com");

        when(projectRepository.findById(project.getId())).thenReturn(Optional.of(project));
        when(userRepository.findByEmail(invitation.getEmail())).thenReturn(Optional.of(new User()));

        service.inviteMember(invitation);
        verify(projectRepository, times(2)).findById(invitation.getProject().getId());
        verify(userRepository).findByEmail(invitation.getEmail());
        verify(repository).save(any(TeamMember.class));
        verifyNoInteractions(invitationRepository);
        verifyNoInteractions(mailSenderService);
    }

    @Test
    public void callsMailServiceIfUserNotInDb() throws IOException {
        TeamMemberInvitationToken invitation = new TeamMemberInvitationToken();
        Project project = new Project();
        project.setId(1);
        invitation.setProject(project);
        invitation.setEmail("notInDb@test.com");

        when(projectRepository.findById(project.getId())).thenReturn(Optional.of(project));
        when(userRepository.findByEmail(invitation.getEmail())).thenReturn(Optional.empty());

        service.inviteMember(invitation);
        verify(projectRepository).findById(invitation.getProject().getId());
        verify(userRepository).findByEmail(invitation.getEmail());

        verifyNoInteractions(repository);
        verifyNoMoreInteractions(projectRepository);
        verify(invitationRepository).save(invitation);
        verify(mailSenderService).inviteNewUser(invitation);
    }
}