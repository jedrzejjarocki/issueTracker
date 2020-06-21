package issuetracker.models;

import issuetracker.models.project.TeamMember;
import lombok.Data;

@Data
public class TeamMemberCreationRequestBody {
    private int userId;
    private TeamMember.ProjectRole role;
}
