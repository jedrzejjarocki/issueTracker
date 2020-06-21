package issuetracker.dtos.IssueContainer;

import issuetracker.dtos.common.Dto;
import issuetracker.dtos.issue.IssueDto;
import issuetracker.models.issueContainer.IssueContainer;
import lombok.Data;

import java.util.Set;

@Data
public class IssueContainerDto implements Dto<IssueContainer> {
    private int id;
    private Set<IssueDto> issues;
}
