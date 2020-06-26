package issuetracker.models;

import issuetracker.models.common.BaseEntity;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

@Entity
@Table(name = "users")
@Getter
@Setter
public class User extends BaseEntity {
    @EqualsAndHashCode.Exclude
    @OneToMany(mappedBy = "user", orphanRemoval = true)
    Set<TeamMember> teamMemberships = new HashSet<>();

    @Column(unique = true)
    @NotBlank(message = "Username must not be empty")
    private String username;

    @Email
    private String email;

    @Size(min = 8, max = 128)
    private String password;

    public Set<Project> getProjects() {
        return teamMemberships.stream().map(TeamMember::getProject).collect(Collectors.toSet());
    }
}
