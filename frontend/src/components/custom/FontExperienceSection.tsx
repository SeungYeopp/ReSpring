"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Slider } from "../ui/slider"
import { TypeIcon as TypeOutline } from "lucide-react"

const fonts = [
  { name: "고도 B", class: "font-godob" },
  { name: "고도 M", class: "font-godom" },
  { name: "고도 마음체", class: "font-godomaum" },
  { name: "누누 기본 고딕체", class: "font-nunugothic" },
  { name: "삼립호빵 베이직", class: "font-samlipbasic" },
  { name: "삼립호빵 아웃라인", class: "font-samlipoutline" },
  { name: "온글잎 박다현체", class: "font-ongle" },
  { name: "빙그레 타옴", class: "font-binggraetaom" },
  { name: "빙그레 타옴 볼드", class: "font-binggraetaombold" },
  { name: "마포 백패킹", class: "font-mapobackpacking" },
  { name: "굿네이버스 좋은이웃체 Bold", class: "font-goodneighborsbold" },
  { name: "굿네이버스 좋은이웃체 Regular", class: "font-goodneighborsregular" },
  { name: "런드리고딕 Bold", class: "font-laundrygothicbold" },
  { name: "런드리고딕 Regular", class: "font-laundrygothicregular" },
  { name: "한돈 삼겹살체 300g", class: "font-handon300" },
  { name: "한돈 삼겹살체 600g", class: "font-handon600" },
]

export function FontExperienceSection() {
  const [text, setText] = useState("봄날의 향기를 느껴보세요")
  const [fontSize, setFontSize] = useState(24)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.8 }}
    >
      <Card className="rounded-3xl shadow-lg p-6 bg-white border-2 border-[#dfeaa5] mt-10">
        <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-[#638d3e] text-center flex items-center justify-center">
          <TypeOutline className="mr-2" size={28} /> 폰트 체험하기
        </h2>
        <p className="text-center text-[#7b7878] mb-6">추가한 폰트들을 직접 체험해보세요!</p>

        <div className="mb-6">
          <Input
            type="text"
            placeholder="텍스트를 입력하세요"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full mb-4"
          />
          <div className="flex items-center">
            <span className="mr-4">폰트 크기: {fontSize}px</span>
            <Slider
              value={[fontSize]}
              onValueChange={(value) => setFontSize(value[0])}
              max={48}
              min={12}
              step={1}
              className="w-64"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {fonts.map((font, index) => (
            <motion.div
              key={font.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="p-4 hover:shadow-md transition-shadow">
                <h3 className="text-lg font-semibold mb-2 text-[#4a6d2e]">{font.name}</h3>
                <p className={`${font.class} text-[#4a6d2e] break-words`} style={{ fontSize: `${fontSize}px` }}>
                  {text}
                </p>
              </Card>
            </motion.div>
          ))}
        </div>
      </Card>
    </motion.div>
  )
}

