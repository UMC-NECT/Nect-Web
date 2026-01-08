import { useEffect, type RefObject } from 'react'

export const useOutsideClick = (ref: RefObject<HTMLElement | null>, handler: () => void) => {
	useEffect(() => {
		const listener = (e: MouseEvent | TouchEvent) => {
			// 내부 클릭시, 무시
			if (!ref.current || ref.current.contains(e.target as Node)) {
				return
			}

			// 외부 클릭시, 핸들러함수 동작
			handler()
		}

		document.addEventListener('mousedown', listener)
		document.addEventListener('touchstart', listener)

		return () => {
			document.addEventListener('mousedown', listener)
			document.addEventListener('touchstart', listener)
		}
	}, [ref, handler])
}
