package issuetracker.models.common;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import issuetracker.models.Backlog;
import issuetracker.models.Issue;
import issuetracker.models.Sprint;
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
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonTypeInfo(use = JsonTypeInfo.Id.NAME)
@JsonSubTypes({
        @JsonSubTypes.Type(value = Backlog.class, name = "Backlog"),
        @JsonSubTypes.Type(value = Sprint.class, name = "Sprint")
})
public abstract class IssueContainer {
    @Id
    @GeneratedValue
    @EqualsAndHashCode.Include
    private int id;

    @OneToMany(mappedBy = "container")
    private Set<Issue> issues = new HashSet<>();
}
