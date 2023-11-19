import {useState, ChangeEvent} from 'react'
import './email.css'

const Email = ({
	handleEmailSubmit,
}: {
	handleEmailSubmit: (email: string) => void
}) => {
	const [email, setEmail] = useState('')

	const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
		setEmail(e.target.value)
	}

	const submitEmail = () => {
		handleEmailSubmit(email)
	}

	return (
		<div className='email-container'>
			<div className='flex flex-col text-center items-center justify-center'>
				<input
					placeholder='Email'
					value={email}
					onChange={handleEmailChange}
					type='email'
					className='border-2 border-gray-300 rounded-md p-2'
				/>

				<button
					className='bg-blue-500 text-white p-2 rounded-md m-2 w-fit disabled:cursor-not-allowed disabled:bg-gray-300 cursor-pointer'
					disabled={!email || email.length === 0}
					onClick={submitEmail}>
					Submit
				</button>
			</div>
		</div>
	)
}

export default Email
