package issuetracker.services;

import issuetracker.exceptions.ResourceNotFoundException;
import issuetracker.models.Backlog;
import issuetracker.models.Project;
import issuetracker.models.Sprint;
import issuetracker.repositories.IssueRepository;
import issuetracker.repositories.SprintRepository;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.internal.util.collections.Sets;
import org.mockito.junit.MockitoJUnitRunner;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@RunWith(MockitoJUnitRunner.class)
public class SprintServiceTest {
    @Mock
    private SprintRepository repository;
    @Mock
    private IssueRepository issueRepository;
    @InjectMocks private SprintService service;

    @Test
    public void getById() {
        int existent = 1;
        int nonexistent = 0;
        Sprint sprint = new Sprint();
        when(repository.findById(existent)).thenReturn(Optional.of(sprint));
        when(repository.findById(nonexistent)).thenReturn(Optional.empty());

        service.getById(existent);
        verify(repository).findById(existent);

        assertThrows(ResourceNotFoundException.class, () -> service.getById(nonexistent));
    }

    @Test
    public void addSprint() {
        Sprint sprint = new Sprint();
        when(repository.save(sprint)).thenAnswer(i -> {
            Sprint fromDb = i.getArgument(0);
            fromDb.setId(1);
            return fromDb;
        });

        Sprint returned = service.addSprint(sprint);
        verify(repository).save(sprint);
        assertEquals(returned.getId(), 1);
    }

    @Test
    public void updateSprint() {
        Sprint updated = new Sprint();
        updated.setId(1);

        when(repository.existsById(updated.getId())).thenReturn(true);
        when(repository.save(updated)).thenAnswer(i -> i.getArgument(0, Sprint.class));

        Sprint sprint = service.updateSprint(updated);
        verify(repository).existsById(updated.getId());
        assertNotNull(sprint);
    }

    @Test
    public void throwsWhenTryingToUpdateNonexistentSprint() {
        Sprint sprint = new Sprint();

        when(repository.existsById(sprint.getId())).thenReturn(false);

        assertThrows(ResourceNotFoundException.class, () -> {
            service.updateSprint(sprint);
            verify(repository).existsById(sprint.getId());
        });
    }

    @Test
    public void deleteSprint() {
        Sprint sprint = new Sprint();
        Project project = new Project();
        sprint.setId(1);
        sprint.setProject(project);
        project.setSprints(Sets.newSet(sprint));

        when(repository.findById(sprint.getId())).thenReturn(Optional.of(sprint));

        service.deleteSprint(sprint.getId());
        verify(repository).findById(sprint.getId());

        ArgumentCaptor<Sprint> sprintArg = ArgumentCaptor.forClass(Sprint.class);
        ArgumentCaptor<Backlog> backlogArg = ArgumentCaptor.forClass(Backlog.class);
        verify(issueRepository).replaceList(sprintArg.capture(), backlogArg.capture());

        assertFalse(sprintArg.getValue().getProject().getSprints().contains(sprint));
        assertEquals(project.getBacklog(), backlogArg.getValue());
    }
}