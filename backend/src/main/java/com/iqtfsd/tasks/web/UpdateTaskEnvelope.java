package com.iqtfsd.tasks.web;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record UpdateTaskEnvelope(@NotNull @Valid Data data) {
    public record Data(@Pattern(regexp = "(?s).*\\S.*", message = "must not be blank") @Size(max = 160) String title,
                       Boolean completed) {
    }
}

