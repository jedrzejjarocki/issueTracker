package issuetracker.controllers;

import issuetracker.dtos.*;
import issuetracker.dtos.common.DtoMapper;
import issuetracker.exceptions.ResourceNotFoundException;
import issuetracker.exceptions.UnauthorizedException;
import issuetracker.exceptions.UsernameExistsException;
import issuetracker.models.Project;
import issuetracker.models.User;
import issuetracker.services.MailSenderService;
import issuetracker.services.UserService;
import lombok.RequiredArgsConstructor;
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

    @GetMapping("/current")
    public UserDto current(Principal principal) throws UnauthorizedException {
        String username = Optional.ofNullable(principal).map(Principal::getName).orElseThrow(UnauthorizedException::new);
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
        User user = mapper.toEntity(userCreationDto, new User());
        return mapper.toDto(service.create(user), new UserDto());
    }

    @DeleteMapping
    public void delete(Principal principal) throws ResourceNotFoundException {
        service.delete(principal.getName());
    }

    @PostMapping("/reset-password")
    public void resetPassword(@Valid @RequestBody PasswordRecoveryDto dto) throws IOException {
        mailSenderService.resetPassword(dto.getEmail());
    }

    @PutMapping("/reset-password")
    public void changePassword(@Valid @RequestBody ChangePasswordDto dto) {
        service.changePassword(dto.getToken(), dto.getPassword());
    }
}
