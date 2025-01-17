# 2025.01.17.FRI : 키워드 추출 Task

> **KeyBert**란? : keyword + bert
- **Embedding**: 대부분의 문서에 가장 가까운 **코사인 거리**를 가진 단어에 더 높은 점수를 부여
    - 거리는 SBERT(Sentence-BERT) 단어 임베딩에서 계산됨

## 서비스 목표와 요구사항
- 한국어 특화: 글이 한국어로 작성되었으므로, 한국어를 잘 이해하는 모델이 필요.
- 일상적이고 가벼운 텍스트: 비전문적이고 일상적인 문맥에서 주요 키워드를 추출해야 하므로, 모델의 언어적 감수성과 문장 임베딩 품질이 중요.
- 정확한 키워드 추출: 문맥을 잘 이해하면서 특정 단어의 중요도를 평가해야 함.
- 효율성: 서비스로 운영할 것이므로, 모델의 크기와 응답 속도도 중요한 고려사항.

KeyBERT를 활용해 한국어로 된 일상적인 글에서 키워드를 추출하려면, 적합한 임베딩 모델을 선택해야한다. 한국어의 특성을 잘 반영하는 모델을 선택해야 정확하고 의미 있는 키워드 추출이 가능하다.

## 임베딩 모델 후보
### 1. **`sentence-transformers/xlm-r-100langs-bert-base-nli-stsb-mean-tokens`**

- **특징**:
    - 멀티링구얼(multi-lingual) 모델로, XLM-RoBERTa 기반.
    - 100개 이상의 언어를 지원하며, 한국어 포함.
    - 한국어 문장의 의미적 유사도를 효과적으로 계산할 수 있음.
- **적합성**:
    - 일상적인 텍스트에서도 다양한 표현의 유사도를 잘 잡아내기 때문에, 키워드와 본문 간의 연관성을 정확히 측정 가능.
    - Hugging Face에서 손쉽게 사용 가능하며 KeyBERT와 통합이 용이.
- **한계**:
    - 멀티링구얼 모델 특성상 한국어 전용 모델보다 약간의 성능 저하 가능.



### 2. **`jhgan/ko-sbert-sts`**

- **특징**:
    - 한국어에 최적화된 SBERT(Sentence-BERT) 모델.
    - 한국어 문장 간 유사도 계산에 특화되어 있음.
- **적합성**:
    - 한국어에 최적화된 모델로, 일상적인 문맥에서 키워드 추출 성능이 우수.
    - 한국어 단어의 문맥적 의미를 잘 반영하여 고품질의 키워드 추출 가능.
- **장점**:
    - 멀티링구얼 모델보다 한국어 특화 작업에서 성능이 우수.
    - Hugging Face 라이브러리와 쉽게 통합 가능.
- **활용 사례**:
    - 한국어 기반 문장 유사도 계산 및 주제어 탐지에 자주 사용됨.



### 3. **`klue/roberta-base`**

- **특징**:
    - 한국어 언어 이해를 위해 설계된 RoBERTa 기반 모델.
    - KLUE(Korean Language Understanding Evaluation) 벤치마크를 기반으로 학습됨.
- **적합성**:
    - 한국어의 복잡한 문법과 표현을 잘 이해.
    - 키워드와 문장 간의 깊은 의미를 연결하는 데 효과적.
- **한계**:
    - Sentence-BERT 기반 모델에 비해 직접적인 문장 임베딩 품질은 다소 낮을 수 있음.
    - 추가 튜닝 없이 사용 시 일상적 표현에서 성능이 제한될 가능성.


### 4. **`ko_sroberta`**

- **특징**:
    - `klue/roberta-base`를 기반으로 한국어 문장 표현력을 강화한 Sentence-RoBERTa(SRoBERTa) 모델.
    - 한국어 문장 임베딩을 위해 학습되었으며, 문장 간 의미적 유사도 계산에 적합.
- **장점**:
    - 한국어 문장의 맥락을 잘 이해하고 유사도를 계산할 수 있음.
    - RoBERTa 아키텍처를 기반으로 안정적인 성능을 제공.
- **단점**:
    - 문장 내 특정 키워드를 추출하기보다는 전체적인 의미를 파악하는 데 중점.
    - 상대적으로 Sentence-BERT(`jhgan/ko-sbert-sts`)보다 키워드 추출에서 미세한 뉘앙스를 놓칠 가능성.

