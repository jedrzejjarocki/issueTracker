package issuetracker.services;

import issuetracker.exceptions.ResourceNotFoundException;
import issuetracker.models.Project;
import issuetracker.models.TeamMember;
import issuetracker.models.User;
import issuetracker.repositories.ProjectRepository;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnitRunner;

import java.util.Optional;
import java.util.Set;
import java.util.stream.IntStream;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@RunWith(MockitoJUnitRunner.class)
public class ProjectServiceTest {
    @Mock private ProjectRepository repository;
    @Mock private UserService userService;
    @InjectMocks ProjectService service;

    @Test
    public void getById() {
        when(repository.findById(1)).thenReturn(Optional.of(new Project()));
        when(repository.findById(2)).thenReturn(Optional.empty());

        service.getById(1);
        verify(repository).findById(1);

        assertThrows(ResourceNotFoundException.class, () -> service.getById(2));
    }

    private User getUserWithProjects() {
        User user = new User();
        user.setUsername("username");
        IntStream.of(3).forEach(i -> {
            Project project = new Project();
            TeamMember teamMember = new TeamMember();
            teamMember.setProject(project);
            user.getTeamMemberships().add(teamMember);
        });
        return user;
    }

    @Test
    public void getAllByUsername() {
        User user = getUserWithProjects();
        when(userService.getByUsername(user.getUsername())).thenReturn(user);

        Set<Project> projects = service.getAllByUsername(user.getUsername());
        verify(userService).getByUsername(user.getUsername());
        assertEquals(projects.size(), user.getProjects().size());
    }

    @Test
    public void createProject() {
        User user = new User();
        user.setUsername("username");
        Project project = new Project();

        when(userService.getByUsername(user.getUsername())).thenReturn(user);
        when(repository.save(project)).thenReturn(project);

        Project fromDb = service.createProject(project, user.getUsername());

        verify(userService).getByUsername(user.getUsername());
        verify(repository).save(project);

        TeamMember creator = fromDb.getTeam().stream().findFirst().get();
        assertEquals(fromDb.getTeam().size(), 1);
        assertNotNull(creator);
        assertEquals(creator.getRole(), TeamMember.ProjectRole.LEADER);
        assertEquals(creator.getUser(), user);
    }

    @Test
    public void deleteById() {
        int id = 1;
        service.delete(id);
        verify(repository).deleteById(id);
    }
}