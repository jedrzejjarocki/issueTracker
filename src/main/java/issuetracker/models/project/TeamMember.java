package issuetracker.models.project;

import com.sun.istack.NotNull;
import issuetracker.models.common.BaseEntity;
import issuetracker.models.user.User;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

@Entity
@Getter
@Setter
@ToString(exclude = "project")
public class TeamMember extends BaseEntity {
    @ManyToOne(cascade = CascadeType.PERSIST)
    @JoinColumn
    @NotNull
    private Project project;

    @NotNull
    private ProjectRole role;

    @ManyToOne(cascade = CascadeType.PERSIST)
    @JoinColumn
    @NotNull
    private User user;

    public enum ProjectRole {
        LEADER, DEVELOPER
    }
}
