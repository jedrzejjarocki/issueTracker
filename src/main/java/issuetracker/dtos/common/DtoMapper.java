package issuetracker.dtos.common;

public interface DtoMapper<T, K extends Dto<T>> {
    T toEntity(K dto, T entity);
    //@Todo remove if unnecessary
    T toEntity(K dto, T entity, boolean skipNull);
    K toDto(T entity, K dto);
}
