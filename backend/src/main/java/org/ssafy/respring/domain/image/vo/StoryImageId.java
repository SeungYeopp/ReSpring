package org.ssafy.respring.domain.image.vo;

import java.io.Serializable;
import java.util.Objects;

class StoryImageId implements Serializable {
    private Long id;
    private Long imageId;

    public StoryImageId() {}

    public StoryImageId(Long id, Long imageId) {
        this.id = id;
        this.imageId = imageId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        StoryImageId that = (StoryImageId) o;
        return Objects.equals(id, that.id) && Objects.equals(imageId, that.imageId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, imageId);
    }
}
