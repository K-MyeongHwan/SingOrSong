package com.singorsong.singorsong.service;

import com.singorsong.singorsong.etc.CommonUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.GetUrlRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@RequiredArgsConstructor
@Component
public class S3Service {
    private final S3Client s3Client;

    @Value("${cloud.aws.s3.bucket}")
    private String bucketName;

    public List<String> uploadFile(MultipartFile multipartFile, String type) {


        if(multipartFile.isEmpty()) {
            log.info("image is null");
            return null;
        }

        String fileName = getFileName(multipartFile);

        try {
            PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                    .bucket(bucketName)
                    .contentType(multipartFile.getContentType())
                    .contentLength(multipartFile.getSize())
                    .key(type + fileName)
                    .build();
            RequestBody requestBody = RequestBody.fromBytes(multipartFile.getBytes());
            s3Client.putObject(putObjectRequest, requestBody);
        } catch (IOException e) {
            log.error("cannot upload image",e);
            throw new RuntimeException(e);
        }
        GetUrlRequest getUrlRequest = GetUrlRequest.builder()
                .bucket(bucketName)
                .key( type + fileName)
                .build();

        List<String> result = new ArrayList<>();
        result.add(0, multipartFile.getOriginalFilename());
        result.add(1, s3Client.utilities().getUrl(getUrlRequest).toString());

        return result;
    }

    public String getFileName(MultipartFile multipartFile) {
        if(multipartFile.isEmpty()) return "";

        System.out.println(CommonUtils.buildFileName(multipartFile.getOriginalFilename()));

        return CommonUtils.buildFileName(multipartFile.getOriginalFilename());
    }
}