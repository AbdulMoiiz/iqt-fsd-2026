package com.iqtfsd.tasks.application;

public class InvalidTaskUpdateException extends RuntimeException {
    public InvalidTaskUpdateException() {
        super("Provide a title or completion state to update");
    }
}

