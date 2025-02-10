package org.ssafy.respring.domain.post.service;

import com.querydsl.core.Tuple;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.ssafy.respring.domain.image.dto.response.ImageResponseDto;
import org.ssafy.respring.domain.comment.dto.response.CommentDto;
import org.ssafy.respring.domain.image.service.ImageService;
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

    @Transactional
    public Long createPostWithImages(PostRequestDto requestDto, List<MultipartFile> imageFiles) {
        User user = userRepository.findById(requestDto.getUserId())
          .orElseThrow(() -> new RuntimeException("User not found with ID: " + requestDto.getUserId()));

        Post post = Post.builder()
          .title(requestDto.getTitle())
          .content(requestDto.getContent())
          .category(requestDto.getCategory())
          .likes(0L)
          .user(user)
          .build();

        postRepository.save(post);

        if (imageFiles != null && !imageFiles.isEmpty()) {
            imageService.saveImages(imageFiles, post);
        }

        return post.getId();
    }

    @Transactional
    public void updatePost(Long postId, PostUpdateRequestDto requestDto, List<MultipartFile> imageFiles) {
        Post post = postRepository.findById(postId)
          .orElseThrow(() -> new IllegalArgumentException("Post not found with id: " + postId));

        if (!post.getUser().getId().equals(requestDto.getUserId())) {
            throw new IllegalArgumentException("You are not authorized to modify this post.");
        }

        post.setTitle(requestDto.getTitle());
        post.setContent(requestDto.getContent());
        post.setCategory(requestDto.getCategory());

        List<Long> deleteImageIds = requestDto.getDeleteImageIds();
        if (deleteImageIds != null && !deleteImageIds.isEmpty()) {
            imageService.deleteImages(deleteImageIds);
        }

        if (imageFiles != null && !imageFiles.isEmpty()) {
            imageService.saveImages(imageFiles, post);
        }
    }

    @Transactional
    public void deletePost(Long postId, UUID requestUserId) {
        Post post = postRepository.findById(postId)
          .orElseThrow(() -> new IllegalArgumentException("Post not found with id: " + postId));

        if (!post.getUser().getId().equals(requestUserId)) {
            throw new IllegalArgumentException("You are not authorized to delete this post.");
        }

        List<Long> imageIds = post.getImages().stream()
          .map(image -> image.getImageId())
          .collect(Collectors.toList());
        imageService.deleteImages(imageIds);

        postRepository.delete(post);
    }

    public PostResponseDto getPost(Long id) {
        Post post = postRepository.findPostWithComments(id);
        if (post == null) {
            throw new IllegalArgumentException("Post not found with id: " + id);
        }
        return toResponseDto(post);
    }

    public List<PostResponseDto> getAllPosts() {
        return postRepository.findAll()
          .stream()
          .map(this::toResponseDto)
          .collect(Collectors.toList());
    }

    public List<PostResponseDto> getMyPosts(UUID userId) {
        return postRepository.findByUser_Id(userId)
          .stream()
          .map(this::toResponseDto)
          .collect(Collectors.toList());
    }

    public List<PostResponseDto> getPostsByCursor(Long lastId, int limit) {
        return postRepository.findByCursor(lastId, limit)
          .stream()
          .map(this::toResponseDto)
          .collect(Collectors.toList());
    }

    public List<PostResponseDto> searchPostsByTitle(String title) {
        return postRepository.searchByTitle(title)
          .stream()
          .map(this::toResponseDto)
          .collect(Collectors.toList());
    }

    public List<PostResponseDto> filterPostsByCategory(String category) {
        return postRepository.filterByCategory(category)
          .stream()
          .map(this::toResponseDto)
          .collect(Collectors.toList());
    }

    public List<PostResponseDto> getPopularPosts() {
        LocalDateTime oneWeekAgo = LocalDateTime.now().minusWeeks(1);
        List<Tuple> results = postRepository.findTop3ByLikesInPastWeekWithComments(oneWeekAgo);

        return results.stream()
          .map(tuple -> {
              Post post = tuple.get(0, Post.class);
              Long commentCount = tuple.get(1, Long.class);
              return toResponseDto(post);
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

    private PostResponseDto toResponseDto(Post post) {
        List<ImageResponseDto> imageDtos = post.getImages().stream()
                .map(image -> new ImageResponseDto(
                        image.getImageId(),
                        imageService.generatePresignedUrl(image.getS3Key(), 60) // ✅ Presigned URL 변환 적용
                ))
                .collect(Collectors.toList());

        List<CommentDto> commentDtos = (post.getComments() == null) ?
          List.of() : post.getComments().stream()
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
          imageDtos,
          commentDtos.size(),
          commentDtos
        );
    }
}
