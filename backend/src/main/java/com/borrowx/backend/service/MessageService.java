package com.borrowx.backend.service;

import com.borrowx.backend.dto.ChatContactDTO;
import com.borrowx.backend.entity.Message;
import com.borrowx.backend.entity.User;
import com.borrowx.backend.exception.ResourceNotFoundException;
import com.borrowx.backend.repository.MessageRepository;
import com.borrowx.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
public class MessageService {

    private final MessageRepository messageRepository;
    private final UserRepository userRepository;

    public MessageService(MessageRepository messageRepository,
                          UserRepository userRepository) {
        this.messageRepository = messageRepository;
        this.userRepository = userRepository;
    }

    public Message sendMessage(String senderEmail, Long recipientId, String content) {
        User sender = userRepository.findByEmail(senderEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Sender not found"));
        User recipient = userRepository.findById(recipientId)
                .orElseThrow(() -> new ResourceNotFoundException("Recipient not found"));

        Message message = new Message();
        message.setSender(sender);
        message.setRecipient(recipient);
        message.setContent(content);
        message.setTimestamp(LocalDateTime.now());
        message.setStatus("sent");

        // Simulate rapid delivery to "delivered"
        Message saved = messageRepository.save(message);
        saved.setStatus("delivered");
        return messageRepository.save(saved);
    }

    public List<Message> getChatHistory(String email, Long contactId) {
        User currentUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        List<Message> history = messageRepository.findChatHistory(currentUser.getId(), contactId);

        // Mark incoming messages as read
        boolean updated = false;
        for (Message msg : history) {
            if (msg.getRecipient().getId().equals(currentUser.getId()) && !msg.getStatus().equals("read")) {
                msg.setStatus("read");
                messageRepository.save(msg);
                updated = true;
            }
        }
        if (updated) {
            history = messageRepository.findChatHistory(currentUser.getId(), contactId);
        }
        return history;
    }

    public List<ChatContactDTO> getChatContacts(String email) {
        User currentUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        List<Message> allChats = messageRepository.findAllUserChats(currentUser.getId());
        Map<Long, Message> contactLastMessageMap = new LinkedHashMap<>();
        Map<Long, Integer> unreadCountMap = new HashMap<>();

        for (Message msg : allChats) {
            Long contactId = msg.getSender().getId().equals(currentUser.getId())
                    ? msg.getRecipient().getId()
                    : msg.getSender().getId();

            if (!contactLastMessageMap.containsKey(contactId)) {
                contactLastMessageMap.put(contactId, msg);
            }

            if (msg.getRecipient().getId().equals(currentUser.getId()) && !msg.getStatus().equals("read")) {
                unreadCountMap.put(contactId, unreadCountMap.getOrDefault(contactId, 0) + 1);
            }
        }

        List<ChatContactDTO> contactDTOs = new ArrayList<>();
        DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("hh:mm a");

        for (Map.Entry<Long, Message> entry : contactLastMessageMap.entrySet()) {
            Long contactId = entry.getKey();
            Message lastMsg = entry.getValue();

            User contactUser = lastMsg.getSender().getId().equals(currentUser.getId())
                    ? lastMsg.getRecipient()
                    : lastMsg.getSender();

            String timeStr = lastMsg.getTimestamp().format(timeFormatter);

            // Generate DiceBear avatar matching our frontend style
            String avatarUrl = "https://api.dicebear.com/7.x/adventurer/svg?seed=" + contactUser.getId();

            contactDTOs.add(new ChatContactDTO(
                    contactUser.getId(),
                    contactUser.getFullName(),
                    avatarUrl,
                    lastMsg.getContent(),
                    timeStr,
                    unreadCountMap.getOrDefault(contactId, 0) > 0
            ));
        }

        return contactDTOs;
    }
}
