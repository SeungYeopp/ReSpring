package org.ssafy.respring.Exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.CONFLICT)
public class DuplicateUserNicknameException extends RuntimeException {
    public DuplicateUserNicknameException(String message) {
        super(message);
    }
}
