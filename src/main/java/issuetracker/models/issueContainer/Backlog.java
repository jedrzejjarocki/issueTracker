package issuetracker.models.issueContainer;

import issuetracker.models.project.Project;
import lombok.Data;

import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.OneToOne;
import javax.validation.constraints.NotNull;

@Entity
@Data
public class Backlog extends IssueContainer {
    @OneToOne
    @JoinColumn(updatable = false)
    @NotNull
    private Project project;
}
