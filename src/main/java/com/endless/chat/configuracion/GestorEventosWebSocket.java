package com.endless.chat.configuracion;

import com.endless.chat.chat.MensajeChat;
import com.endless.chat.chat.TipoDeMensaje;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

@Component
@RequiredArgsConstructor
@Slf4j
public class GestorEventosWebSocket {

    private final SimpMessageSendingOperations messageTemplate;

    // Escucha el evento de desconexión WebSocket
    @EventListener
    public void handleWebSocketDisconnectListener(SessionDisconnectEvent event) {
        // Acceder a los encabezados de Stomp
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
        String nombreDeUsuario = (String) headerAccessor.getSessionAttributes().get("nombreDeUsuario");

        if (nombreDeUsuario != null) {
            log.info("Usuario desconectado: {}", nombreDeUsuario);

            // Crear un mensaje de tipo LEAVE para notificar la desconexión
            var chatMessage = MensajeChat.builder()
                    .type(TipoDeMensaje.LEAVE)
                    .sender(nombreDeUsuario)
                    .build();

            // Enviar el mensaje a la ruta /topic/public
            messageTemplate.convertAndSend("/topic/public", chatMessage);
        }
    }
}
