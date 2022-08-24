package feedmon.testing.domain;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Entity
public class Lesson {


    @Id
    @GeneratedValue
    private Long id;

    @Column
    private Date date;


    @OneToMany
    @JoinColumn(nullable = false)
    private List<Task> tasks = new ArrayList<>();

    @Column
    private String comment;
}
