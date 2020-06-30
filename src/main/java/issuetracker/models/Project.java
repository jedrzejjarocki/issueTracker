package issuetracker.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import issuetracker.models.common.BaseEntity;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import java.util.HashSet;
import java.util.Set;

@Entity
@Getter
@Setter
@ToString(exclude = {"sprints", "backlog"})
@NoArgsConstructor
public class Project extends BaseEntity {
    public Project(TeamMember creator) {
        creator.setProject(this);
        this.team.add(creator);

        Backlog backlog = new Backlog();
        backlog.setProject(this);
        this.backlog = backlog;
    }

    @NotBlank(message = "Name must not be empty")
    private String name;

    @Column(length = 8, updatable = false)
    @NotBlank(message = "Key must not be empty")
    private String projectKey;

    @JsonIgnore
    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<TeamMember> team = new HashSet<>();

    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Sprint> sprints;

    @OneToOne(mappedBy = "project", cascade = CascadeType.ALL, orphanRemoval = true)
    private Backlog backlog = initBacklog();

    public void addCreatorMember(TeamMember creator) {
        creator.setProject(this);
        team.add(creator);
    }

    private Backlog initBacklog() {
        Backlog backlog = new Backlog();
        backlog.setProject(this);
        return backlog;
    }
}
