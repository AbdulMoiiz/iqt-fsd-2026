package com.iqtfsd.tasks.application;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.iqtfsd.tasks.domain.Task;
import java.time.Instant;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class TaskServiceTest {
    @Mock
    TaskStore store;

    @InjectMocks
    TaskService service;

    @Test
    void trimsTaskTitleBeforeCreating() {
        Task task = new Task(1L, "Write report", false, Instant.EPOCH, Instant.EPOCH);
        when(store.create(eq("Write report"), any(Instant.class))).thenReturn(task);

        assertEquals(task, service.create("  Write report  "));
        verify(store).create(eq("Write report"), any(Instant.class));
    }

    @Test
    void rejectsAnEmptyUpdate() {
        assertThrows(InvalidTaskUpdateException.class, () -> service.update(1L, null, null));
    }
}
