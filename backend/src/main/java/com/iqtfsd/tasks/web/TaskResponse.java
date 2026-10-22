package com.iqtfsd.tasks.web;

import com.iqtfsd.tasks.domain.Task;
import java.time.Instant;

public record TaskResponse(long id, String title, boolean completed, Instant createdAt, Instant updatedAt) {
    static TaskResponse from(Task task) {
        return new TaskResponse(task.id(), task.title(), task.completed(), task.createdAt(), task.updatedAt());
    }
}

