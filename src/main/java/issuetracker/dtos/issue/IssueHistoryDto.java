package issuetracker.dtos.issue;

import lombok.Data;

import java.util.Date;
import java.util.Map;

@Data
public class IssueHistoryDto {
    private String modifiedBy;
    private Date modifiedDate;
    private String modType;
    private Map<String, String> diff;
}

