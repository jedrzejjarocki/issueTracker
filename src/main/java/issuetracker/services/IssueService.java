package issuetracker.services;

import issuetracker.dtos.issue.IssueHistoryDto;
import issuetracker.exceptions.InvalidVersionException;
import issuetracker.exceptions.ResourceNotFoundException;
import issuetracker.models.issue.Issue;
import issuetracker.models.issueContainer.IssueContainer;
import issuetracker.models.project.Project;
import issuetracker.repositories.IssueContainerRepository;
import issuetracker.repositories.IssueRepository;
import lombok.RequiredArgsConstructor;
import org.hibernate.envers.AuditReader;
import org.hibernate.envers.AuditReaderFactory;
import org.hibernate.envers.RevisionType;
import org.hibernate.envers.query.AuditEntity;
import org.modelmapper.ModelMapper;
import org.springframework.orm.ObjectOptimisticLockingFailureException;
import org.springframework.stereotype.Service;

import javax.persistence.EntityManager;
import java.lang.reflect.InvocationTargetException;
import java.util.*;

@Service
@RequiredArgsConstructor
public class IssueService {
    private final IssueRepository repository;
    private final IssueContainerRepository issueContainerRepository;
    private final ProjectService projectService;
    private final SprintService sprintService;
    private final EntityManager entityManager;

    //@Todo implement reasonably
    public List<IssueHistoryDto> getHistory(int issueId) {
        List<IssueHistoryDto> history = new ArrayList<>();

        AuditReader auditReader = AuditReaderFactory.get(entityManager);
        List results = auditReader.createQuery()
                .forRevisionsOfEntityWithChanges(Issue.class, false)
                .add(AuditEntity.id().eq(issueId))
                .getResultList();

        for ( Object row : results ) {
            Object[] rowArray = (Object[]) row;
            final Issue entity = (Issue) rowArray[0];
            final RevisionType revisionType = (RevisionType) rowArray[2];
            final Set<String> propertiesChanged = (Set<String>) rowArray[3];
            Map<String, String> diff = new HashMap<>();
            propertiesChanged.forEach(property -> {
                String method = "get" + property.substring(0, 1).toUpperCase() + property.substring(1);
                try {
                    diff.put(property, Issue.class.getMethod(method).invoke(entity).toString());
                } catch (NoSuchMethodException | IllegalAccessException e) {
                    e.printStackTrace();
                } catch (InvocationTargetException e) {
                    e.printStackTrace();
                }
            });
            IssueHistoryDto issueHistoryDto = new IssueHistoryDto();
            issueHistoryDto.setDiff(diff);
            issueHistoryDto.setModifiedBy(entity.getLastModifiedBy());
            issueHistoryDto.setModifiedDate(entity.getLastModifiedTime());
            issueHistoryDto.setModType(revisionType.toString());
            history.add(issueHistoryDto);
        }
        return history;
    }

    public Issue getById(int issueId) throws ResourceNotFoundException {
        return repository.findById(issueId).orElseThrow(ResourceNotFoundException::new);
    }

    public void delete(int id) {
        repository.deleteById(id);
    }

    public Issue addIssue(Issue issue, int projectId, Integer sprintId) {
        Project project = projectService.getById(projectId);

        IssueContainer list = sprintId == null ? project.getBacklog() : sprintService.getById(sprintId);
        issue.setList(list);
        System.out.println(issue.getAssignee());

        return repository.save(issue);
    }

    public Issue updateIssue(Issue updated, Integer assigneeId, Integer listId) {
        try {
            Issue issue = getById(updated.getId());

            if (issue.getVersion() != updated.getVersion()) {
                throw new ObjectOptimisticLockingFailureException(issue.toString(), issue.getId());
            }

            ModelMapper mapper = new ModelMapper();
            mapper.getConfiguration().setSkipNullEnabled(true);
            mapper.map(updated, issue);

//            if (assigneeId != null) {
//                issue.setAssignee(teamMemberService.getById(assigneeId));
//            }

            if (listId != null) {
                issue.setList(issueContainerRepository.findById(listId).get());
            }

            return repository.save(issue);

        } catch (ObjectOptimisticLockingFailureException exception) {
            throw new InvalidVersionException();
        }

    }
}