## 가능성 높은 임베딩 모델 후보.  **`jhgan/ko-sbert-sts`** vs **`ko_sroberta`**
| **모델**             | **장점**                                                   | **단점**                                                                                                   | **적합성**                                                                                        |
| -------------------- | ---------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| `ko_sroberta`        | - 문맥 이해도가 높음- 일반적인 한국어 작업에서 우수한 성능 | - 특정 단어의 중요도를 미세하게 추출하는 데는 약간 부족할 수 있음- 키워드 중심보다는 전체 문장 의미에 중점 | - 일상적인 글에서 문장 유사도 계산에는 적합하지만, 키워드 추출에서는 상대적으로 덜 정확할 가능성. |
| `jhgan/ko-sbert-sts` | - 문장 내 키워드 중요도를 잘 반영- 키워드 추출에 특화      | - 특정 도메인 데이터에서는 추가 튜닝이 필요할 수 있음                                                      | - 일상 텍스트 기반 키워드 추출 작업에 가장 적합.                                                  |

- 문맥 중심 작업: ko_sroberta는 문맥과 전체적인 의미를 잘 이해하므로, 키워드 추출보다는 문장 간 유사도 평가나 문맥 기반 태스크에 적합합니다.
- 정확한 키워드 추출: jhgan/ko-sbert-sts는 키워드의 중요도를 잘 계산하며, 특히 특정 단어 중심의 키워드 추출 작업에서 강점을 보입니다.


### 키워드 추출 예제

```python
from keybert import KeyBERT
from sentence_transformers import SentenceTransformer

# ko-sbert-sts 모델 로드
model = SentenceTransformer('jhgan/ko-sbert-sts')

# KeyBERT 초기화
kw_model = KeyBERT(model)

# 키워드 추출
text = "오늘은 날씨가 좋아서 산책을 다녀왔습니다. 기분이 너무 상쾌했어요."
keywords = kw_model.extract_keywords(text, top_n=5, stop_words=['오늘', '다녀왔습니다'])

print("추출된 키워드:", keywords)
```


## 평가지표 RDASS: ROUGE-Score의 한계점 보완
ROUGE-Score의 한계점: Rouge-Score는 단어의 **형태적 유사성 (빈도수)만을 고려**하기 때문에 **의미적 유사성까지 고려하여 평가할 필요**가 있다. 

- 원본 문서(d), 생성 요약문(p), 참조 요약문(r)을 각각 SBERT(Sentence-BERT)에 태워 임베딩
- 이후 추출된 문맥 벡터 Vp 와 Vr의 코사인 유사도를 계산하고, Vp와 Vd의 **코사인 유사도**를 계산하여 두 값의 평균을 사용
    
    ![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/a27beb04-85d1-4fe3-a2b6-2409320418ae/87119d5c-0715-4bab-a5a8-6fe3b886d46d/Untitled.png)
    
> **KR-SBERT 모델을 통해 RDASS 공식 구현**
    
```python
!pip install sentence_transformers

from sentence_transformers import SentenceTransformer, util
from tqdm import tqdm
model = SentenceTransformer('snunlp/KR-SBERT-V40K-klueNLI-augSTS')

idx = 0 
rdass = [] 
for d, r, p in tqdm(zip(df['blog_content'], df['new_tags'], df['tags_kr_sbert'])):
    d_v = model.encode(d)
    r_v = model.encode(r.replace('#',''))
    p_v = model.encode(p.replace('#',''))
    similarities_pr = util.cos_sim(p_v, r_v)
    similarities_pd = util.cos_sim(p_v, d_v)
    rdass.append(float((similarities_pr  + similarities_pd ) / 2))

df['RDASS_kr_sbert_new'] = rdass
```

> ROUGE-Score을 사용하지 않은 이유는?
- ROUGE Score는 문서 요약, 기계 번역 등 모델의 성능을 평가하기 위한 지표로서 사용
- 모델이 생성한 요약문과 참조 요약문에 등장한 토큰(단어) 수에 기반
    
    ![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/a27beb04-85d1-4fe3-a2b6-2409320418ae/3eec12d4-3df9-4215-bec1-836015d911a0/Untitled.png)
    

ROUGE-Score는 **‘형태학적 유사도’만을 고려**하여 겹치는 단어가 많으면 높은 점수를, “의미적 유사도”가 높더라도 겹치는 단어가 적으면 더 낮은 점수를 부여하여 문서의 핵심 내용을 잘 요약할 수 없게 된다. 

한국어는 **단어의 변형**이 많이 일어나고 특히 일기와 같은 **일상어**를 사용할 때에는 표준어만을 사용하지 않기 때문에 의미를 파악하는 것이 더 중요하다는 생각에 ROUGE-Score를 사용하지 않게 되었다.
