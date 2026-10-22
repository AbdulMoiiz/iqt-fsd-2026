package com.iqtfsd.tasks.domain;

import java.time.Instant;

public record Task(Long id, String title, boolean completed, Instant createdAt, Instant updatedAt) {
}

