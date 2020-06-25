package issuetracker.dtos;

import issuetracker.dtos.common.Dto;
import issuetracker.models.TeamMember;
import lombok.Data;

@Data
public class TeamMemberDto implements Dto<TeamMember> {
    private int id;
    private int userId;
    private int projectId;
    private String username;
    private TeamMember.ProjectRole role;
}
