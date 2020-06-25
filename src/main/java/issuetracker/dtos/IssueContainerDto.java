package issuetracker.dtos;

import issuetracker.dtos.common.Dto;
import issuetracker.models.common.IssueContainer;
import lombok.Data;

import java.util.Set;

@Data
public class IssueContainerDto implements Dto<IssueContainer> {
    private int id;
    private Set<IssueDto> issues;
}
