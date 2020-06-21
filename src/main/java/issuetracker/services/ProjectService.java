package issuetracker.services;

import issuetracker.exceptions.ResourceNotFoundException;
import issuetracker.models.project.Project;
import issuetracker.models.project.TeamMember;
import issuetracker.models.user.User;
import issuetracker.repositories.ProjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProjectService {
    private final ProjectRepository repository;
    private final UserService userService;

    public Project getById(int id) {
        return repository.findById(id).orElseThrow(ResourceNotFoundException::new);
    }

    public Set<Project> getAllByUsername(String username) {
        User user = userService.getByUsername(username);
        return user.getTeamMemberships().stream().map(TeamMember::getProject).collect(Collectors.toSet());
    }

    public Project createProject(String name, String key, String creatorName) {
        User creator = userService.getByUsername(creatorName);
        TeamMember member = new TeamMember();
        member.setUser(creator);
        member.setRole(TeamMember.ProjectRole.LEADER);

        Project project = new Project();
        project.addCreatorMember(member);
        project.setName(name);
        project.setProjectKey(key);

        return repository.save(project);
    }

    public void delete(int id) {
        repository.deleteById(id);
    }
}
