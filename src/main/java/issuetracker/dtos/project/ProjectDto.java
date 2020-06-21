package issuetracker.dtos.project;

import issuetracker.dtos.IssueContainer.IssueContainerDto;
import issuetracker.dtos.IssueContainer.SprintDto;
import issuetracker.dtos.common.Dto;
import issuetracker.dtos.teamMember.TeamMemberDto;
import issuetracker.models.project.Project;
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
