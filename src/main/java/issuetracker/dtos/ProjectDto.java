package issuetracker.dtos;

import issuetracker.dtos.common.Dto;
import issuetracker.models.Project;
import lombok.Data;

import java.util.Set;

@Data
public class ProjectDto implements Dto<Project> {
    String name;
    private int id;
    private String projectKey;
    private Set<TeamMemberDto> team;
    private Set<SprintDto> sprints;
    private IssueContainerDto backlog;
}
