package issuetracker.dtos.IssueContainer;

import lombok.Data;

import java.util.Date;

@Data
public class SprintDto extends IssueContainerDto {
    private String name;

    private String goal;

    private Date startDate;

    private Date endDate;
}
