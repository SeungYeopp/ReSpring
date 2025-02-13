package org.ssafy.respring.domain.post.service;

import com.querydsl.core.Tuple;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.ssafy.respring.domain.image.dto.response.ImageResponseDto;
import org.ssafy.respring.domain.comment.dto.response.CommentDto;
import org.ssafy.respring.domain.image.service.ImageService;
import org.ssafy.respring.domain.image.vo.ImageType;
import org.ssafy.respring.domain.post.dto.request.PostRequestDto;
import org.ssafy.respring.domain.post.dto.request.PostUpdateRequestDto;
import org.ssafy.respring.domain.post.dto.response.PostResponseDto;
import org.ssafy.respring.domain.comment.dto.response.CommentResponseDto;
import org.ssafy.respring.domain.post.repository.PostRepository;
import org.ssafy.respring.domain.post.vo.Post;
import org.ssafy.respring.domain.user.repository.UserRepository;
import org.ssafy.respring.domain.user.vo.User;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class PostService {
    private final PostRepository postRepository;
    private final ImageService imageService;
    private final UserRepository userRepository;

    /**
     * 📝 포스트 생성
     */
    @Transactional
    public Long createPostWithImages(PostRequestDto requestDto, List<MultipartFile> imageFiles, UUID userId) {
        // ✅ 유저 조회
        User user = getUserById(userId);

        // ✅ 포스트 저장
        Post post = Post.builder()
                .title(requestDto.getTitle())
                .content(requestDto.getContent())
                .category(requestDto.getCategory())
                .likes(0L)
                .user(user)
                .build();

        postRepository.save(post);

        // ✅ 이미지 저장
        if (imageFiles != null && !imageFiles.isEmpty()) {
            imageService.saveImages(imageFiles, ImageType.POST, post.getId());
        }

        return post.getId();
    }

    /**
     * 📝 포스트 수정
     */
    @Transactional
    public void updatePost(Long postId, PostUpdateRequestDto requestDto, List<MultipartFile> imageFiles, UUID userId) {
        // ✅ 포스트 조회
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("Post not found with id: " + postId));


        // ✅ 작성자 검증
        User user = getUserById(userId);

        if (!post.getUser().getId().equals(user.getId())) {
            throw new IllegalArgumentException("You are not authorized to modify this post.");
        }

        boolean isUpdated = false;

        if (!post.getTitle().equals(requestDto.getTitle())) {
            post.setTitle(requestDto.getTitle());
            isUpdated = true;
        }
        if (!post.getContent().equals(requestDto.getContent())) {
            post.setContent(requestDto.getContent());
            isUpdated = true;
        }
        if (!post.getCategory().equals(requestDto.getCategory())) {
            post.setCategory(requestDto.getCategory());
            isUpdated = true;
        }

        // ✅ 기존 이미지 삭제
        List<Long> deleteImageIds = requestDto.getDeleteImageIds();
        if (deleteImageIds != null && !deleteImageIds.isEmpty()) {
            imageService.deleteImages(ImageType.POST, postId);
        }

        // ✅ 새로운 이미지 추가
        if (imageFiles != null && !imageFiles.isEmpty()) {
            imageService.saveImages(imageFiles, ImageType.POST, postId);
        }

        // ✅ 변경된 경우만 업데이트
        if (isUpdated) {
            postRepository.save(post);
        }
    }

    /**
     * 📝 포스트 삭제
     */
    @Transactional
    public void deletePost(Long postId, UUID userId) {
        // ✅ 포스트 조회
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("Post not found with id: " + postId));

        // ✅ 작성자 검증
        UUID requestUserId = getUserById(userId).getId();
        if (!post.getUser().getId().equals(requestUserId)) {
            throw new IllegalArgumentException("You are not authorized to delete this post.");
        }

        // ✅ 관련 이미지 삭제
        imageService.deleteImages(ImageType.POST, postId);

        // ✅ 포스트 삭제
        postRepository.delete(post);
    }

    /**
     * 📝 포스트 상세 조회
     */
    public PostResponseDto getPost(Long id, UUID userId) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Post not found with id: " + id));
        return toResponseDto(post, userId);
    }

    public List<PostResponseDto> getAllPosts(UUID userId) {
        return postRepository.findAll()
                .stream()
                .map(post -> toResponseDto(post, userId))  // ✅ userId 전달
                .collect(Collectors.toList());
    }

    public List<PostResponseDto> getMyPosts(UUID userId) {
        return postRepository.findByUser_Id(userId)
                .stream()
                .map(post -> toResponseDto(post, userId))  // ✅ userId 전달
                .collect(Collectors.toList());
    }

    public List<PostResponseDto> getPostsByCursor(Long lastId, int limit, UUID userId) {
        return postRepository.findByCursor(lastId, limit)
                .stream()
                .map(post -> toResponseDto(post, userId))  // ✅ userId 전달
                .collect(Collectors.toList());
    }

    public List<PostResponseDto> searchPostsByTitle(String title, UUID userId) {
        return postRepository.searchByTitle(title)
                .stream()
                .map(post -> toResponseDto(post, userId))  // ✅ userId 전달
                .collect(Collectors.toList());
    }

    public List<PostResponseDto> filterPostsByCategory(String category, UUID userId) {
        return postRepository.filterByCategory(category)
                .stream()
                .map(post -> toResponseDto(post, userId))  // ✅ userId 전달
                .collect(Collectors.toList());
    }


    public List<PostResponseDto> getPopularPosts(UUID userId) {
        LocalDateTime oneWeekAgo = LocalDateTime.now().minusWeeks(1);
        List<Tuple> results = postRepository.findTop3ByLikesInPastWeekWithComments(oneWeekAgo);

        return results.stream()
                .map(tuple -> {
                    Post post = tuple.get(0, Post.class);
                    Long commentCount = tuple.get(1, Long.class);
                    return toResponseDto(post, userId);
                })
                .collect(Collectors.toList());
    }

    @Transactional
    public boolean toggleLike(Long postId, UUID userId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("Post not found with id: " + postId));

        boolean isLiked = post.toggleLike(userId);
        post.setLikes((long) post.getLikedUsers().size());
        return isLiked;
    }

    public boolean isPostLikedByUser(Long postId, UUID userId) {
        return postRepository.isPostLikedByUser(postId, userId);
    }

    private User getUserById(UUID userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("❌ 존재하지 않는 사용자입니다!"));
    }

    /**
     * 📝 Post → PostResponseDto 변환
     */
    private PostResponseDto toResponseDto(Post post, UUID userId) {
        // ✅ Image 테이블에서 Post에 해당하는 이미지 조회
        List<String> images = imageService.getImagesByEntity(ImageType.POST, post.getId());

        boolean isLiked = isPostLikedByUser(post.getId(), userId);

        List<CommentDto> commentDtos = post.getComments().stream()
                .map(comment -> new CommentDto(
                        comment.getId(),
                        comment.getContent(),
                        comment.getUser().getId(),
                        comment.getUser().getUserNickname(),
                        comment.getCreatedAt(),
                        comment.getUpdatedAt(),
                        comment.getParent() != null ? comment.getParent().getId() : null
                ))
                .collect(Collectors.toList());

        return new PostResponseDto(
                post.getId(),
                post.getTitle(),
                post.getContent(),
                post.getCategory(),
                post.getUser().getId(),
                post.getUser().getUserNickname(),
                post.getCreatedAt(),
                post.getUpdatedAt(),
                post.getLikes(),
                isLiked,
                images,
                commentDtos.size(),
                commentDtos
        );
    }
}
