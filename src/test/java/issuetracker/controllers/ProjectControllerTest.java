package issuetracker.controllers;

import issuetracker.dtos.ProjectDto;
import issuetracker.dtos.common.DtoMapper;
import issuetracker.models.Project;
import issuetracker.models.TeamMember;
import issuetracker.services.ProjectService;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnitRunner;

import java.security.Principal;
import java.util.HashSet;
import java.util.Set;
import java.util.stream.IntStream;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@RunWith(MockitoJUnitRunner.class)
public class ProjectControllerTest {
    @Mock
    private ProjectService service;
    @Mock
    private DtoMapper<Project, ProjectDto> mapper;
    @Mock
    private Principal principal;

    @InjectMocks
    private ProjectController controller;

    @Test
    public void getAll() {
        Set<Project> projectsSet = new HashSet<>();
        IntStream.of(3).forEach((i) -> projectsSet.add(new Project()));

        String name = "name";
        when(principal.getName()).thenReturn(name);
        when(service.getAllByUsername(name)).thenReturn(projectsSet);
        when(mapper.toDto(any(Project.class), any(ProjectDto.class))).thenReturn(new ProjectDto());

        Set<ProjectDto> all = controller.getAll(principal);
        verify(principal).getName();
        verify(service).getAllByUsername(name);
        verify(mapper, times(projectsSet.size())).toDto(any(Project.class), any(ProjectDto.class));
        assertEquals(all.size(), projectsSet.size());
    }

    @Test
    public void getById() {
        Project project = new Project();
        project.setId(1);
        when(service.getById(project.getId())).thenReturn(project);

        ArgumentCaptor<Project> projectArg = ArgumentCaptor.forClass(Project.class);
        when(mapper.toDto(projectArg.capture(), any(ProjectDto.class))).thenAnswer(i -> {
            Project argument = i.getArgument(0, Project.class);
            ProjectDto projectDto = new ProjectDto();
            projectDto.setId(argument.getId());
            return projectDto;
        });

        ProjectDto projectDto = controller.getById(project.getId());
        assertEquals(projectArg.getValue(), project);
        verify(service).getById(project.getId());
        assertEquals(projectDto.getId(), project.getId());
    }

    @Test
    public void create() {
        Project project = new Project();
        String name = "name";
        when(principal.getName()).thenReturn(name);
        when(service.createProject(project, principal.getName())).thenAnswer(i -> {
            Project argument = i.getArgument(0, Project.class);
            argument.getTeam().add(new TeamMember());
            return argument;
        });

        ArgumentCaptor<Project> projectArg = ArgumentCaptor.forClass(Project.class);
        when(mapper.toDto(projectArg.capture(), any(ProjectDto.class))).thenReturn(new ProjectDto());

        ProjectDto projectDto = controller.create(project, principal);
        verify(service).createProject(project, principal.getName());
        assertFalse(projectArg.getValue().getTeam().isEmpty());
        assertNotNull(projectDto);
    }

    @Test
    public void delete() {
        int id = 1;
        controller.delete(id);
        verify(service).delete(id);
    }
}