import React from 'react'
import { Gem, Star, Shield } from 'lucide-react'

const privilegeImages = import.meta.glob(
	['../assets/*.png', '../assets/*.jpeg'],
	{ eager: true }
)

const ShopContent = ({
	activeCategory,
	privileges,
	cases,
	durations,
	selectedDuration,
	setSelectedDuration,
	setSelectedItem,
	setItemType,
	setShowModal,
	calculatePrice,
	nickname,
	setSelectedQuantity,
}) => {
	return (
		<main className='shop-content'>
			<div className='shop-header'>
				<h2 className='shop-title'>Магазин</h2>
			</div>

			{activeCategory === 'privileges' && (
				<>
					<div className='duration-selection'>
						<h3 className='duration-selection-label'>
							Выберите срок действия:
						</h3>
						<div className='duration-buttons'>
							{durations.map(duration => (
								<button
									key={duration.id}
									onClick={() => setSelectedDuration(duration.id)}
									className={`duration-button ${
										selectedDuration === duration.id ? 'active' : ''
									}`}
								>
									{duration.label}
								</button>
							))}
						</div>
					</div>
					<div className='privileges-grid'>
						{privileges.map(privilege => {
							const price = calculatePrice(
								privilege,
								selectedDuration,
								'privilege'
							)
							return (
								<div
									key={privilege.id}
									className={`privilege-card ${privilege.color}`}
								>
									<div className='card-content-wrapper'>
										<img
											src={
												privilegeImages[`../assets/${privilege.image}`].default
											}
											alt='Product Image'
											className='privilege-image'
										/>
										<h3 className='privilege-name'>{privilege.name}</h3>
										<div className='privilege-price'>{price} ₽</div>
										<button
											className='privilege-button'
											onClick={() => {
												setSelectedItem(privilege.id)
												setItemType('privilege')
												setShowModal(true)
											}}
										>
											Купить
										</button>
									</div>
								</div>
							)
						})}
					</div>
				</>
			)}

			{activeCategory === 'cases' && (
				<div className='cases-grid'>
					{cases.map(caseItem => {
						const caseImageClass =
							caseItem.image === 'coin-case'
								? 'case-coin'
								: caseItem.image === 'title-case'
								? 'case-title'
								: 'case-donation'
						const caseIcon =
							caseItem.image === 'coin-case' ? (
								<Gem className='w-8 h-8' />
							) : caseItem.image === 'title-case' ? (
								<Star className='w-8 h-8' />
							) : (
								<Shield className='w-8 h-8' />
							)

						return (
							<div key={caseItem.id} className='case-item'>
								<div className='card-content-wrapper'>
									<div className={`case-item-image ${caseImageClass}`}>
										<img
											src={
												privilegeImages[`../assets/${caseItem.image}`].default
											}
											alt='Case Image'
											className='case-image'
										/>
									</div>
									<h3 className='case-item-name'>{caseItem.name}</h3>
									<div className='case-item-price'>
										{caseItem.quantities[0].price}₽
									</div>
									<button
										className='privilege-button'
										onClick={() => {
											setSelectedItem(caseItem.id)
											setItemType('case')
											setShowModal(true)
										}}
									>
										купить
									</button>
								</div>
							</div>
						)
					})}
				</div>
			)}
			{activeCategory === 'currency' && (
				<div className='placeholder-section'>
					<div className='placeholder-icon'>
						<img
							src={privilegeImages['../assets/ava.jpeg'].default}
							alt='Placeholder Image'
							className='placeholder-image'
						/>
					</div>
					<h3 className='placeholder-title'>Валюты</h3>
					<p className='placeholder-text'>Раздел в разработке</p>
				</div>
			)}
			{activeCategory === 'other' && (
				<div className='placeholder-section'>
					<div className='placeholder-icon'>
						<img
							src={privilegeImages['../assets/ava.jpeg'].default}
							alt='Placeholder Image'
							className='placeholder-image'
						/>
					</div>
					<h3 className='placeholder-title'>Другое</h3>
					<p className='placeholder-text'>Раздел в разработке</p>
				</div>
			)}
		</main>
	)
}

export default ShopContent
