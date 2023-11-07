package com.endless.chat.chat;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class MensajeChat {

    private String content;  // Contenido del mensaje
    private String sender;   // Remitente del mensaje
    private TipoDeMensaje type;  // Tipo de mensaje
}
