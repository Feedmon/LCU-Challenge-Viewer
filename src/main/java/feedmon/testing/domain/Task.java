package feedmon.testing.domain;

import feedmon.testing.util.enums.TaskType;
import feedmon.testing.util.enums.Understanding;

import javax.persistence.*;
import java.util.List;

@Entity
public class Task {

    @Id
    @GeneratedValue
    private Long id;

    @Column
    private String title;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private TaskType taskType;


    @ElementCollection
    @OrderColumn
    private List<String> comments;

    @Column
    private boolean isDone;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private Understanding understanding;
}
