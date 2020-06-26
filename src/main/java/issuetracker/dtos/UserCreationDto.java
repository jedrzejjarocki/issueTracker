package issuetracker.dtos;

import lombok.Data;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

@Data
public class UserCreationDto extends UserDto {
    @Size(min = 8, max = 128)
    @NotBlank
    String password;
    @Email
    String email;
}
