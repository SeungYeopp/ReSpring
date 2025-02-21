package org.ssafy.respring.domain.user.service;

import jakarta.mail.AuthenticationFailedException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.ssafy.respring.domain.image.service.ImageService;
import org.ssafy.respring.domain.user.dto.request.LoginRequestDto;
import org.ssafy.respring.domain.user.dto.response.LoginResponseDto;
import org.ssafy.respring.domain.user.mapper.UserMapper;
import org.ssafy.respring.domain.user.repository.SaltRepository;
import org.ssafy.respring.domain.user.repository.UserRepository;
import org.ssafy.respring.domain.user.vo.User;
import org.ssafy.respring.util.OpenCrypt;

import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final SaltRepository saltRepository;
    private final ImageService imageService;
    private final UserMapper userMapper;


    public LoginResponseDto loginUser(LoginRequestDto loginRequestDto) throws AuthenticationFailedException {
        User loginUser = userRepository.findByEmail(loginRequestDto.getEmail())
                .orElseThrow(() -> new NoSuchElementException("EMAIL_NOT_FOUND"));

        String salt = saltRepository.findById(loginUser.getId())
                .orElseThrow(() -> new NoSuchElementException("SALT_NOT_FOUND")).getSalt();

        String encryptPassword = OpenCrypt.byteArrayToHex(OpenCrypt.getSHA256(loginRequestDto.getPassword(), salt));
        if (!loginUser.getPassword().equals(encryptPassword)) {
            throw new AuthenticationFailedException("AUTH_FAILED");
        }

        String s3Key = loginUser.getProfileImage();

        String profileImageUrl = (s3Key != null && !s3Key.isEmpty())
                ? imageService.generatePresignedUrl(s3Key)
                : "https://i.imgur.com/QbLhsD7.png";

        return userMapper.entityToDto(loginUser, profileImageUrl);
    }


    public String getUserProfileImageUrl(UUID userId) {
        Optional<User> userOptional = userRepository.findById(userId);

        if (userOptional.isPresent()) {
            String s3Key = userOptional.get().getProfileImage();
            if (s3Key != null && !s3Key.isEmpty()) {
                return imageService.generatePresignedUrl(s3Key);
            }
        }
        return "https://i.imgur.com/QbLhsD7.png";
    }

    public LoginResponseDto createResponseDto(User user) {
        String image = getUserProfileImageUrl(user.getId());
        return userMapper.entityToDto(user, image);
    }
}
