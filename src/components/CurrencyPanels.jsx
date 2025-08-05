import React, { useState, useCallback, useEffect } from 'react'
import '../styles/CurrencyPanels.css'
import { currencies as currencyData } from '../data.js'
import plexici from '../assets/plexici.png'
import money from '../assets/money.png'

const currencyImages = import.meta.glob(
	['../assets/*.png', '../assets/*.jpeg'],
	{ eager: true }
)

const CurrencyPanels = ({
	setSelectedItem,
	setItemType,
	setShowModal,
	setSelectedQuantity,
}) => {
	const [activePanel, setActivePanel] = useState('plexiki') // Default to plexiki
	const [currencyAmount, setCurrencyAmount] = useState('')
	const [rubleAmount, setRubleAmount] = useState('')
	const [lastChanged, setLastChanged] = useState('currency') // Track which input was last changed
	const [isLandscape, setIsLandscape] = useState(window.innerWidth > 1024)

	const handleResize = useCallback(() => {
		setIsLandscape(window.innerWidth > 1024)
	}, [])

	useEffect(() => {
		window.addEventListener('resize', handleResize)
		return () => window.removeEventListener('resize', handleResize)
	}, [handleResize])

	const currentCurrency = currencyData.find(c => c.id === activePanel)

	const calculateFromCurrency = useCallback(() => {
		if (!currentCurrency || !currencyAmount || currencyAmount <= 0) {
			setRubleAmount('')
			return
		}
		const unitPrice = currentCurrency.quantities[0].price // 10 for sapphires, 1 for coins
		setRubleAmount(currencyAmount * unitPrice)
	}, [currencyAmount, currentCurrency])

	const calculateFromRubles = useCallback(() => {
		if (!currentCurrency || !rubleAmount || rubleAmount <= 0) {
			setCurrencyAmount('')
			return
		}
		const unitPrice = currentCurrency.quantities[0].price // 10 for sapphires, 1 for coins
		setCurrencyAmount(Math.floor(rubleAmount / unitPrice))
	}, [rubleAmount, currentCurrency])

	useEffect(() => {
		if (lastChanged === 'currency') {
			calculateFromCurrency()
		} else if (lastChanged === 'rubles') {
			calculateFromRubles()
		}
	}, [calculateFromCurrency, calculateFromRubles, lastChanged])

	// Reset values when switching currencies
	useEffect(() => {
		setCurrencyAmount('')
		setRubleAmount('')
	}, [activePanel])

	const handleCurrencyAmountChange = e => {
		const value = e.target.value
		setCurrencyAmount(value)
		setLastChanged('currency')
	}

	const handleRubleAmountChange = e => {
		const value = e.target.value
		setRubleAmount(value)
		setLastChanged('rubles')
	}

	const handlePurchaseClick = () => {
		if (!currencyAmount || currencyAmount <= 0) {
			alert('Пожалуйста, введите корректное количество для покупки.')
			return
		}
		setSelectedItem(currentCurrency.id)
		setItemType('currency')
		setSelectedQuantity(currencyAmount.toString()) // Pass input currency amount as string
		setShowModal(true)
	}

	if (!currentCurrency) return null // Should not happen with default state

	return (
		<div className='money-purchase-container'>
			<div className='money-tabs'>
				<button
					className={`tab-button ${activePanel === 'plexiki' ? 'active' : ''}`}
					onClick={() => setActivePanel('plexiki')}
				>
					Плексики
				</button>
				<button
					className={`tab-button ${activePanel === 'coins' ? 'active' : ''}`}
					onClick={() => setActivePanel('coins')}
				>
					Монеты
				</button>
			</div>

			<div className='money-panel'>
				<div className='money-info'>
					<img
						src={
							currencyImages[`../assets/${currentCurrency.image}`]?.default
						}
						alt={currentCurrency.name}
						className='money-image'
						loading='lazy'
					/>
					<div>
						<h3 className='money-name'>{currentCurrency.name}</h3>
						<p className='money-rate'>
							{currentCurrency.description} ₽
						</p>
					</div>
				</div>

				<div className='calculator-section'>
					<h4 className='calculator-title'>Калькулятор покупки</h4>

					<div className='calculator-panel'>
						<div className='input-group'>
							<label htmlFor='money-input'>
								Количество {currentCurrency.name.toLowerCase()}:
							</label>
							<input
								id='currency-input'
								type='number'
								value={currencyAmount}
								onChange={handleCurrencyAmountChange}
								min='0'
								placeholder='Введите количество'
							/>
						</div>

						<div className='calculator-equals'>=</div>

						<div className='input-group'>
							<label htmlFor='ruble-input'>Сумма в рублях:</label>
							<input
								id='ruble-input'
								type='number'
								value={rubleAmount}
								onChange={handleRubleAmountChange}
								min='0'
								placeholder='Введите сумму'
							/>
						</div>
					</div>
				</div>
				<div className='money-calculator-bottom'>
					<button

					className='purchase-button'
					onClick={handlePurchaseClick}
					disabled={!currencyAmount || currencyAmount <= 0}
				>
					Приобрести ({rubleAmount || 0} ₽)
				</button>
			</div>
			</div>
		</div>
	)
}

export default CurrencyPanels
