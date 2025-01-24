package org.ssafy.respring.domain.image.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.ssafy.respring.domain.image.vo.Image;

public interface ImageRepository extends JpaRepository<Image, Long>{
}