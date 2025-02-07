package org.ssafy.respring.domain.book.repository.bookRepo;

import org.ssafy.respring.domain.book.vo.Book;
import org.ssafy.respring.domain.comment.vo.Comment;

import java.util.List;
import java.util.UUID;

public interface BookRepositoryQueryDsl {
    List<Book> getAllBooksSortedByTrends();
    List<Book> findLikedBooksByUserId(UUID userId);
    List<Book> findMyBooksByUserId(UUID userId);
    List<Book> getWeeklyTop3Books();
    List<Comment> findCommentsByBookId(Long bookId);
}
