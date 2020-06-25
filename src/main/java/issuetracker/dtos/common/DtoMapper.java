package issuetracker.dtos.common;

public interface DtoMapper<T, K extends Dto<T>> {
    T toEntity(K dto, T entity);
    K toDto(T entity, K dto);
}
