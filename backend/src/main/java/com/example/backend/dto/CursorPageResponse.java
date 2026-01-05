package com.example.backend.dto;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class CursorPageResponse<T> {

    private List<T> items;
    private Long nextCursor;
    private boolean hasNext;

    public static <T> CursorPageResponse<T> of(List<T> items, int size) {
        boolean hasNext = items.size() > size;
        if (hasNext) {
            items.remove(size);
        }

        Long nextCursor = items.isEmpty()
                ? null
                : extractCursor(items.get(items.size() - 1));

        return new CursorPageResponse<>(items, nextCursor, hasNext);
    }

    private static Long extractCursor(Object item) {
        if (item instanceof CursorSupport cursorSupport) {
            return cursorSupport.getCursor();
        }
        throw new IllegalStateException("CursorSupport 구현 필요");
    }
}

