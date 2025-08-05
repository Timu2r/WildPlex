import { useCallback, useEffect, useState } from 'react'
import '../styles/PurchaseModal.css'
import '../styles/CurrencyPurchaseModal.css'
import { players } from '../serverDatabase.js'
import { MdOutlineErrorOutline } from 'react-icons/md'

const currencyImages = import.meta.glob('../assets/*.{png,jpg,jpeg}', {
	eager: true,
})

const CurrencyPurchaseModal = ({
	selectedItem,
	selectedQuantity,
	setSelectedQuantity,
	nickname,
	setNickname,
	email,
	setEmail,
	handlePurchase,
	setShowModal,
	currencies,
	calculatePrice,
}) => {
	const [isLandscape, setIsLandscape] = useState(window.innerWidth > 1024)
	const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)
	const [nicknameError, setNicknameError] = useState('')

	const validateNickname = useCallback(name => {
		const player = players.find(
			p => p.nickname.toLowerCase() === name.toLowerCase()
		)
		if (!name) {
			setNicknameError('')
		} else if (!player) {
			setNicknameError('Такого игрока не существует')
		} else {
			setNicknameError('')
		}
	}, [])

	useEffect(() => {
		if (nickname.trim() !== '') {
			validateNickname(nickname)
		} else {
			setNicknameError('')
		}
	}, [nickname, validateNickname, setNicknameError])

	const handleResize = useCallback(() => {
		setIsLandscape(window.innerWidth > 1024)
		setIsMobile(window.innerWidth <= 768)
	}, [])

	useEffect(() => {
		window.addEventListener('resize', handleResize)
		return () => window.removeEventListener('resize', handleResize)
	}, [handleResize])

	useEffect(() => {
		const handleEscKey = event => {
			if (event.key === 'Escape') {
				setShowModal(false)
			}
		}

		document.addEventListener('keydown', handleEscKey)
		return () => document.removeEventListener('keydown', handleEscKey)
	}, [setShowModal])

	const handleOverlayClick = useCallback(
		e => {
			if (e.target === e.currentTarget) {
				setShowModal(false)
			}
		},
		[setShowModal]
	)

	useEffect(() => {
		document.body.style.overflow = 'hidden'
		return () => {
			document.body.style.overflow = 'unset'
		}
	}, [])

	const handleFormKeyDown = useCallback(
		e => {
			if (e.key === 'Enter' && nickname && email && selectedQuantity) {
				e.preventDefault()
				validateNickname(nickname)
				if (!nicknameError) {
					handlePurchase()
				}
			}
		},
		[
			nickname,
			email,
			selectedQuantity,
			handlePurchase,
			validateNickname,
			nicknameError,
		]
	)

	const handlePurchaseClick = useCallback(() => {
		validateNickname(nickname)
		if (!nicknameError) {
			handlePurchase()
		}
	}, [nickname, handlePurchase, validateNickname, nicknameError])

	const item = currencies.find(c => c.id === selectedItem)

	if (!item) return null

	const finalPrice =
		(parseInt(selectedQuantity) || 0) * (item.quantities[0].price || 0)

	return (
		<div
			className='modal-overlay'
			onClick={handleOverlayClick}
			role='dialog'
			aria-modal='true'
			aria-labelledby='modal-title'
		>
			<div
				className={`modal-content ${isLandscape ? 'landscape' : ''}`}
				onKeyDown={handleFormKeyDown}
			>
				<div className='modal-header'>
					<h2 id='modal-title' className='modal-title'>
						Подтверждение покупки
					</h2>
					<button
						onClick={() => setShowModal(false)}
						className='modal-close-button'
						aria-label='Закрыть модальное окно'
						type='button'
					>
						✕
					</button>
				</div>
				<div className={`${isLandscape ? 'body-landscape' : ''}`}>
					<div className={`${isLandscape ? 'left-section-landscape' : ''}`}>
						<div className='modal-currency-info'>
							<img
								src={currencyImages[`../assets/${item.image}`]?.default}
								alt={item.name}
								className='modal-currency-image'
								loading='lazy'
							/>
							<div className='modal-currency-details'>
								<h3 className='modal-currency-name'>{item.name}</h3>
								<p className='modal-currency-rate'>
									1 {item.name.toLowerCase()} = {item.quantities[0].price} ₽
								</p>
							</div>
						</div>

						<div className='nickname-input-container'>
							<label htmlFor='nickname-input' className='nickname-label'>
								Никнейм:
							</label>
							<input
								id='nickname-input'
								type='text'
								value={nickname}
								onChange={e => setNickname(e.target.value)}
								placeholder='Введите никнейм игрока'
								className={`nickname-input ${
									nicknameError ? 'input-error' : ''
								}`}
								required
								autoComplete='username'
								maxLength='32'
							/>
							{nicknameError && (
								<p className='error-message'>
									<MdOutlineErrorOutline className='error-icon' size={15} />{' '}
									{nicknameError}
								</p>
							)}

							<label htmlFor='email-input' className='nickname-label'>
								Электронная почта:
							</label>
							<input
								id='email-input'
								type='email'
								value={email}
								onChange={e => setEmail(e.target.value)}
								placeholder='Введите электронную почту'
								className='nickname-input'
								required
								autoComplete='email'
							/>
						</div>
					</div>

					<div className={`${isLandscape ? 'right-section-landscape' : ''}`}>
						<div className='quantity-section'>
							<h4 className='section-title'>Количество для покупки</h4>

							<div className='custom-quantity'>
								<label htmlFor='custom-amount-input' className='quantity-label'>
									Количество {item.name.toLowerCase()}:
								</label>
								<input
									id='custom-amount-input'
									type='number'
									value={selectedQuantity}
									onChange={e => setSelectedQuantity(e.target.value)}
									placeholder='Введите количество'
									className='custom-amount-input'
									min='1'
									required
								/>
							</div>

							<div className='price-summary'>
								<div className='price-row'>
									<span>Количество:</span>
									<span>
										{selectedQuantity || 0} {item.name.toLowerCase()}
									</span>
								</div>
								<div className='price-row'>
									<span>Цена за единицу:</span>
									<span>{item.quantities[0].price} ₽</span>
								</div>
								<div className='price-row total'>
									<span>Итого к оплате:</span>
									<span>{finalPrice} ₽</span>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className='money-calculator-bottom'>
					<button
						onClick={handlePurchaseClick}
						className='purchase-button'
						disabled={
							!nickname?.trim() ||
							!email?.trim() ||
							!selectedQuantity ||
							parseInt(selectedQuantity) <= 0 ||
							nicknameError
						}
						type='button'
						aria-label={`Продолжить покупку ${selectedQuantity} ${item.name.toLowerCase()} за ${finalPrice} рублей`}
					>
						{nicknameError
							? nicknameError
							: !nickname?.trim() || !email?.trim()
							? 'Заполните все поля'
							: !selectedQuantity || parseInt(selectedQuantity) <= 0
							? 'Введите количество'
							: `Купить ${selectedQuantity} ${item.name.toLowerCase()} (${finalPrice} ₽)`}
					</button>
				</div>{' '}
			</div>
		</div>
	)
}

export default CurrencyPurchaseModal
