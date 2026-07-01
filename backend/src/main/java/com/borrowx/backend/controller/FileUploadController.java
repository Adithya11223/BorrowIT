package com.borrowx.backend.controller;

import com.borrowx.backend.dto.ItemResponseDTO;
import com.borrowx.backend.service.FileUploadService;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/upload")
@CrossOrigin(origins = "*")
public class FileUploadController {

    private final FileUploadService fileUploadService;

    public FileUploadController(FileUploadService fileUploadService) {
        this.fileUploadService = fileUploadService;
    }

    @PostMapping(
            value = "/{itemId}",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ItemResponseDTO uploadImage(
            @PathVariable Long itemId,
            @RequestParam("file") MultipartFile file
    ) throws IOException {

        return fileUploadService.uploadImage(itemId, file);
    }
}