package issuetracker.services;

import issuetracker.exceptions.ResourceNotFoundException;
import issuetracker.models.Issue;
import issuetracker.models.common.IssueContainer;
import issuetracker.repositories.IssueContainerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.*;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class IssuePriorityManager {
    private final int DEFAULT_PRIORITY_OFFSET = 100;

    private enum MoveDirection {UP, DOWN}

    private final IssueContainerRepository issueContainerRepository;

    private int getHighestIssuePriorityByContainerId(int id) {
        IssueContainer container = issueContainerRepository.findById(id).orElseThrow(ResourceNotFoundException::new);

        return container.getIssues()
                .stream().map(Issue::getPriority)
                .reduce(0, (max, current) -> current > max ? current : max);
    }

    public Issue setInitialPriority(Issue issue) {
        int maxPriority = getHighestIssuePriorityByContainerId(issue.getContainer().getId());
        issue.setPriority(maxPriority + DEFAULT_PRIORITY_OFFSET);
        return issue;
    }

    private void checkIsValidIndex(int index, List<Issue> issuesList) throws IllegalArgumentException {
        if (index < 0 || index > issuesList.size()) {
            throw new IllegalArgumentException();
        }
    }

    private boolean isGapSufficient(Issue atIndex, Issue adjacent) {
        return Math.abs(atIndex.getPriority() - adjacent.getPriority()) > 1;
    }

    private boolean canBeSwapped(int currentIndex, int requestedIndex) {
        return Math.abs(currentIndex - requestedIndex) == 1;
    }

    private int getMiddlePriority(Issue atIndex, Issue adjacent) {
        return (atIndex.getPriority() + adjacent.getPriority()) / 2;
    }

    private Set<Issue> changePriority(Issue issue, int requestedIndex, List<Issue> issuesByPriorityDesc) {
        Set<Issue> issuesToBeUpdated = new HashSet<>();
        checkIsValidIndex(requestedIndex, issuesByPriorityDesc);

        if (requestedIndex == 0) {
            int priority = issuesByPriorityDesc.size() > 0
                    ? issuesByPriorityDesc.get(requestedIndex).getPriority() + DEFAULT_PRIORITY_OFFSET
                    : 0;
            issue.setPriority(priority);
            issuesToBeUpdated.add(issue);
            return issuesToBeUpdated;
        } else if (requestedIndex == issuesByPriorityDesc.size() - 1) {
            issue.setPriority(issuesByPriorityDesc.get(requestedIndex).getPriority() - DEFAULT_PRIORITY_OFFSET);
            issuesToBeUpdated.add(issue);
            return issuesToBeUpdated;
        } else if (requestedIndex == issuesByPriorityDesc.size()) {
            issue.setPriority(issuesByPriorityDesc.get(requestedIndex - 1).getPriority() - DEFAULT_PRIORITY_OFFSET);
            issuesToBeUpdated.add(issue);
            return issuesToBeUpdated;
        }

        int currentIssueIndex = issuesByPriorityDesc.indexOf(issue);

        Issue issueAtIndex = issuesByPriorityDesc.get(requestedIndex);

        MoveDirection direction = requestedIndex < currentIssueIndex ? MoveDirection.UP : MoveDirection.DOWN;

        int adjacentIssueIndex = requestedIndex + (direction == MoveDirection.UP ? -1 : 1);
        Issue adjacentIssue = issuesByPriorityDesc.get(adjacentIssueIndex);

        if (isGapSufficient(issueAtIndex, adjacentIssue)) {
            issue.setPriority(getMiddlePriority(issueAtIndex, adjacentIssue));
            issuesToBeUpdated.add(issue);
            return issuesToBeUpdated;
        }

        if (canBeSwapped(currentIssueIndex, requestedIndex)) {
            int temp = issue.getPriority();
            issue.setPriority(issueAtIndex.getPriority());
            issueAtIndex.setPriority(temp);

            issuesToBeUpdated.add(issue);
            issuesToBeUpdated.add(issueAtIndex);
            return issuesToBeUpdated;
        }


        List<Issue> issuesToRebalance = getIssuesToRebalance(issuesByPriorityDesc, direction, adjacentIssueIndex);

        issuesToBeUpdated.add(issue);
        issuesToBeUpdated.addAll(rebalance(direction, issuesToRebalance));
        List<Issue> sortedAfterRebalance = issuesByPriorityDesc.stream()
                .sorted(Comparator.comparing(Issue::getPriority).reversed())
                .collect(Collectors.toList());
        changePriority(issue, requestedIndex, sortedAfterRebalance);

        return issuesToBeUpdated;
    }

    public Set<Issue> changePriority(Issue issue, int requestedIndex) {
        int containerId = issue.getContainer().getId();
        List<Issue> issuesByPriorityDesc = issueContainerRepository.findById(containerId)
                .orElseThrow(ResourceNotFoundException::new)
                .getIssues().stream().sorted(Comparator.comparing(Issue::getPriority).reversed())
                .collect(Collectors.toList());

        int currentIssueIndex = issuesByPriorityDesc.indexOf(issue);
        if (currentIssueIndex == requestedIndex) return Collections.emptySet();

        return changePriority(issue, requestedIndex, issuesByPriorityDesc);
    }

    private Set<Issue> rebalance(MoveDirection direction, List<Issue> issuesToRebalance) {
        int lastIndex = issuesToRebalance.size() - 1;
        Set<Issue> issuesToBeUpdated = new HashSet<>();

        Issue currentIssue = issuesToRebalance.get(0);

        if (lastIndex == 0) {
            int currentPriority = currentIssue.getPriority();
            currentIssue.setPriority(currentPriority + (direction == MoveDirection.UP ? DEFAULT_PRIORITY_OFFSET : -DEFAULT_PRIORITY_OFFSET));
            issuesToBeUpdated.add(currentIssue);
            return issuesToBeUpdated;
        }

        Issue adjacentIssue = issuesToRebalance.get(1);

        if (isGapSufficient(currentIssue, adjacentIssue)) {
            currentIssue.setPriority(getMiddlePriority(currentIssue, adjacentIssue));
            issuesToBeUpdated.add(currentIssue);
            return issuesToBeUpdated;
        }

        issuesToBeUpdated.addAll(rebalance(direction, issuesToRebalance.subList(1, lastIndex + 1)));
        issuesToBeUpdated.addAll(rebalance(direction, issuesToRebalance));
        return issuesToBeUpdated;
    }

    private List<Issue> getIssuesToRebalance(List<Issue> issuesByPriorityDesc, MoveDirection direction, int adjacentIssueIndex) {
        List<Issue> issues;
                if (direction == MoveDirection.UP) {
                    issues = issuesByPriorityDesc.subList(0, adjacentIssueIndex + 1);
                    Collections.reverse(issues);
                } else {
                    issues = issuesByPriorityDesc.subList(adjacentIssueIndex, issuesByPriorityDesc.size());
                }

        return new ArrayList<>(issues);
    }
}