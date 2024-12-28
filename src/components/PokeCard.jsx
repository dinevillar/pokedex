import { useEffect, useState } from 'react'
import { getFullPokedexNumber, getPokedexNumber } from '../utils'
import TypeCard from './TypeCard'
import Modal from './Modal'

export default function PokeCard(props) {
    const { selectedPokemon } = props
    const [ data, setData ] = useState(null)
    const [ loading, setLoading ] = useState(false)
    const [ skill, setSkill ] = useState(null)
    const [ loadingSkill, setLoadingSkill ] = useState(false)

    const { name, height, abilities, stats, types, moves, sprites } = data || {}
    const imgList = Object.keys(sprites || {}).filter((val) => {
        return sprites[val] && !['versions', 'other'].includes(val)
    })

    async function fetchMoveData(move, moveUrl) {
        console.log(move, moveUrl)
        if ( loadingSkill || !localStorage || !moveUrl ) {
            return false
        }

        let cache = {}
        if (localStorage.getItem('pokemon-moves')) {
            cache = JSON.parse(localStorage.getItem('pokemon-moves'))
        }

        if (move in cache) {
            setSkill(cache[move])
            return
        }

        try {
            setLoadingSkill(true)
            const res = await fetch(moveUrl)
            const moveData = await res.json()
            console.log(moveData)
            const description = moveData?.flavor_text_entries.filter(val => {
                return val.version_group_name = 'firered-leafgreen'
            })[0]?.flavor_text
            console.log(description)
            const skillData = {
                name: move,
                description
            }
            setSkill(skillData)
            cache[move] = skillData
            localStorage.setItem('pokemon-moves', JSON.stringify(cache))
        } catch (err) {
            console.log(err)
        } finally {
            setLoadingSkill(false)
        }
    }

    useEffect(() => {
        if (loading || !localStorage) {
            return 
        }

        let cache = {}
        if (localStorage.getItem('pokedex')) {
            cache = JSON.parse(localStorage.getItem('pokedex'))
        }

        if (selectedPokemon in cache) {
            setData(cache[selectedPokemon])
            return
        }

        async function fetchPokemonData() {
            try {
                setLoading(true)
                const baseUrl = 'https://pokeapi.co/api/v2/'
                const suffix = 'pokemon/' + getPokedexNumber(selectedPokemon)
                const finalUrl = baseUrl + suffix
                const res = await fetch(finalUrl)
                const pokemonData = await res.json()
                setData(pokemonData)
                cache[selectedPokemon] = pokemonData
                localStorage.setItem('pokedex', JSON.stringify(cache))
            } catch(err) {
                console.log(err.message)
            } finally {
                setLoading(false)
            }
        }

        fetchPokemonData()
    }, [selectedPokemon])

    if (loading || !data) {
        return (
            <div>
                <h3>loading...</h3>
            </div>
        )
    }

    return (
        <div className="poke-card">
            {skill && (
                <Modal handleCloseModal={() => setSkill(null) }>
                    <div>
                        <h6>Name</h6>
                        <h2 className="skill-name">{skill.name.replaceAll('-', ' ')}</h2>
                    </div>
                    <div>
                        <h6>Description</h6>
                        <p>{skill.description}</p>
                    </div>
                </Modal>
            )}
            <div>
                <h4>#{getFullPokedexNumber(selectedPokemon)}</h4>
                <h2>{name}</h2>
            </div>
            <div className="type-container">
                {types.map((typeObj, typeIndex) => {
                    return (
                        <TypeCard key={typeIndex} type={typeObj?.type?.name} />
                    )
                })}
            </div>
            <img className="default-img" alt={`${name}=large-img`} src={'/pokemon/' + getFullPokedexNumber(selectedPokemon) +'.png'}/>
            <div className="img-container">
                {imgList.map((spriteUrl, spriteIndex) => {
                    const imgUrl = sprites[spriteUrl]
                    return (
                        <img key={spriteIndex} src={imgUrl} alt={`${name}-img-${spriteUrl}`} />
                    )
                })}
            </div>
            <h3>Stats</h3>
            <div className="stats-card">
                {stats.map((statObj, statIndex) => {
                    const {stat, base_stat: baseStat} = statObj
                    return (
                        <div className="stat-item" key={statIndex}>
                            <p>{stat?.name.replaceAll('-', ' ')}</p>
                            <h4>{baseStat}</h4>
                        </div>
                    )
                })}
            </div>
            <h3>Moves</h3>
            <div className="pokemon-move-grid">
                {moves.map((moveObj, moveIndex) => {
                    return (
                        <button className="button-card pokemon-move" key={moveIndex} onClick={() => { fetchMoveData(moveObj?.move?.name, moveObj?.move?.url) }}>
                            <p>{moveObj?.move?.name.replaceAll('-', ' ')}</p>
                        </button>
                    )
                })}
            </div>
        </div>
    )
}