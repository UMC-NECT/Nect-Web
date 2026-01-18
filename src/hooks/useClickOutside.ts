import { useEffect, type RefObject } from 'react'

export const useClickOutside = <T extends HTMLElement = HTMLElement>(
	ref: RefObject<T | null>,
	handler: () => void,
	isOpen: boolean
) => {
	useEffect(() => {
		if (!isOpen) return

		const handleClickOutside = (event: MouseEvent) => {
			if (ref.current && !ref.current.contains(event.target as Node)) {
				handler()
			}
		}

		document.addEventListener('mousedown', handleClickOutside)

		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [ref, handler, isOpen])
}
