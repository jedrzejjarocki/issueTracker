package issuetracker.dtos;

import issuetracker.models.Sprint;
import lombok.Data;

import java.util.Date;

@Data
public class SprintDto extends IssueContainerDto {
    private String name;

    private String goal;

    private Date startDate;

    private Date endDate;

    private Sprint.SprintStatus status;
}
