package com.iqtfsd.tasks.application;

import com.iqtfsd.tasks.domain.Task;
import java.time.Instant;
import java.util.List;

public interface TaskStore {
    List<Task> list();
    Task create(String title, Instant now);
    Task update(long id, String title, Boolean completed, Instant now);
    boolean delete(long id);
}

