import { Controller, type Control } from 'react-hook-form'
import BulletTextArea from '@/components/common/BulletTextArea'
import type { ProfileFormDataType } from '@/utils/schemas/profileSchema'

interface ISection02CoreCompetency {
	control: Control<ProfileFormDataType>
}

const Section02CoreCompetency = ({ control }: ISection02CoreCompetency) => {
	return (
		<Controller
			name='coreCompetency'
			control={control}
			render={({ field }) => (
				<div>
					<BulletTextArea
						value={field.value}
						onChange={field.onChange}
						sectionTitle='핵심역량'
						hasStar={true}
						placeholder={`직무와 연관된 자신의 핵심 역량을 간단하게 적어주세요\n5줄 이내를 권장 드립니다.\nex. 사용자 경험을 기반으로 한 UX 전략 도출 및 서비스 프로토타입 설계 가능`}
					/>
				</div>
			)}
		/>
	)
}

export default Section02CoreCompetency
