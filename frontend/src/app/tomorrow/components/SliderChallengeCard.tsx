import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import type { ReactNode } from "react"

interface SliderChallengeCardProps {
  id: number
  title: string
  description: string | ReactNode
  tags: string[]
  image: string
}

export function SliderChallengeCard({
  id,
  title,
  description,
  tags = [],
  image = "/placeholder.webp",
}: SliderChallengeCardProps) {
  const router = useRouter()

  const handleClick = () => {
    router.push(`/tomorrow/${id}`)
  }

  return (
    <div
      className="bg-white rounded-2xl overflow-hidden w-full shadow-sm hover:shadow-md transition-shadow duration-300"
      onClick={handleClick}
    >
      <div className="flex p-2 xs:p-3 sm:p-4">
        {/* 이미지 섹션 */}
        <div className="w-[80px] xs:w-[100px] sm:w-[120px] mr-2 xs:mr-3 sm:mr-4 flex-shrink-0">
          <div className="relative w-full aspect-square">
            <Image src={image || "/placeholder.svg"} alt={title} fill className="rounded-xl object-cover" />
          </div>
        </div>
        {/* 컨텐츠 섹션 */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* 제목과 설명 */}
          <div className="mb-1 xs:mb-2 sm:mb-3">
            <h3 className="text-sm xs:text-base sm:text-lg font-bold mb-1 sm:mb-2 line-clamp-1">{title}</h3>
            <p className="text-xs sm:text-sm text-gray-600 mb-1 xs:mb-2 sm:mb-3 line-clamp-2">{description}</p>
          </div>
          {/* 태그와 버튼 */}
          <div className="flex items-center justify-between mt-auto">
            {/* 태그 섹션 */}
            <div className="hidden xs:flex gap-1 sm:gap-2 overflow-hidden">
              {tags.slice(0, 1).map((tag, index) => (
                <span
                  key={index}
                  className="px-2 sm:px-3 py-0.5 sm:py-1 bg-gray-100/60 text-gray-600/90 rounded-full text-xs whitespace-nowrap"
                >
                  {tag}
                </span>
              ))}
            </div>
            {/* 버튼 섹션 */}
            <div className="ml-auto">
              {" "}
              {/* 이 div로 버튼을 오른쪽으로 밀어냅니다 */}
              <Button
                variant="default"
                className="bg-[#96b23c] hover:bg-[#638d3e] text-white px-2 sm:px-3 py-1 sm:py-1.5 h-auto rounded-full text-xs sm:text-sm font-medium shadow-sm flex-shrink-0 font-laundrygothicregular"
              >
                {typeof window !== "undefined" && window.innerWidth < 360 ? "보기" : "자세히 보기"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

