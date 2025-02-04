"use client"

import { useState } from "react"
import { compileBookByAI, compileBookByAIMock, CompiledBook } from "@/lib/api"

export default function AICompile() {
    const prewritten = '나는 1980년 서울의 작은 동네에서 태어났다. 우리 가족은 평범했지만 사랑이 넘치는 가정이었다. 아버지는 회사원이셨고, 어머니는 전업주부로 나와 동생을 돌보셨다. 어린 시절의 기억은 항상 따뜻하고 행복했다. 동네 골목에서 친구들과 숨바꼭질을 하고, 뒷산에 올라가 나무를 타며 놀았던 기억이 아직도 생생하다. 특히 여름이면 동네 어르신들이 들려주시는 옛날이야기를 들으며 밤늦게까지 놀았던 것이 가장 즐거운 추억이다. 학교에 들어가기 전, 나는 이미 책 읽기를 좋아했다. 어머니께서 매일 밤 읽어주시던 동화책들이 나의 상상력을 키워주었고, 이는 후에 내가 작가의 꿈을 꾸게 된 원동력이 되었다. 중학교에 입학하면서 새로운 친구들과 선생님들을 만나며 세상을 바라보는 시각이 넓어졌다. 이 시기에 나는 문학에 대한 열정을 발견했고, 교내 문예대회에서 첫 상을 받았다. 고등학교 시절은 더욱 치열했다. 대학 입시를 준비하면서도 나의 꿈을 포기하지 않았다. 야간 자율학습이 끝난 후 틈틈이 소설을 쓰곤 했다. 졸업할 무렵, 내가 쓴 단편소설이 청소년 문학상을 수상하게 되었고, 이는 나에게 큰 자신감을 주었다. 이 시기의 가장 큰 도전은 학업과 꿈 사이에서의 균형을 잡는 것이었다. 부모님은 안정적인 직업을 원하셨지만, 나의 열정을 이해해 주셨다. 그들의 지지 덕분에 나는 문예창작과에 진학할 수 있었다. 대학에 입학한 후, 나는 내 인생의 방향을 찾기 위해 많은 고민을 했다. 다양한 장르의 문학 작품을 접하고, 창작 기법을 배우며 나만의 스타일을 찾아갔다. 이 시기에 나는 처음으로 장편소설을 써보기로 결심했다. 1년이 넘는 시간 동안 밤낮으로 글을 썼고, 수없이 고치고 또 고쳤다. 결과적으로 이 소설은 신인 문학상 후보에 오르게 되었다. 비록 수상하지는 못했지만, 이 경험은 나에게 큰 배움의 기회가 되었다. 대학 3학년 때, 나는 교환학생 프로그램을 통해 1년간 프랑스에서 공부할 기회를 얻었다. 이국적인 환경에서 새로운 문화와 사람들을 만나며, 나의 문학적 시야는 더욱 넓어졌다. 파리의 카페에서 글을 쓰며 보낸 시간들은 내 인생에서 가장 풍요로운 순간들이었다. 40대에 접어들면서 나는 새로운 도전을 시작했다. 지금까지 현대 소설만 써왔다면, 이제는 역사 소설에 도전해보기로 했다. 1년간의 자료 조사와 준비 끝에 첫 역사 소설을 출간했고, 이는 예상 외로 큰 성공을 거두었다. 이 성공을 계기로 나는 다양한 장르의 글쓰기에 도전하게 되었다. 에세이, 여행기, 심지어는 아동문학까지 시도해보았다. 이 과정에서 나는 작가로서 더욱 성장할 수 있었고, 독자층도 넓어졌다. 또한 이 시기에 나는 후배 작가들을 위한 멘토링 프로그램에 참여하기 시작했다. 내 경험을 나누고 그들의 성장을 돕는 과정에서, 나 역시 많은 것을 배우고 성장할 수 있었다. 이를 통해 작가로서뿐만 아니라 인간적으로도 더욱 성숙해질 수 있었다.'
    const [req, setReq] = useState<string>(prewritten);
    const [loading, setLoading] = useState<string>("아직 로딩 전..");
    const [res, setRes] = useState<CompiledBook>();

    const handleSend = async () => {
        try{
            setLoading("API 요청 완료, response 대기 중..");
            const result : CompiledBook = await compileBookByAI(req);

            setRes(result);
            setLoading("response 받기 완료!");
        }catch(error){
            console.error(error);
            setLoading("에러..");
        }
    }

    const handleMockSend = () => {
        setLoading("API 요청 완료, response 대기 중..");
        const result : CompiledBook = compileBookByAIMock(req);

        setRes(result);
        setLoading("response 받기 완료!");
    }

    return (
        <div>
            <h1>봄날의 서 AI 엮기 기능 테스트</h1>
            <h1>{loading}</h1>
            <label>글조각 합친 내용 입력 : </label>
            <input value={req} onChange={(e) => (setReq(e.target.value))}></input>
            <button onClick={handleSend}>입력</button>
            {res && (<div>
                <h1>봄날의 서 제목 : {res.title}</h1>
                {res.chapters.map((chapter) => (<div key={chapter.chapterTitle}>
                    <h2>{chapter.chapterTitle}</h2>
                    <h5>{chapter.content}</h5>
                </div>))}
            </div>)}
        </div>
    )
}