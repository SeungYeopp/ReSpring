// Button.tsx
import React from "react";

// 버튼 컴포넌트의 프로퍼티 타입 정의
interface ButtonProps {
  label: string;         // 버튼에 표시될 텍스트
  onClick: () => void;   // 클릭 이벤트 핸들러
  className?: string;    // 추가적인 스타일을 위한 className (선택적)
  disabled?: boolean;    // 버튼 비활성화 여부 (선택적)
}

const Button: React.FC<ButtonProps> = ({ label, onClick, className, disabled }) => {
  return (
    <button
      onClick={onClick}
      className={`btn ${className} ${disabled ? 'disabled' : ''}`}
      disabled={disabled}
    >
      {label}
    </button>
  );
};

export default Button;
