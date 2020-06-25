package issuetracker.models;

import issuetracker.models.common.Auditable;
import issuetracker.models.common.IssueContainer;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.hibernate.envers.Audited;
import org.hibernate.envers.NotAudited;
import org.hibernate.envers.RelationTargetAuditMode;

import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Version;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

@Entity
@Getter
@Setter
@ToString
@Audited(withModifiedFlag = true)
public class Issue extends Auditable<String> {
    @NotBlank(message = "Summary must not by empty")
    private String summary;

    private String description;

    @Version
    private int version;

    @NotNull
    private IssueType type;

    @NotNull
    private IssueStatus status;

    @ManyToOne
    @JoinColumn
    @NotNull
    @NotAudited
    private IssueContainer list;

    @ManyToOne
    @JoinColumn
    @Audited(targetAuditMode = RelationTargetAuditMode.NOT_AUDITED)
    private TeamMember assignee;

    private int storyPointsEstimate;

    public enum IssueStatus {
        TO_DO,
        IN_PROGRESS,
        DONE
    }

    public enum IssueType {
        TASK,
        IMPROVEMENT,
        NEW_FEATURE,
        BUG
    }
}
