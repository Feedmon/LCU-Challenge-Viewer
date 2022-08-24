package feedmon.testing.domain;

import javax.persistence.*;
import java.util.List;

@Entity
@Table
public class Subject {

    @Id
    @GeneratedValue
    private Long id;

    @Column
    private String name;

    @Column
    private String teacher;

    @ElementCollection
    @OrderColumn
    private List<String> goodClassMates;

    @ElementCollection
    @OrderColumn
    private List<String> topics;

    @ElementCollection
    @OrderColumn
    private List<String> work;

    @OneToMany
    @JoinColumn(nullable = false)
    private List<Lesson> lesson;


    public Subject(String name, String teacher) {
        this.name = name;
        this.teacher = teacher;
    }
}
