package org.ssafy.respring.domain.user.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.ssafy.respring.domain.image.service.ImageService;
import org.ssafy.respring.domain.user.dto.request.PasswordEncryptionResultDto;
import org.ssafy.respring.domain.user.dto.request.SignUpRequestDto;
import org.ssafy.respring.domain.user.mapper.UserMapper;
import org.ssafy.respring.domain.user.repository.SaltRepository;
import org.ssafy.respring.domain.user.repository.UserRepository;
import org.ssafy.respring.domain.user.vo.Salt;
import org.ssafy.respring.domain.user.vo.User;
import org.ssafy.respring.util.OpenCrypt;

@Service
@Transactional
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final SaltRepository saltRepository;
    private final ImageService imageService;
    private final UserMapper userMapper;


    public void addUser(SignUpRequestDto signUpRequestDto, MultipartFile image) {

        validatesignUpDto(signUpRequestDto);

        User user = userMapper.dtoToEntity(signUpRequestDto);

        String profileImageUrl = (image != null && !image.isEmpty())
                ? imageService.uploadImageToS3(image, "profile")
                : "public/placeholder_profilepic.png"; // 기본 프로필 이미지

        user.setProfileImage(profileImageUrl);

        PasswordEncryptionResultDto encryptionResult = OpenCrypt.encryptPw(signUpRequestDto.getPassword());
        user.changePassword(encryptionResult.getHashedPassword());

        if (user.getProvider() == null) {
            user.setProvider("LOCAL");
        }

        userRepository.save(user);
        saltRepository.save(new Salt(user.getId(), encryptionResult.getSalt()));
    }


    public User findByNickname(String nickname) {
        return userRepository.findByUserNickname(nickname).get();
    }


    private void validatesignUpDto(SignUpRequestDto signUpRequestDto) {
        if (userRepository.existsByUserNickname(signUpRequestDto.getUserNickname())) {
            throw new IllegalArgumentException("DUPLICATE_USERNICKNAME");
        }
        if (userRepository.existsByEmail(signUpRequestDto.getEmail())) {
            throw new IllegalArgumentException("DUPLICATE_EMAIL");
        }
    }
}




