package org.ssafy.respring.domain.book.repository;

import org.ssafy.respring.domain.book.vo.Book;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public interface BookRepositoryQueryDsl {
    List<Book> getAllBooksSortedBy(String sortBy, boolean ascending);

    List<Book> getAllBooksSortedBy(String sortBy, boolean ascending, Long lastValue, LocalDateTime lastCreatedAt, Long lastId, int size);

    List<Book> getAllBooksSortedByTrends();

    List<Book> getAllBooksSortedByTrends(Long lastLikes, Long lastViews, LocalDateTime lastCreatedAt, Long lastBookId, int size);

    List<Book> findLikedBooksByUserId(UUID userId);

    List<Book> findMyBooksByUserId(UUID userId);

    List<Book> getWeeklyTop3Books();
}
