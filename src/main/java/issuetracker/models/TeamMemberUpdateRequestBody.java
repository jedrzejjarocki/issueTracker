package issuetracker.models;

import issuetracker.models.project.TeamMember;
import lombok.Data;

@Data
public class TeamMemberUpdateRequestBody {
    TeamMember.ProjectRole role;
}
