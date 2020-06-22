package issuetracker.models.issueContainer;

import issuetracker.models.project.Project;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.validation.constraints.FutureOrPresent;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.util.Date;

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

    @FutureOrPresent
    private Date startDate;

    @FutureOrPresent
    private Date endDate;
}
