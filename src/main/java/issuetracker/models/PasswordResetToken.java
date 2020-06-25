package issuetracker.models;

import issuetracker.models.common.BaseEntity;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.OneToOne;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Getter
@Setter
public class PasswordResetToken extends BaseEntity {
    private static final int expirationTime = 60;

    private String token = UUID.randomUUID().toString().replace("-", "");

    @OneToOne
    @JoinColumn
    private User user;

    private LocalDate expiryDate = LocalDate.now().plusDays(1);
}
