package issuetracker.dtos;

import lombok.Getter;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

@Getter
public class ChangePasswordDto {
    @NotBlank
    String token;
    @NotBlank
    @Size(min = 8, max = 128)
    String password;
}
