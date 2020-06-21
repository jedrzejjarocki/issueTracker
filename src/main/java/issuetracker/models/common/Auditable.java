package issuetracker.models.common;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.envers.Audited;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedBy;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;
import java.util.Date;

@Getter
@Setter
@ToString
@MappedSuperclass
@EntityListeners(AuditingEntityListener.class)
public abstract class Auditable<T> extends BaseEntity {
    @CreatedBy
    @Column(updatable = false)
    private T createdBy; //username

    @CreatedDate
    @CreationTimestamp
    @Temporal(TemporalType.TIMESTAMP)
    @Column(updatable = false)
    private Date createdTime;

    @LastModifiedBy
    @Audited
    private T lastModifiedBy; //username

    @LastModifiedDate
    @Temporal(TemporalType.TIMESTAMP)
    @Audited
    private Date lastModifiedTime;
}
