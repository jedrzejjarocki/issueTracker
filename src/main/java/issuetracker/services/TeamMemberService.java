package issuetracker.services;

import issuetracker.exceptions.LackOfProjectLeaderNotAllowed;
import issuetracker.exceptions.ResourceNotFoundException;
import issuetracker.exceptions.UserIsAlreadyTeamMemberException;
import issuetracker.models.Project;
import issuetracker.models.TeamMember;
import issuetracker.models.TeamMemberInvitationToken;
import issuetracker.models.User;
import issuetracker.repositories.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.io.IOException;
import java.util.Iterator;

@Service
@RequiredArgsConstructor
public class TeamMemberService {
    private final TeamMemberRepository repository;
    private final ProjectRepository projectRepository;
    private final IssueRepository issueRepository;
    private final UserRepository userRepository;
    private final TeamMemberInvitationRepository invitationRepository;
    private final MailSenderService mailSenderService;

    TeamMember getById(int id) {
        return repository.findById(id).orElseThrow(ResourceNotFoundException::new);
    }

    private void ensureUserNotAddedAlready(int projectId, int userId) throws UserIsAlreadyTeamMemberException {
        Project project = projectRepository.findById(projectId).orElseThrow(ResourceNotFoundException::new);
        boolean alreadyAdded = project.getTeam().stream().anyMatch(member -> member.getUser().getId() == userId);
        if (alreadyAdded) throw new UserIsAlreadyTeamMemberException();
    }

    public TeamMember addMember(TeamMember teamMember) {
        ensureUserNotAddedAlready(teamMember.getProject().getId(), teamMember.getUser().getId());
        return repository.save(teamMember);
    }

    public void addMember(User user, String token) {
        TeamMemberInvitationToken invitation = invitationRepository.findByToken(token).orElseThrow(ResourceNotFoundException::new);
        TeamMember teamMember = new TeamMember();
        teamMember.setUser(user);
        teamMember.setProject(invitation.getProject());
        teamMember.setRole(invitation.getRole());
        repository.save(teamMember);
        invitationRepository.delete(invitation);
    }

    @Transactional
    public void deleteMember(int teamMemberId) {
        TeamMember member = getById(teamMemberId);

        if (member.getRole().equals(TeamMember.ProjectRole.LEADER)) {
            ensureEnoughLeadersInProject(member.getProject());
        }

        issueRepository.replaceAssignee(member, null);
        repository.delete(member);
    }

    public TeamMember updateMember(TeamMember updated) {
        TeamMember member = getById(updated.getId());

        if (member.getRole().equals(TeamMember.ProjectRole.LEADER)
                && updated.getRole().equals(TeamMember.ProjectRole.DEVELOPER)) {
            ensureEnoughLeadersInProject(member.getProject());
        }

        member.setRole(updated.getRole());
        return repository.save(member);
    }

    /*
    At least one LEADER required
    Throws exception if deleting/changing role of team member
    would make project unmanageable
    */
    private void ensureEnoughLeadersInProject(Project project) throws LackOfProjectLeaderNotAllowed {
        int numOfLeaders = 0;
        Iterator<TeamMember> members = project.getTeam().iterator();

        while (members.hasNext() && numOfLeaders < 2) {
            if (members.next().getRole().equals(TeamMember.ProjectRole.LEADER)) {
                numOfLeaders++;
            }
        }

        if (numOfLeaders < 2) {
            throw new LackOfProjectLeaderNotAllowed();
        }
    }

    public void inviteMember(TeamMemberInvitationToken invitation) {
        Project project = projectRepository
                .findById(invitation.getProject().getId())
                .orElseThrow(ResourceNotFoundException::new);

        userRepository.findByEmail(invitation.getEmail()).ifPresentOrElse(user -> {
            TeamMember teamMember = new TeamMember();
            teamMember.setRole(invitation.getRole());
            teamMember.setProject(project);
            teamMember.setUser(user);
            addMember(teamMember);
        }, () -> {
            try {
                invitationRepository.save(invitation);
                mailSenderService.inviteNewUser(invitation);
            } catch (IOException e) {
                e.printStackTrace();
            }
        });

    }
}
