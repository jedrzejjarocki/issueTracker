package issuetracker.controllers;

import issuetracker.dtos.IssueContainerDto;
import issuetracker.dtos.SprintDto;
import issuetracker.dtos.common.DtoMapper;
import issuetracker.models.Sprint;
import issuetracker.models.common.IssueContainer;
import issuetracker.services.SprintService;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnitRunner;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.*;

@RunWith(MockitoJUnitRunner.class)
public class SprintControllerTest {
    @Mock private SprintService service;
    @Mock private DtoMapper<IssueContainer, IssueContainerDto> mapper;
    @InjectMocks SprintController controller;

    @Test
    public void createSprint() {
        Sprint sprint = new Sprint();
        when(service.addSprint(sprint)).thenAnswer(i -> {
            Sprint argument = i.getArgument(0, Sprint.class);
            argument.setId(1);
            return argument;
        });
        ArgumentCaptor<Sprint> sprintArg = ArgumentCaptor.forClass(Sprint.class);
        when(mapper.toDto(sprintArg.capture(), any(SprintDto.class))).thenReturn(new SprintDto());

        IssueContainerDto sprintDto = controller.createSprint(sprint);
        verify(service).addSprint(sprint);
        assertEquals(sprintArg.getValue().getId(), 1);
        assertNotNull(sprintDto);
    }

    @Test
    public void updateSprint() {
        Sprint sprint = new Sprint();
        when(service.updateSprint(sprint)).thenReturn(sprint);
        when(mapper.toDto(any(Sprint.class), any(SprintDto.class))).thenReturn(new SprintDto());

        IssueContainerDto containerDto = controller.updateSprint(sprint);
        verify(service).updateSprint(sprint);
        verify(mapper).toDto(any(Sprint.class), any(SprintDto.class));
        assertNotNull(containerDto);
    }

    @Test
    public void deleteSprint() {
        int id = 1;
        controller.deleteSprint(id);
        verify(service).deleteSprint(id);
    }
}