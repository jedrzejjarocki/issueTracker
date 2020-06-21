package issuetracker.dtos.issue;

import issuetracker.dtos.common.Dto;
import issuetracker.dtos.teamMember.TeamMemberDto;
import issuetracker.models.issue.Issue;
import issuetracker.models.issue.IssueStatus;
import issuetracker.models.issue.IssueType;
import lombok.Data;

import java.util.Date;

@Data
public class IssueDto implements Dto<Issue> {
    private int id;
    private int listId;
    private String summary;
    private String description;
    private Integer version;
    private IssueType type;
    private IssueStatus status;
    private TeamMemberDto assignee;
    private int storyPointsEstimate;
    private String createdBy; //username
    private Date createdTime;
    private String lastModifiedBy; //username
    private Date lastModifiedTime;
}
