package org.ssafy.respring.domain.book.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.ssafy.respring.domain.book.repository.chapterRepo.ChapterRepository;
import org.ssafy.respring.domain.book.vo.Book;
import org.ssafy.respring.domain.book.vo.Chapter;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ChapterService {

	private final ChapterRepository chapterRepository;

	@Transactional
	public void updateChapters(Book book, List<Chapter> updatedChapters) {
		// ✅ 1️⃣ 기존 챕터 ID를 Map으로 저장 (빠른 조회)
		Map<Long, Chapter> existingChaptersMap = chapterRepository.findByBookId(book.getId()).stream()
		  .collect(Collectors.toMap(Chapter::getId, chapter -> chapter));

		// ✅ 2️⃣ 새로운 챕터 리스트를 Map으로 변환 (O(1) 비교 가능)
		Map<Long, Chapter> updatedChaptersMap = updatedChapters.stream()
		  .filter(chapter -> chapter.getId() != null)
		  .collect(Collectors.toMap(Chapter::getId, chapter -> chapter));

		List<Chapter> chaptersToUpdate = new ArrayList<>();
		List<Chapter> newChapters = new ArrayList<>();

		// ✅ 3️⃣ 기존 챕터 중 수정되거나 삭제된 것 체크
		for (Map.Entry<Long, Chapter> entry : existingChaptersMap.entrySet()) {
			Long existingChapterId = entry.getKey();
			Chapter existingChapter = entry.getValue();

			if (updatedChaptersMap.containsKey(existingChapterId)) {
				// ✅ 수정이 필요한 챕터만 업데이트
				Chapter updatedChapter = updatedChaptersMap.get(existingChapterId);
				existingChapter.setChapterTitle(updatedChapter.getChapterTitle());
				existingChapter.setChapterContent(updatedChapter.getChapterContent());
				chaptersToUpdate.add(existingChapter);
			}
		}

		// ✅ 4️⃣ 새로운 챕터 추가 (ID가 없는 챕터들만)
		for (Chapter updatedChapter : updatedChapters) {
			if (updatedChapter.getId() == null) {
				updatedChapter.setBookId(book.getId());
				newChapters.add(updatedChapter);
			}
		}

		// ✅ 5️⃣ 기존 챕터 중 삭제된 챕터 제거
		Set<Long> updatedChapterIds = updatedChaptersMap.keySet();
		List<Chapter> chaptersToDelete = existingChaptersMap.values().stream()
		  .filter(chapter -> !updatedChapterIds.contains(chapter.getId()))
		  .collect(Collectors.toList());

		// ✅ 6️⃣ 변경된 챕터들을 DB에 반영
		chapterRepository.deleteAll(chaptersToDelete);
		chapterRepository.saveAll(chaptersToUpdate);
		chapterRepository.saveAll(newChapters);
	}


	// ✅ 특정 책의 챕터를 정렬하여 가져오기
	public List<Chapter> getChaptersByBookId(Long bookId) {
		return chapterRepository.findByBookIdOrderByOrderAsc(bookId);
	}

	public String getBookContent(Long bookId) {
		List<Chapter> chapters = getChaptersByBookId(bookId);
		List<Map<String, String>> chapterContents = new ArrayList<>();

		for (Chapter chapter : chapters) {
			Map<String, String> chapterMap = new LinkedHashMap<>();
			chapterMap.put("chapterTitle", chapter.getChapterTitle());
			chapterMap.put("chapterContent", chapter.getChapterContent());
			chapterContents.add(chapterMap);
		}

		try {
			ObjectMapper objectMapper = new ObjectMapper();
			return objectMapper.writeValueAsString(chapterContents);
		} catch (JsonProcessingException e) {
			throw new RuntimeException("Error converting chapters to JSON", e);
		}
	}
}
