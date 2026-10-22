package com.iqtfsd.tasks.web;

import com.iqtfsd.tasks.application.TaskService;
import jakarta.validation.Valid;
import java.net.URI;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {
    private final TaskService service;

    public TaskController(TaskService service) {
        this.service = service;
    }

    @GetMapping
    public ApiResponse<List<TaskResponse>> list() {
        return new ApiResponse<>(service.list().stream().map(TaskResponse::from).toList());
    }

    @PostMapping
    public ResponseEntity<ApiResponse<TaskResponse>> create(@Valid @RequestBody CreateTaskEnvelope request) {
        TaskResponse task = TaskResponse.from(service.create(request.data().title()));
        return ResponseEntity.created(URI.create("/api/tasks/" + task.id())).body(new ApiResponse<>(task));
    }

    @PatchMapping("/{id}")
    public ApiResponse<TaskResponse> update(@PathVariable long id, @Valid @RequestBody UpdateTaskEnvelope request) {
        return new ApiResponse<>(TaskResponse.from(service.update(id, request.data().title(), request.data().completed())));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}

