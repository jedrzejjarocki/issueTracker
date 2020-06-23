package issuetracker.models.issueContainer;

import issuetracker.models.issue.Issue;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.util.HashSet;
import java.util.Set;

@Entity
@Inheritance(strategy = InheritanceType.TABLE_PER_CLASS)
@Getter
@Setter
@NoArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public abstract class IssueContainer {
    @Id
    @GeneratedValue
    @EqualsAndHashCode.Include
    private int id;

    @OneToMany(mappedBy = "list")
    private Set<Issue> issues = new HashSet<>();
}
