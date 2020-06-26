package issuetracker.dtos;

import issuetracker.dtos.common.Dto;
import issuetracker.models.User;
import lombok.Data;

import javax.validation.constraints.NotBlank;
import java.util.Set;

@Data
public class UserDto implements Dto<User> {
    private int id;
    private Set<ProjectDto> projects;
    @NotBlank
    private String username;
}
