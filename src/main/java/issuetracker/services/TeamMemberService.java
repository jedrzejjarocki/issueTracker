package issuetracker.services;

import issuetracker.exceptions.LackOfProjectLeaderNotAllowed;
import issuetracker.exceptions.ResourceNotFoundException;
import issuetracker.exceptions.UserIsAlreadyTeamMemberException;
import issuetracker.models.TeamMemberCreationRequestBody;
import issuetracker.models.TeamMemberUpdateRequestBody;
import issuetracker.models.project.Project;
import issuetracker.models.project.TeamMember;
import issuetracker.models.user.User;
import issuetracker.repositories.ProjectRepository;
import issuetracker.repositories.TeamMemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Iterator;

@Service
@RequiredArgsConstructor
public class TeamMemberService {
    private final TeamMemberRepository repository;
    private final ProjectRepository projectRepository;
    private final UserService userService;

    TeamMember getById(int id) {
        return repository.findById(id).orElseThrow(ResourceNotFoundException::new);
    }

    TeamMember createMember(Project project, User user, TeamMember.ProjectRole role) throws UserIsAlreadyTeamMemberException {
        ensureUserNotAddedAlready(project, user);
        TeamMember member = new TeamMember();
        member.setUser(user);
        member.setProject(project);
        member.setRole(role);
        member.setProject(project);
        return repository.save(member);
    }

    private void ensureUserNotAddedAlready(Project project, User user) throws UserIsAlreadyTeamMemberException {
        boolean alreadyAdded = project.getTeam().stream().anyMatch(member -> member.getUser().getId() == user.getId());
        if (alreadyAdded) throw new UserIsAlreadyTeamMemberException();
    }

    public TeamMember addMember(int projectId, TeamMemberCreationRequestBody requestBody) {
        Project project = projectRepository.findById(projectId).orElseThrow(ResourceNotFoundException::new);
        User user = userService.getById(requestBody.getUserId());
        return createMember(project, user, requestBody.getRole());
    }

    public void deleteMember(int projectId, int teamMemberId) {
        Project project = projectRepository.getOne(projectId);
        TeamMember member = getById(teamMemberId);

        if (member.getRole().equals(TeamMember.ProjectRole.LEADER)) {
            ensureEnoughLeadersInProject(project);
        }

        project.getTeam().remove(member);
        projectRepository.save(project);
    }

    public TeamMember updateMember(TeamMemberUpdateRequestBody requestBody, int teamMemberId, int projectId) {
        TeamMember teamMember = getById(teamMemberId);

        if (teamMember.getRole().equals(TeamMember.ProjectRole.LEADER)) {
            Project project = projectRepository.getOne(projectId);
            ensureEnoughLeadersInProject(project);
        }

        teamMember.setRole(requestBody.getRole());
        return repository.save(teamMember);
    }

    /* throws exception if deleting/changing role of team member
       would make project unmanageable */

    //@todo bug - when only one leader and updating this leader to be leader(unnecessarily) throws error
    // should just ignore
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
