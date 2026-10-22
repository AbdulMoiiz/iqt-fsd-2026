package com.iqtfsd.tasks.infrastructure;

import com.iqtfsd.tasks.application.TaskNotFoundException;
import com.iqtfsd.tasks.application.TaskStore;
import com.iqtfsd.tasks.domain.Task;
import java.time.Instant;
import java.util.List;
import org.springframework.stereotype.Repository;

@Repository
class JpaTaskStore implements TaskStore {
    private final JpaTaskRepository repository;

    JpaTaskStore(JpaTaskRepository repository) {
        this.repository = repository;
    }

    @Override
    public List<Task> list() {
        return repository.findAllByOrderByCreatedAtDescIdDesc().stream().map(TaskEntity::toDomain).toList();
    }

    @Override
    public Task create(String title, Instant now) {
        return repository.save(new TaskEntity(title, now)).toDomain();
    }

    @Override
    public Task update(long id, String title, Boolean completed, Instant now) {
        TaskEntity entity = repository.findById(id).orElseThrow(() -> new TaskNotFoundException(id));
        entity.update(title, completed, now);
        return entity.toDomain();
    }

    @Override
    public boolean delete(long id) {
        return repository.deleteExisting(id) > 0;
    }
}

