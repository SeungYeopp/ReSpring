interface KakaoLoginButtonProps {
  onClick?: () => void
}

export function KakaoLoginButton({ onClick }: KakaoLoginButtonProps) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center justify-center gap-2 rounded-md bg-[#FEE500] px-4 py-3 text-sm font-medium text-[#000000] shadow-sm hover:bg-[#FEE500]/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FEE500]"
    >
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 3C6.477 3 2 6.477 2 11c0 2.97 1.988 5.523 4.804 6.477-.16.71-.732 2.578-.84 2.977-.133.487.18.485.37.353.153-.105 2.422-1.65 3.405-2.32.73.108 1.483.165 2.261.165 5.523 0 10-3.477 10-8s-4.477-8-10-8z" />
      </svg>
      카카오 로그인
    </button>
  )
}

