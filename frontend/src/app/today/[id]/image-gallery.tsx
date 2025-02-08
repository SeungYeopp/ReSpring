"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { Dialog, DialogContent, DialogClose, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useSwipeable } from "react-swipeable";

interface Image {
  imageId: number;
  imageUrl: string;
}

interface ImageGalleryProps {
  images: Image[];
}

export function ImageGallery({ images }: ImageGalleryProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);

  const openGallery = (index: number) => {
    setCurrentImageIndex(index);
    setIsOpen(true);
  };

  const nextImage = useCallback(() => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  }, [images.length]);

  const prevImage = useCallback(() => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  }, [images.length]);

  const handlers = useSwipeable({
    onSwipedLeft: nextImage,
    onSwipedRight: prevImage,
    trackMouse: true,
    trackTouch: true,
    delta: 10,
    swipeDuration: 500,
    onSwiping: () => setIsSwiping(true),
    onSwiped: () => setIsSwiping(false),
  });

  return (
    <>
      <div className="flex gap-1 overflow-x-auto -mx-4 px-4 mt-3">
        {images.slice(0, 3).map((image, index) => (
          <div key={image.imageId} className="relative w-24 h-24 flex-shrink-0">
            <Image src={image.imageUrl || "/placeholder.svg"} alt={`게시글 이미지 ${index + 1}`} fill className="rounded-md object-cover cursor-pointer" onClick={() => openGallery(index)} />
            {index === 2 && images.length > 3 && (
              <div className="absolute inset-0 bg-black/60 rounded-md flex items-center justify-center text-white text-sm font-bold cursor-pointer" onClick={() => openGallery(2)}>
                +{images.length - 3}
              </div>
            )}
          </div>
        ))}
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-[90vw] max-h-[90vh] w-full h-full p-0 flex flex-col items-center justify-center bg-black">
          <DialogTitle className="text-white text-xl font-bold pt-4">이미지 갤러리</DialogTitle>
          <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground z-10">
            <X className="h-6 w-6 text-white" />
            <span className="sr-only">Close</span>
          </DialogClose>
          <div className="relative w-full h-full flex-1 touch-pan-y" {...handlers}>
            <div className={`absolute inset-0 flex items-center justify-center transition-transform duration-300 ease-in-out ${isSwiping ? "scale-95" : "scale-100"}`}>
              <Image src={images[currentImageIndex].imageUrl || "/placeholder.svg"} alt={`게시글 이미지 ${currentImageIndex + 1}`} fill className="object-contain" />
            </div>
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/60 text-white px-3 py-1 rounded-full">
              {currentImageIndex + 1} / {images.length}
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10"
              onClick={(e) => {
                e.stopPropagation();
                prevImage();
              }}
            >
              <ChevronLeft className="h-6 w-6 text-white" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10"
              onClick={(e) => {
                e.stopPropagation();
                nextImage();
              }}
            >
              <ChevronRight className="h-6 w-6 text-white" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
