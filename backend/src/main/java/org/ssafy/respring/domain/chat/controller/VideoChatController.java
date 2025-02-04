package org.ssafy.respring.domain.chat.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
public class VideoChatController {
    private final SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/video.offer/{roomId}")
    @SendTo("/topic/video/{roomId}")
    public String handleOffer(@DestinationVariable String roomId, String offer) {
        return offer;  // 클라이언트에 SDP Offer 전송
    }

    @MessageMapping("/video.answer/{roomId}")
    @SendTo("/topic/video/{roomId}")
    public String handleAnswer(@DestinationVariable String roomId, String answer) {
        return answer;  // 클라이언트에 SDP Answer 전송
    }

    @MessageMapping("/video.ice/{roomId}")
    @SendTo("/topic/video/{roomId}")
    public String handleIceCandidate(@DestinationVariable String roomId, String candidate) {
        return candidate;  // 클라이언트에 ICE Candidate 전송
    }
}
