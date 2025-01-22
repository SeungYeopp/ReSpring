package org.ssafy.respring.domain.image.vo;

import java.io.Serializable;
import java.util.Objects;

class PostImageId implements Serializable {
    private Long id;
    private Long imageId;

    public PostImageId() {}

    public PostImageId(Long id, Long imageId) {
        this.id = id;
        this.imageId = imageId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        PostImageId that = (PostImageId) o;
        return Objects.equals(id, that.id) && Objects.equals(imageId, that.imageId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, imageId);
    }
}
