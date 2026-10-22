package com.iqtfsd.tasks.web;

import java.util.Map;

public record ApiError(ErrorDetails error) {
    public record ErrorDetails(String code, String message, Map<String, String> fields) {
    }

    static ApiError of(String code, String message) {
        return new ApiError(new ErrorDetails(code, message, Map.of()));
    }

    static ApiError of(String code, String message, Map<String, String> fields) {
        return new ApiError(new ErrorDetails(code, message, fields));
    }
}

