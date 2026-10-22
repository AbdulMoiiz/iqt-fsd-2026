package com.iqtfsd.tasks.application;

import com.iqtfsd.tasks.domain.Task;
import java.time.Instant;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class TaskService {
    private final TaskStore store;

    public TaskService(TaskStore store) {
        this.store = store;
    }

    @Transactional(readOnly = true)
    public List<Task> list() {
        return store.list();
    }

    @Transactional
    public Task create(String title) {
        return store.create(title.trim(), Instant.now());
    }

    @Transactional
    public Task update(long id, String title, Boolean completed) {
        if (title == null && completed == null) {
            throw new InvalidTaskUpdateException();
        }
        return store.update(id, title == null ? null : title.trim(), completed, Instant.now());
    }

    @Transactional
    public void delete(long id) {
        if (!store.delete(id)) {
            throw new TaskNotFoundException(id);
        }
    }
}

