package issuetracker.models;

import issuetracker.models.common.IssueContainer;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.util.Date;

import static issuetracker.models.Sprint.SprintStatus.PLANNED;

@Entity
@Getter
@Setter
@ToString
@NoArgsConstructor
public class Sprint extends IssueContainer {
    @ManyToOne
    @JoinColumn(updatable = false)
    @NotNull
    private Project project;

    @NotBlank(message = "Name must not be empty")
    private String name;

    private String goal;

    private Date startDate;

    private Date endDate;

    private SprintStatus status = PLANNED;

    public enum SprintStatus {
        PLANNED,
        PENDING,
        COMPLETED
    }
}
