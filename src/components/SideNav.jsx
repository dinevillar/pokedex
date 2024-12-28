import { useState } from 'react'
import { first151Pokemon, getFullPokedexNumber } from '../utils'

export default function SideNav(props) {
    const { selectedPokemon, setSelectedPokemon, handleCloseMenu, showSideMenu } = props
    const [searchValue, setSearchValue] = useState('')
    const filteredPokemon = first151Pokemon.filter((ele, eleIndex) => {
        return getFullPokedexNumber(eleIndex).includes(searchValue) || 
            ele.toLowerCase().includes(searchValue.toLowerCase())
    })

    return (
        <nav className={(!showSideMenu ? 'open' : '')}>
            <div className={'header ' + (!showSideMenu ? 'open' : '')}>
                <button className="open-nav-button" onClick={handleCloseMenu}>
                    <i className="fa-solid fa-arrow-left-long"></i>
                </button>
                <h1 className="text-gradient">Pokédex</h1>
            </div>
            <input value={searchValue} placeholder="001 or <pokemon name>..." onChange={(e) => {
                setSearchValue(e.target.value)
            }}/>
            {filteredPokemon.map((pokemon, ix) => {
                const pokemonIndex = first151Pokemon.findIndex(v => v === pokemon)
                return (
                    <button onClick={() => {setSelectedPokemon(pokemonIndex); handleCloseMenu()}} key={ix} className={'nav-card ' + (pokemonIndex === selectedPokemon ? 'nav-card-selected' : '')}>
                        <p>{getFullPokedexNumber(pokemonIndex)}</p>
                        <p>{pokemon}</p>
                    </button>
                )
            })}
        </nav>
    )
}