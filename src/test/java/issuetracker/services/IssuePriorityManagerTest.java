package issuetracker.services;

import issuetracker.models.Backlog;
import issuetracker.models.Issue;
import issuetracker.models.common.IssueContainer;
import issuetracker.repositories.IssueContainerRepository;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnitRunner;

import java.util.*;
import java.util.concurrent.atomic.AtomicInteger;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@RunWith(MockitoJUnitRunner.class)
public class IssuePriorityManagerTest {

    @Mock
    private IssueContainerRepository issueContainerRepository;
    @InjectMocks
    IssuePriorityManager manager;
    private final int DEFAULT_PRIORITY_OFFSET = 100;

    @Test
    public void setInitialPriority() {
        IssueContainer container = getContainer();
        when(issueContainerRepository.findById(container.getId())).thenReturn(Optional.of(container));

        int currentHighestPriority = container.getIssues().stream()
                .max(Comparator.comparing(Issue::getPriority))
                .orElseThrow(IllegalArgumentException::new)
                .getPriority();
        int expectedInitialPriority = currentHighestPriority + DEFAULT_PRIORITY_OFFSET;

        Issue createdIssue = new Issue();
        createdIssue.setContainer(container);

        manager.setInitialPriority(createdIssue);

        verify(issueContainerRepository).findById(container.getId());
        assertEquals(expectedInitialPriority, createdIssue.getPriority());
    }

    private IssueContainer getContainer(List<Integer> issuePriorities) {
        IssueContainer container = new Backlog();
        container.setId(1);

        AtomicInteger id = new AtomicInteger(1);
        issuePriorities.forEach(priority -> {
            Issue issue = new Issue();
            issue.setPriority(priority);
            issue.setSummary(String.valueOf(id.get()));
            issue.setId(id.getAndIncrement());
            issue.setContainer(container);
            container.getIssues().add(issue);
        });

        return container;
    }

    private IssueContainer getContainer() {
        return getContainer(Arrays.asList(100, 200, 300, 400));
    }


    @Test
    public void shouldSetPriorityToCurrentHighestPlusDefaultGap() {
        IssueContainer container = getContainer();
        when(issueContainerRepository.findById(container.getId())).thenReturn(Optional.of(container));

        Issue issueToBeReprioritized = container.getIssues().stream()
                .filter(issue -> issue.getId() == 1).findFirst()
                .orElseThrow(IllegalArgumentException::new);

        int currentHighestPriority = container.getIssues().stream()
                .max(Comparator.comparing(Issue::getPriority))
                .orElseThrow(IllegalArgumentException::new)
                .getPriority();

        int expectedPriority = currentHighestPriority + DEFAULT_PRIORITY_OFFSET;

        Set<Issue> issuesToBeUpdated = manager.changePriority(issueToBeReprioritized, 0);

        assertEquals(1, issuesToBeUpdated.size());
        assertTrue(issuesToBeUpdated.contains(issueToBeReprioritized));
        assertEquals(expectedPriority, issueToBeReprioritized.getPriority());
        verify(issueContainerRepository).findById(issueToBeReprioritized.getContainer().getId());
    }

    @Test
    public void shouldSetPriorityToCurrentLowestMinusDefaultGap() {
        IssueContainer container = getContainer();
        when(issueContainerRepository.findById(container.getId())).thenReturn(Optional.of(container));

        Issue issueToBeReprioritized = container.getIssues().stream()
                .filter(issue -> issue.getId() == 4).findFirst()
                .orElseThrow(IllegalArgumentException::new);

        int currentLowestPriority = container.getIssues().stream()
                .min(Comparator.comparing(Issue::getPriority))
                .orElseThrow(IllegalArgumentException::new)
                .getPriority();
        int expectedPriority = currentLowestPriority - DEFAULT_PRIORITY_OFFSET;

        int issuesSetSize = container.getIssues().size();

        Set<Issue> issuesToBeUpdated = manager.changePriority(issueToBeReprioritized, issuesSetSize - 1);

        assertEquals(1, issuesToBeUpdated.size());
        assertTrue(issuesToBeUpdated.contains(issueToBeReprioritized));
        assertEquals(expectedPriority, issueToBeReprioritized.getPriority());
    }

