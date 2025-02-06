package org.ssafy.respring.domain.book.repository;

import org.ssafy.respring.domain.book.vo.Book;

import java.util.List;
import java.util.UUID;

public interface BookRepositoryQueryDsl {
    List<Book> getAllBooksSortedByTrends();
    List<Book> getLikedBooks(UUID userId);
    List<Book> getMyBooks(UUID userId);
    List<Book> getWeeklyTop3Books();
}
