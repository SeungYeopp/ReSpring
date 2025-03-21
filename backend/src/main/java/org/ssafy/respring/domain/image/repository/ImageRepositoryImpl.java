package org.ssafy.respring.domain.image.repository;

import com.querydsl.jpa.impl.JPAQueryFactory;
import jakarta.persistence.EntityManager;
import org.springframework.stereotype.Repository;
import org.ssafy.respring.domain.image.vo.Image;
import org.ssafy.respring.domain.image.vo.ImageType;
import org.ssafy.respring.domain.image.vo.QImage;

import java.util.List;

@Repository
public class ImageRepositoryImpl implements ImageRepositoryQuerydsl {
    private final JPAQueryFactory queryFactory;

    public ImageRepositoryImpl(EntityManager em) {
        this.queryFactory = new JPAQueryFactory(em);
    }

    QImage image = new QImage("i");

    @Override
    public List<Image> findImagesByTypeAndEntityId(String imageType, Long entityId) {
        return queryFactory.selectFrom(image)
                .where(
                        image.imageType.eq(ImageType.valueOf(imageType)),
                        image.entityId.eq(entityId)
                )
                .fetch();
    }
}