    @Test
    public void shouldNotSetPriorityWhenIndexDoesNotChange() {
        IssueContainer container = getContainer();
        when(issueContainerRepository.findById(container.getId())).thenReturn(Optional.of(container));

        Issue issueToBeReprioritized = container.getIssues().stream()
                .filter(issue -> issue.getId() == 1).findFirst()
                .orElseThrow(IllegalArgumentException::new);

        Set<Issue> issuesToBeUpdated = manager.changePriority(issueToBeReprioritized, 3);

        assertTrue(issuesToBeUpdated.isEmpty());
    }

    @Test
    public void shouldSetPriorityInMiddleWhenGapAvailable() {
        /* when issue at index and adjacent issue positions has a gap in between (eg. issue at index pos: 300, adjacent issue pos: 400)
         reprioritized issue priority should be set as middle value - in a given case - (300 + 400) / 2 -> 350 */
        IssueContainer container = getContainer(Arrays.asList(100, 200, 300, 400));
        when(issueContainerRepository.findById(container.getId())).thenReturn(Optional.of(container));

        Issue issueToBeReprioritized = container.getIssues().stream()
                .filter(issue -> issue.getId() == 1).findFirst()
                .orElseThrow(IllegalArgumentException::new);

        int expectedPriority = 350;

        Set<Issue> issuesToBeUpdated = manager.changePriority(issueToBeReprioritized, 1);
        assertEquals(1, issuesToBeUpdated.size());
        assertEquals(expectedPriority, issueToBeReprioritized.getPriority());
    }

    @Test
    public void shouldSwapPrioritiesIfNoGapAndIndexChangesByOne() {
        IssueContainer container = getContainer(Arrays.asList(1, 2, 3, 4));
        when(issueContainerRepository.findById(container.getId())).thenReturn(Optional.of(container));

        Issue issueToBeReprioritized = container.getIssues().stream()
                .filter(issue -> issue.getId() == 1).findFirst()
                .orElseThrow(IllegalArgumentException::new);

        Issue issueAtIndex = container.getIssues().stream()
                .filter(issue -> issue.getId() == 2).findFirst()
                .orElseThrow(IllegalArgumentException::new);

        Set<Issue> issuesToBeUpdated = manager.changePriority(issueToBeReprioritized, 2);
        assertEquals(2, issuesToBeUpdated.size());
        assertTrue(issuesToBeUpdated.contains(issueToBeReprioritized));
        assertTrue(issuesToBeUpdated.contains(issueAtIndex));
        assertEquals(1, issueAtIndex.getPriority());
        assertEquals(2, issueToBeReprioritized.getPriority());
        verify(issueContainerRepository).findById(container.getId());
    }

    @Test
    public void shouldRebalance() {
        IssueContainer container = getContainer(Arrays.asList(1, 2, 3, 4, 5, 6));
        Issue updated = new Issue();
        container.getIssues().add(updated);
        updated.setId(100);
        updated.setContainer(container);
        when(issueContainerRepository.findById(container.getId())).thenReturn(Optional.of(container));

//        Issue issueToBeReprioritized = container.getIssues().stream()
//                .filter(issue -> issue.getId() == 5).findFirst()
//                .orElseThrow(IllegalArgumentException::new);

        Set<Issue> issuesToBeUpdated = manager.changePriority(updated, 3);

        container.getIssues().stream().sorted(Comparator.comparing(Issue::getPriority))
                .forEach(i -> System.out.printf("id: %s | p: %s\n", i.getId(), i.getPriority()));

        System.out.println("---to be updated---");
        issuesToBeUpdated.forEach(i -> System.out.printf("id: %s\n", i.getId()));
        verify(issueContainerRepository).findById(container.getId());
    }
}