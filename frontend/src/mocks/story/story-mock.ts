type Story = {
    id: number;
    event_id: number;
    user_id: string; // BINARY(16) 데이터를 문자열로 표현
    title: string;
    content: string;
    create_at: string; // DATETIME(6)을 문자열로 표현
    updated_at: string; // DATETIME(6)을 문자열로 표현
    image: string;
  };
  
  const mockData: Story[] = [
    {
      id: 1,
      event_id: 1001,
      user_id: "a1b2c3d4e5f678901234567890abcdef",
      title: "대학 졸업",
      content: "대학을 졸업하고 세상에 나서면서 첫 발을 내딛는 그 떨림을 잊을 수 없습니다. 앞으로의 길이 험난할 거란 생각이 들었지만, 그때의 자신감을 간직하며 살아왔습니다.",
      create_at: "2000-03-01T10:00:00.000000",
      updated_at: "2025-01-28T10:00:00.000000",
      image: "graduation.jpg"
    },
    {
      id: 2,
      event_id: 1002,
      user_id: "a1b2c3d4e5f678901234567890abcdef",
      title: "첫 취직",
      content: "첫 직장에 취직했을 때는 정말 기뻤습니다. 하지만 막상 일에 뛰어들자 쉽지 않은 현실에 부딪혔습니다. 그래도 그때의 열정이 제 커리어의 시작이었죠.",
      create_at: "2005-06-15T09:00:00.000000",
      updated_at: "2025-01-28T10:00:00.000000",
      image: "first_job.jpg"
    },
    {
      id: 3,
      event_id: 1003,
      user_id: "a1b2c3d4e5f678901234567890abcdef",
      title: "결혼식",
      content: "결혼식을 준비하면서 행복함과 두려움이 공존했던 기억이 납니다. 서로를 믿고 함께할 것을 다짐하며 결혼식을 올렸고, 그 날을 계기로 우리의 인생이 바뀌었습니다.",
      create_at: "2010-07-20T14:00:00.000000",
      updated_at: "2025-01-28T10:00:00.000000",
      image: "wedding.jpg"
    },
    {
      id: 4,
      event_id: 1004,
      user_id: "a1b2c3d4e5f678901234567890abcdef",
      title: "첫 아이의 탄생",
      content: "내 손에 아기를 안았을 때의 그 감정은 말로 표현할 수 없었습니다. 새로운 생명의 시작을 함께 하며, 부모로서의 책임감을 느꼈던 순간입니다.",
      create_at: "2015-05-25T16:00:00.000000",
      updated_at: "2025-01-28T10:00:00.000000",
      image: "first_child.jpg"
    },
    {
      id: 5,
      event_id: 1005,
      user_id: "a1b2c3d4e5f678901234567890abcdef",
      title: "회사에서의 첫 승진",
      content: "열심히 일한 결과로 승진이 결정되었을 때는 정말 기뻤습니다. 그동안의 노력이 인정받는 순간이었고, 더 큰 책임감을 느꼈던 중요한 시기였습니다.",
      create_at: "2018-11-10T13:00:00.000000",
      updated_at: "2025-01-28T10:00:00.000000",
      image: "promotion.jpg"
    },
    {
      id: 6,
      event_id: 1006,
      user_id: "a1b2c3d4e5f678901234567890abcdef",
      title: "부모님과의 마지막 여행",
      content: "부모님과 함께 떠난 마지막 여행은 제게 큰 의미가 있었습니다. 그때의 대화와 함께한 시간들이 아직도 제 마음 속에 선명하게 남아 있습니다.",
      create_at: "2020-03-30T11:00:00.000000",
      updated_at: "2025-01-28T10:00:00.000000",
      image: "last_trip_with_parents.jpg"
    },
    {
      id: 7,
      event_id: 1007,
      user_id: "a1b2c3d4e5f678901234567890abcdef",
      title: "이직을 결심한 순간",
      content: "새로운 도전을 위해 이직을 결심했던 순간이 아직도 생생하게 기억납니다. 그때의 불안감과 기대감이 어우러져 새로운 출발을 할 수 있었습니다.",
      create_at: "2022-01-05T09:00:00.000000",
      updated_at: "2025-01-28T10:00:00.000000",
      image: "career_change.jpg"
    },
    {
      id: 8,
      event_id: 1008,
      user_id: "a1b2c3d4e5f678901234567890abcdef",
      title: "퇴직",
      content: "30년 넘게 다닌 직장을 떠나는 날, 정말 많은 감정이 교차했습니다. 그동안의 시간이 어떻게 지나갔는지 실감도 나지 않았지만, 새로운 삶을 시작하려 합니다.",
      create_at: "2024-12-01T10:00:00.000000",
      updated_at: "2025-01-28T10:00:00.000000",
      image: "retirement.jpg"
    },
    {
      id: 9,
      event_id: 1009,
      user_id: "a1b2c3d4e5f678901234567890abcdef",
      title: "첫 해외 여행",
      content: "어릴 적 꿈꾸던 해외 여행을 드디어 떠났을 때, 그 설렘과 기쁨은 이루 말할 수 없었습니다. 새로운 문화와 사람들을 만난 경험은 제 인생에 큰 변화를 가져왔습니다.",
      create_at: "2017-09-12T17:00:00.000000",
      updated_at: "2025-01-28T10:00:00.000000",
      image: "first_trip_abroad.jpg"
    },
    {
      id: 10,
      event_id: 1010,
      user_id: "a1b2c3d4e5f678901234567890abcdef",
      title: "인생의 첫 책 출간",
      content: "오랫동안 준비했던 첫 책을 출간했을 때의 기쁨은 말로 표현할 수 없었습니다. 내가 쓴 책이 세상에 나왔다는 사실이 아직도 믿기지 않습니다.",
      create_at: "2021-04-18T08:00:00.000000",
      updated_at: "2025-01-28T10:00:00.000000",
      image: "first_book.jpg"
    }
  ];
  
  export default mockData;
  