package issuetracker.services;

import issuetracker.exceptions.LackOfProjectLeaderNotAllowed;
import issuetracker.exceptions.ResourceNotFoundException;
import issuetracker.exceptions.UserIsAlreadyTeamMemberException;
import issuetracker.models.Project;
import issuetracker.models.TeamMember;
import issuetracker.repositories.IssueRepository;
import issuetracker.repositories.ProjectRepository;
import issuetracker.repositories.TeamMemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.Iterator;

@Service
@RequiredArgsConstructor
public class TeamMemberService {
    private final TeamMemberRepository repository;
    private final ProjectRepository projectRepository;
    private final IssueRepository issueRepository;

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
}
