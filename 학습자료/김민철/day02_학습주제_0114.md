1. 프로젝트 기획 관련 학습.

요구 사항 분석 (솔루션 : GAP 분석)
-> 실제 서비스를 쓰는 현업들 대상 개발 요구사항 청취.
-> 확인된 요구 사항에 대한 분석 및 정리.
-> 이메일 등을 통해 도출된 요구 사항 공유 및 컨펌.
-> 요구 사항 분석은 가능한 자세하게, 내용 공유 및 확인은 철저하게..

요구사항 정의서는..
요구사항명, 상세 설명, 우선순위, 핵심 기능 유무, 담당자를 기재.

기능 개발 정의 (WBS)
-> 정리된 요구 사항 기반 기능 정의 (3단계 메뉴 레벨 수준 상세하게)
-> 정의된 기능 기반 전체 개발 일정을 상세하게 계획 (WBS 작성)

WBS (Work Breakdown Structure)는..
-> 팀 전체 업무를 효율적으로 관리.
가장 중요한 내용은 일정, 역할 분담, 산출물.

개발자들과 협의, PM이 관리한다.

개발 기능(업무) 리스트업
업무 분배 검토
상세 계획 일정 산정

소규모 개발 조직의 경우,
기능을 분류하고, 담당자 정하고, week 단위로 상태 관리..

기능 정의서는 개발자 관점에서 어떤 기능을 구현할 지 정의.
주요 기능, 분류, 상세 기능, 설명.

프로세스 정리.
-> 정리된 기능에 대해 업무 프로세스 상세 정의.
-> 상세 정리된 프로세스 기반 IA 작성.

Flow Chart.
프로그램의 흐름을 단순화.

IA (Information Architecture)
-> 사용자가 원하는 정보를 쉽게 찾을 수 있게.. 정보 컨텐츠를 구조화.
(유사한 컨텐츠는 연결, 정보 탐색 시간 최소화..)

화면 기획.
사용자 여정 고려 페이지에 내용, 기능 배치.
주로 와이어 프레임 작성.
직접 화면에 대고 그린다.


2. Figma flow chart 작성하는 법.

Figjam -> https://www.figma.com/templates/flow-chart-template/

share 기능 이메일 초대로 작업 중.

동그라미로 시작,
마름모는 분기점,
네모는 화면 하나.

3. React 공부.

- Props

상위 컴포에서 하위 컴포로 어떤 값을 전달해줘야 할 때 Props 사용.

```
function App(){
	return (
		<div>
			<MyComponent value={'test'}/>
		</div>
	)
}

function MyComponent(props){
	return <div>{props.value}</div>;
}
-> 속성 값으로 전달.

function App(){
	return (
		<div>
			<MyComponent>
				<h1>value</h1>
			</MyComponent>
		</div>
	);
}

function MyComponent(props){
	return <div>{props.children}</div>;
}
-> 컴포넌트 감싼 값이 props.children으로 전달된다.


// Heading.js
export default function Heading(props){
	if(props.type === 'h2'){
		return <h2>{props.children}</h2>
	}
	
	return <h1>{props.children}</h1>
}


=> 이 친구를 사용?
import Heading from './components/Heading';

export default function App(){
	return (
		<div>
			<Heading type="h1">Hello!</Heading>
		</div>
	);
}
=> 타입과 태그 내 요소를 적용!
```

- state
```
import {useState} from 'react';

export default function App(){
	const {value, setValue} = useState(0);
	
	return (
		<div>
			<h1>value : {value}</h1>
			<button onClick={() => {
				setValue(value + 1);
			}}
			>Increase Value
			</button>
			<button onClick={() => {
				setValue(0);
			}}
			Reset Value
			</button>
		</div>
	);
}

// onClick을 누를 때마다, App이 다시 렌더링 되는..
```
