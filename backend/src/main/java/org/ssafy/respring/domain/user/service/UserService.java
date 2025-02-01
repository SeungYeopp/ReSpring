package org.ssafy.respring.domain.user.service;

import jakarta.mail.AuthenticationFailedException;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import org.ssafy.respring.domain.user.dto.request.LoginRequestDto;
import org.ssafy.respring.domain.user.dto.request.PasswordEncryptionResultDto;
import org.ssafy.respring.domain.user.dto.request.SignUpRequestDto;
import org.ssafy.respring.domain.user.mapper.UserMapper;
import org.ssafy.respring.domain.user.repository.SaltRepository;
import org.ssafy.respring.domain.user.repository.UserRepository;
import org.ssafy.respring.domain.user.vo.Salt;
import org.ssafy.respring.domain.user.vo.User;
import org.ssafy.respring.util.OpenCrypt;
import org.ssafy.respring.domain.user.dto.response.LoginResponseDto;

import java.util.NoSuchElementException;

@Service
@Transactional
public class UserService {
    private final UserRepository userRepository;
    private final SaltRepository saltRepository;
    private final UserMapper userMapper;

    public UserService(UserRepository userRepository, SaltRepository saltRepository, UserMapper userMapper) {
        this.userRepository = userRepository;
        this.saltRepository = saltRepository;
        this.userMapper = userMapper;
    }

    public void addUser(SignUpRequestDto signUpRequestDto) {

        User user = userMapper.dtoToEntity(signUpRequestDto);

        PasswordEncryptionResultDto encryptionResult = OpenCrypt.encryptPw(signUpRequestDto.getPassword());
        user.changePassword(encryptionResult.getHashedPassword());

        userRepository.save(user);
        saltRepository.save(new Salt(user.getUserId(), encryptionResult.getSalt()));
    }

    public LoginResponseDto loginUser(LoginRequestDto loginRequestDto) throws AuthenticationFailedException {
        User loginUser = userRepository.findByEmail(loginRequestDto.getEmail())
                .orElseThrow(() -> new NoSuchElementException("EMAIL_NOT_FOUND"));

        String salt = saltRepository.findById(loginUser.getUserId())
                .orElseThrow(() -> new NoSuchElementException("SALT_NOT_FOUND")).getSalt();

        String encryptPassword = OpenCrypt.byteArrayToHex(OpenCrypt.getSHA256(loginRequestDto.getPassword(), salt));
        if (!loginUser.getPassword().equals(encryptPassword)) {
            throw new AuthenticationFailedException("AUTH_FAILED");
        }

        return new LoginResponseDto(loginUser.getUserId(),loginUser.getUserNickname());
    }
}
