package issuetracker.controllers;

import issuetracker.dtos.common.DtoMapper;
import issuetracker.dtos.project.ProjectDto;
import issuetracker.dtos.user.ChangePasswordDto;
import issuetracker.dtos.user.PasswordRecoveryDto;
import issuetracker.dtos.user.UserCreationDto;
import issuetracker.dtos.user.UserDto;
import issuetracker.exceptions.ResourceNotFoundException;
import issuetracker.exceptions.UnauthorizedException;
import issuetracker.exceptions.UsernameExistsException;
import issuetracker.models.project.Project;
import issuetracker.models.user.User;
import issuetracker.services.MailSenderService;
import issuetracker.services.UserService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.io.IOException;
import java.security.Principal;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
    private final UserService service;
    private final DtoMapper<User, UserDto> mapper;
    private final DtoMapper<Project, ProjectDto> projectMapper;
    private final MailSenderService mailSenderService;
    private final Logger logger = LoggerFactory.getLogger(UserController.class);

    @GetMapping("/current")
    public UserDto current(Principal principal) throws UnauthorizedException {
        String username = Optional.ofNullable(principal).map(Principal::getName).orElseThrow(() -> new UnauthorizedException());
        User user = service.getByUsername(username);

        UserDto dto = new UserDto();
        dto.setId(user.getId());
        dto.setUsername(username);
        dto.setProjects(user.getProjects().stream().map(p -> projectMapper.toDto(p, new ProjectDto())).collect(Collectors.toSet()));
        return dto;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public UserDto create(@Valid @RequestBody UserCreationDto userCreationDto) throws UsernameExistsException {
        logger.info(userCreationDto.getEmail());
        User user = mapper.toEntity(userCreationDto, new User());
        return mapper.toDto(service.create(user), new UserDto());
    }

    // @Todo allowed only by user itself
    @DeleteMapping("/{id}")
    public void delete(@PathVariable int id) throws ResourceNotFoundException {
        service.delete(id);
    }

    @PostMapping("/reset-password")
    public void resetPassword(@RequestBody PasswordRecoveryDto dto) throws IOException {
        mailSenderService.resetPassword(dto.getEmail());
    }

    @PutMapping("/reset-password")
    public void changePassword(@RequestBody ChangePasswordDto dto) {
        service.changePassword(dto.getToken(), dto.getPassword());
    }
}
