package issuetracker.services;

import issuetracker.dtos.IssueHistoryDto;
import issuetracker.exceptions.InvalidVersionException;
import issuetracker.exceptions.ResourceNotFoundException;
import issuetracker.models.Issue;
import issuetracker.repositories.IssueRepository;
import lombok.RequiredArgsConstructor;
import org.hibernate.envers.AuditReader;
import org.hibernate.envers.AuditReaderFactory;
import org.hibernate.envers.RevisionType;
import org.hibernate.envers.query.AuditEntity;
import org.springframework.orm.ObjectOptimisticLockingFailureException;
import org.springframework.stereotype.Service;

import javax.persistence.EntityManager;
import java.lang.reflect.InvocationTargetException;
import java.util.*;

@Service
@RequiredArgsConstructor
public class IssueService {
    private final IssueRepository repository;
    private final IssuePriorityManager priorityManager;
    private final EntityManager entityManager;

    //@Todo implement reasonably
    public List<IssueHistoryDto> getHistory(int issueId) {
        List<IssueHistoryDto> history = new ArrayList<>();

        AuditReader auditReader = AuditReaderFactory.get(entityManager);
        var results = auditReader.createQuery()
                .forRevisionsOfEntityWithChanges(Issue.class, false)
                .add(AuditEntity.id().eq(issueId))
                .getResultList();

        for (Object row : results) {
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

    public Issue addIssue(Issue issue) {
        priorityManager.setInitialPriority(issue);
        return repository.save(issue);
    }

    private void checkIsVersionValid(Issue updated) {
        try {
            Issue fromDb = getById(updated.getId());

            if (fromDb.getVersion() != updated.getVersion()) {
                throw new ObjectOptimisticLockingFailureException(fromDb.toString(), fromDb.getId());
            }

        } catch (ObjectOptimisticLockingFailureException exception) {
            throw new InvalidVersionException();
        }
    }

    public List<Issue> updateIssue(Issue issue, int index) {
        checkIsVersionValid(issue);
        Set<Issue> updatedIssues = priorityManager.changePriority(issue, index);
        return repository.saveAll(updatedIssues);
    }

    public Issue updateIssue(Issue issue) {
        checkIsVersionValid(issue);
        return repository.save(issue);
    }
}
