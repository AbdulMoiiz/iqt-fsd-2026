package com.iqtfsd.tasks.web;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record CreateTaskEnvelope(@NotNull @Valid Data data) {
    public record Data(@NotBlank @Size(max = 160) String title) {
    }
}

