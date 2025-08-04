import React, { useEffect, useState, useCallback } from 'react'
import '../styles/PurchaseModal.css'

const privilegeImages = import.meta.glob('../assets/*.{png,jpg,jpeg}', {
	eager: true,
})

const CasePurchaseModal = ({
	selectedItem,
	selectedQuantity,
	setSelectedQuantity,
	nickname,
	setNickname,
	email,
	setEmail,
	handlePurchase,
	setShowModal,
	cases,
	calculatePrice,
}) => {
	const [isLandscape, setIsLandscape] = useState(window.innerWidth > 1024)
	const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)

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

	const handleQuantityKeyDown = useCallback(
		(e, quantityId) => {
			if (e.key === 'Enter' || e.key === ' ') {
				e.preventDefault()
				setSelectedQuantity(quantityId)
			}
		},
		[setSelectedQuantity]
	)

	const handleFormKeyDown = useCallback(
		e => {
			if (e.key === 'Enter' && nickname && email) {
				e.preventDefault()
				handlePurchase()
			}
		},
		[nickname, email, handlePurchase]
	)

	const item = cases.find(c => c.id === selectedItem)

	if (!item) return null

	const selectedQuantityData = item.quantities.find(
		q => q.id === selectedQuantity
	)

	const finalPrice = selectedQuantityData
		? calculatePrice(item, selectedQuantityData.id, 'case')
		: 0

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

				<div className={`${isLandscape ? 'modal-body-landscape' : ''}`}>
					<div
						className={`${isLandscape ? 'modal-left-section-landscape' : ''}`}
					>
						<div className='modal-privilege-info'>
							<img
								src={privilegeImages[`../assets/${item.image}`]?.default}
								alt={item.name}
								className='modal-privilege-image'
								loading='lazy'
							/>
							<div>
								<h3 className='modal-privilege-name'>{item.name}</h3>
								<p className='modal-privilege-duration'>
									{item.name.match(
										/\d+\s*(ДОНАТ|КЕЙСА|КЕЙСОВ|МОНЕТАМИ|ТИТУЛАМИ|ПЛЕКСИКИ)/
									)?.[0] || ''}
								</p>
							</div>
						</div>

						<div className='modal-nickname-input-container'>
							<label htmlFor='nickname-input' className='modal-nickname-label'>
								Никнейм:
							</label>
							<input
								id='nickname-input'
								type='text'
								value={nickname}
								onChange={e => setNickname(e.target.value)}
								placeholder='Введите никнейм игрока'
								className='modal-nickname-input'
								required
								autoComplete='username'
								maxLength='32'
							/>

							<label htmlFor='email-input' className='modal-nickname-label'>
								Электронная почта:
							</label>
							<input
								id='email-input'
								type='email'
								value={email}
								onChange={e => setEmail(e.target.value)}
								placeholder='Введите электронную почту'
								className='modal-nickname-input'
								required
								autoComplete='email'
							/>
						</div>
					</div>

					<div
						className={`${isLandscape ? 'modal-right-section-landscape' : ''}`}
					>
						<div
							className='modal-duration-options'
							role='radiogroup'
							aria-label='Выберите количество'
						>
							{item.quantities.map(quantity => {
								const price = calculatePrice(item, quantity.id, 'case')
								const isSelected = selectedQuantity === quantity.id

								return (
									<div
										key={quantity.id}
										onClick={() => setSelectedQuantity(quantity.id)}
										onKeyDown={e => handleQuantityKeyDown(e, quantity.id)}
										className={`modal-duration-option ${
											isSelected ? 'selected' : ''
										}`}
										role='radio'
										aria-checked={isSelected}
										tabIndex={0}
										aria-label={`${quantity.label}, ${price} рублей`}
									>
										<div className='modal-duration-details'>
											<div>
												<p className='modal-duration-label'>{quantity.label}</p>
											</div>
											<div className='text-right'>
												<p className='modal-duration-price'>{price} ₽</p>
											</div>
										</div>
									</div>
								)
							})}
						</div>
					</div>
				</div>

				<div className='modal-commands-container'>
					<div className='modal-commands-title'>Особенности:</div>
					<ul className='modal-commands-list scrollable-list'>
						{item.features.map((feature, index) => (
							<li key={index}>{feature}</li>
						))}
					</ul>

					<div className='modal-commands-title'>Дополнительно:</div>
					<ul className='modal-commands-list scrollable-list'>
						{item.additionalFeatures.map((feature, index) => (
							<li key={index}>{feature}</li>
						))}
					</ul>
				</div>

				<button
					onClick={handlePurchase}
					className='modal-purchase-button'
					disabled={!nickname?.trim() || !email?.trim() || !selectedQuantity}
					type='button'
					aria-label={`Продолжить покупку ${item.name} за ${finalPrice} рублей`}
				>
					{!nickname?.trim() || !email?.trim()
						? 'Заполните все поля'
						: !selectedQuantity
						? 'Выберите количество'
						: `Купить (${finalPrice} ₽)`}
				</button>
			</div>
		</div>
	)
}

export default CasePurchaseModal
