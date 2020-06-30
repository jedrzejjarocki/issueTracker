package issuetracker.controllers;

import issuetracker.dtos.IssueDto;
import issuetracker.dtos.IssueHistoryDto;
import issuetracker.dtos.common.DtoMapper;
import issuetracker.models.Issue;
import issuetracker.services.IssueService;
import org.assertj.core.util.Lists;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnitRunner;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

@RunWith(MockitoJUnitRunner.class)
public class IssueControllerTest {
    @Mock private IssueService service;
    @Mock private DtoMapper<Issue, IssueDto> mapper;
    @InjectMocks private IssueController controller;

    @Test
    public void shouldCallServiceAndReturnListOfHistoryDto() {
        int id = 1;
        when(service.getHistory(id)).thenReturn(Lists.newArrayList(new IssueHistoryDto()));
        List<IssueHistoryDto> history = controller.getHistory(id);
        verify(service).getHistory(id);
        assertEquals(history.size(), 1);
    }

    @Test
    public void shouldCallServiceAddIssueAndReturnIssueDto() {
        Issue issue = new Issue();
        when(service.addIssue(issue)).thenAnswer(i -> {
            Issue created = i.getArgument(0, Issue.class);
            created.setId(1);
            return created;
        });

        ArgumentCaptor<Issue> issueArg = ArgumentCaptor.forClass(Issue.class);
        when(mapper.toDto(issueArg.capture(), any(IssueDto.class))).thenAnswer(i -> {
            Issue argument = i.getArgument(0, Issue.class);
            IssueDto issueDto = new IssueDto();
            issueDto.setId(argument.getId());
            return issueDto;
        });

        IssueDto issueDto = controller.create(issue);
        verify(service).addIssue(issue);
        verify(mapper).toDto(any(Issue.class), any(IssueDto.class));

        assertEquals(issueArg.getValue(), issue);
        assertEquals(issueArg.getValue().getId(), issueDto.getId());
    }

    @Test
    public void shouldCallServiceUpdateAndReturnIssueDto() {
        Issue issue = new Issue();

        when(service.updateIssue(issue)).thenAnswer(i -> {
            Issue updated = i.getArgument(0, Issue.class);
            updated.setVersion(updated.getVersion() + 1);
            return updated;
        });

        ArgumentCaptor<Issue> issueArg = ArgumentCaptor.forClass(Issue.class);

        when(mapper.toDto(issueArg.capture(), any(IssueDto.class))).thenAnswer(i -> {
            Issue argument = i.getArgument(0, Issue.class);
            IssueDto issueDto = new IssueDto();
            issueDto.setId(argument.getId());
            issueDto.setVersion(argument.getVersion());
            return issueDto;
        });

        IssueDto issueDto = controller.update(issue);
        verify(service).updateIssue(issue);
        verify(mapper).toDto(any(Issue.class), any(IssueDto.class));

        assertEquals(issueDto.getId(), issueArg.getValue().getId());
        assertEquals(issueDto.getVersion(), issueArg.getValue().getVersion());
    }

    @Test
    public void shouldCallServiceDelete() {
        int id = 1;

        controller.delete(id);
        verify(service).delete(id);
    }
}