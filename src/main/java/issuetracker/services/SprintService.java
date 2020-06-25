package issuetracker.services;

import issuetracker.exceptions.ResourceNotFoundException;
import issuetracker.models.Project;
import issuetracker.models.Sprint;
import issuetracker.repositories.IssueRepository;
import issuetracker.repositories.SprintRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;

@Service
@RequiredArgsConstructor
public class SprintService {
    private final SprintRepository repository;
    private final IssueRepository issueRepository;
    private final ProjectService projectService;

    public Sprint getById(int sprintId) {
        return repository.findById(sprintId).orElseThrow(ResourceNotFoundException::new);
    }

    public boolean existsById(int id) {
        return repository.existsById(id);
    }

    public Sprint addSprint(Sprint sprint) {
        return repository.save(sprint);
    }

    public Sprint updateSprint(Sprint updated) {
        if (!existsById(updated.getId()))
            throw new ResourceNotFoundException();

        return repository.save(updated);
    }

    @Transactional
    public void deleteSprint(int sprintId) {
        Sprint sprint = getById(sprintId);

        Project project = sprint.getProject();
        project.getSprints().remove(sprint);

        issueRepository.replaceList(sprint, project.getBacklog());
    }
}
