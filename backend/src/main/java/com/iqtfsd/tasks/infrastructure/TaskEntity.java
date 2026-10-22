package com.iqtfsd.tasks.infrastructure;

import com.iqtfsd.tasks.domain.Task;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.Instant;

@Entity
@Table(name = "tasks")
class TaskEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 160)
    private String title;

    @Column(nullable = false)
    private boolean completed;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    protected TaskEntity() {
    }

    TaskEntity(String title, Instant now) {
        this.title = title;
        this.completed = false;
        this.createdAt = now;
        this.updatedAt = now;
    }

    void update(String title, Boolean completed, Instant now) {
        if (title != null) {
            this.title = title;
        }
        if (completed != null) {
            this.completed = completed;
        }
        this.updatedAt = now;
    }

    Task toDomain() {
        return new Task(id, title, completed, createdAt, updatedAt);
    }
}

