package feedmon.testing.adapters.database;


import feedmon.testing.domain.Subject;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface SubjectRepository extends CrudRepository<Subject, Long> {
/*
    @Query("select job from Subject job where :user MEMBER OF job.orderers or TYPE (job) in :jobTypes")
    Set<Subject> findByOrdererOrJobType(@Param("user") String user, @Param("jobTypes") List<Class<? extends Subject>> jobTypes);

    @Query("select job from Subject job where :user MEMBER OF job.orderers")
    Set<Subject> findByOrderer(@Param("user") String user);
*/

    @Query("select job.id from Subject job")
    List<Long> getAllJobIds();

    @Query("select subject from Subject subject")
    List<Subject> getAllSubjects();

    default Subject findByIdOrThrow(Long translationJobId) {
        return findById(translationJobId).orElseThrow(() -> new RuntimeException(translationJobId + "uppss"));
    }

}