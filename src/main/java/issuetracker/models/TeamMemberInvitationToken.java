package issuetracker.models;

import issuetracker.models.common.BaseEntity;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import java.util.UUID;

@Entity
@Getter
@Setter
@ToString
public class TeamMemberInvitationToken extends BaseEntity {
    private final String token = UUID.randomUUID().toString().replace("-", "");
    private String email;
    @ManyToOne
    @JoinColumn
    private Project project;
    private TeamMember.ProjectRole role;
}
