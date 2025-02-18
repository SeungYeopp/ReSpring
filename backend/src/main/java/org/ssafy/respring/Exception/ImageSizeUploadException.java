package org.ssafy.respring.Exception;

import org.springframework.web.bind.annotation.ResponseStatus;

import static org.springframework.http.HttpStatus.BAD_REQUEST;

@ResponseStatus(BAD_REQUEST)
public class ImageSizeUploadException extends RuntimeException {
    public ImageSizeUploadException(String message) {
        super(message);
    }
}
