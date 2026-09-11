package catatcuan.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class ClientRequest {

    @NotBlank(message = "Nama klien tidak boleh kosong")
    private String name;

    private String contact;

    private String address;
}
