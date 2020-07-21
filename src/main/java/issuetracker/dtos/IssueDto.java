package issuetracker.dtos;

import issuetracker.dtos.common.Dto;
import issuetracker.models.Issue;
import lombok.Data;

import java.util.Date;

@Data
public class IssueDto implements Dto<Issue> {
    private int id;
    private int containerId;
    private String summary;
    private String description;
    private Integer version;
    private Issue.IssueType type;
    private Issue.IssueStatus status;
    private TeamMemberDto assignee;
    private int storyPointsEstimate;
    private String createdBy; //username
    private Date createdTime;
    private String lastModifiedBy; //username
    private Date lastModifiedTime;
}
