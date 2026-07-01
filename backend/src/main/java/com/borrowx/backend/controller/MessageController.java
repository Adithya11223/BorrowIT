package com.borrowx.backend.controller;

import com.borrowx.backend.dto.ChatContactDTO;
import com.borrowx.backend.entity.Message;
import com.borrowx.backend.service.JwtService;
import com.borrowx.backend.service.MessageService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/chats")
@CrossOrigin(origins = "*")
public class MessageController {

    private final MessageService messageService;
    private final JwtService jwtService;

    public MessageController(MessageService messageService,
                             JwtService jwtService) {
        this.messageService = messageService;
        this.jwtService = jwtService;
    }

    @GetMapping("/contacts")
    public List<ChatContactDTO> getContacts(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7);
        String email = jwtService.extractEmail(token);
        return messageService.getChatContacts(email);
    }

    @GetMapping("/history")
    public List<Message> getHistory(
            @RequestParam Long contactId,
            @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7);
        String email = jwtService.extractEmail(token);
        return messageService.getChatHistory(email, contactId);
    }

    @PostMapping("/send")
    public Message sendMessage(
            @RequestBody Map<String, Object> payload,
            @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7);
        String email = jwtService.extractEmail(token);

        Long recipientId = Long.valueOf(payload.get("recipientId").toString());
        String content = payload.get("content").toString();

        return messageService.sendMessage(email, recipientId, content);
    }
}
