package com.endless.chat.chat;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.stereotype.Controller;

@Controller
public class ControladorChat {

    // Manejar mensajes enviados por los usuarios
    @MessageMapping("/chat.sendMessage")
    @SendTo("/topic/public")
    public MensajeChat sendMessage(
            @Payload MensajeChat mensajeChat
    ){
        return mensajeChat;
    }

    // Manejar la adición de un nuevo usuario al chat
    @MessageMapping("/chat.addUser")
    @SendTo("/topic/public")
    public MensajeChat addUser(
            @Payload MensajeChat mensajeChat,
            SimpMessageHeaderAccessor headerAccessor
    ){
        // Agregar el nombre de usuario en la sesión del socket web
        headerAccessor.getSessionAttributes().put("nombreDeUsuario", mensajeChat.getSender());
        return mensajeChat;
    }
}
