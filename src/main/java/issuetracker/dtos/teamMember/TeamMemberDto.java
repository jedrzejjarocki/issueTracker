package issuetracker.dtos.teamMember;

import issuetracker.dtos.common.Dto;
import issuetracker.models.project.TeamMember;
import lombok.Data;

@Data
public class TeamMemberDto implements Dto<TeamMember> {
    private int id;
    private int userId;
    private String username;
    private TeamMember.ProjectRole role;
}
