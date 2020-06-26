package issuetracker.dtos;

import lombok.Getter;

import javax.validation.constraints.Email;

@Getter
public class PasswordRecoveryDto {
    @Email
    String email;
}
