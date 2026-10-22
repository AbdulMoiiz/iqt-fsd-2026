package com.iqtfsd.tasks.web;

import com.iqtfsd.tasks.application.InvalidTaskUpdateException;
import com.iqtfsd.tasks.application.TaskNotFoundException;
import java.util.LinkedHashMap;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class ApiExceptionHandler {
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiError> validation(MethodArgumentNotValidException exception) {
        Map<String, String> fields = new LinkedHashMap<>();
        exception.getBindingResult().getFieldErrors().forEach(error ->
                fields.putIfAbsent(error.getField(), error.getDefaultMessage()));
        return ResponseEntity.badRequest().body(ApiError.of("VALIDATION_ERROR", "Check the request fields", fields));
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ApiError> unreadable() {
        return ResponseEntity.badRequest().body(ApiError.of("INVALID_JSON", "Request body is missing or malformed"));
    }

    @ExceptionHandler(InvalidTaskUpdateException.class)
    public ResponseEntity<ApiError> invalidUpdate(InvalidTaskUpdateException exception) {
        return ResponseEntity.badRequest().body(ApiError.of("INVALID_UPDATE", exception.getMessage()));
    }

    @ExceptionHandler(TaskNotFoundException.class)
    public ResponseEntity<ApiError> notFound(TaskNotFoundException exception) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiError.of("TASK_NOT_FOUND", exception.getMessage()));
    }
}

