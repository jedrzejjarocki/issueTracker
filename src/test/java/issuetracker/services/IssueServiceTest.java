package issuetracker.services;

import issuetracker.exceptions.InvalidVersionException;
import issuetracker.exceptions.ResourceNotFoundException;
import issuetracker.models.Issue;
import issuetracker.repositories.IssueRepository;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnitRunner;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

@RunWith(MockitoJUnitRunner.class)
public class IssueServiceTest {
    @Mock private IssueRepository repository;
    @InjectMocks IssueService service;

    @Test
    public void getById() {
        int existent = 1;
        int nonexistent = 0;
        Issue issue = new Issue();
        when(repository.findById(existent)).thenReturn(Optional.of(issue));
        when(repository.findById(nonexistent)).thenReturn(Optional.empty());

        service.getById(existent);
        verify(repository).findById(existent);

        assertThrows(ResourceNotFoundException.class, () -> service.getById(nonexistent));
    }

    @Test
    public void delete() {
        int id = 1;
        service.delete(id);
        verify(repository).deleteById(id);
    }

    @Test
    public void addIssue() {
        Issue issue = new Issue();
        when(repository.save(issue)).thenAnswer(i -> {
            Issue fromDb = i.getArgument(0);
            fromDb.setId(1);
            return fromDb;
        });

        Issue returned = service.addIssue(issue);
        verify(repository).save(issue);
        assertEquals(returned.getId(), 1);
    }

    @Test
    public void updateIssueIfVersionMatches() {
        Issue issue = new Issue();
        issue.setId(1);

        Issue updated = new Issue();
        updated.setId(issue.getId());

        when(repository.findById(issue.getId())).thenReturn(Optional.of(issue));
        when(repository.save(updated)).thenReturn(issue);

        service.updateIssue(updated);
        verify(repository).findById(updated.getId());
        verify(repository).save(updated);
    }

    @Test
    public void updateIssueIfStaleVersion() {
        Issue issue = new Issue();
        issue.setId(1);
        issue.setVersion(100);

        Issue updated = new Issue();
        updated.setId(issue.getId());

        when(repository.findById(issue.getId())).thenReturn(Optional.of(issue));

        assertThrows(InvalidVersionException.class, () -> {
            service.updateIssue(updated);
            verify(repository).findById(updated.getId());
            verifyNoMoreInteractions(repository);
        });
    }
}