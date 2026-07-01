package com.borrowx.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChatContactDTO {

    private Long contactId;
    private String name;
    private String avatar;
    private String lastMessage;
    private String time;
    private Boolean unread;
}
