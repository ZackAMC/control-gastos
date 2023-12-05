import { useState, useEffect } from 'react'
import Header from "./components/Header"
import Filtros from './components/Filtros'
import Modal from "./components/Modal"
import ListadoGastos from "./components/ListadoGastos"
import { generarId } from './helpers'
import IconoNuevoGasto from "./img/nuevo-gasto.svg"


function App() {

  const [gastos, setGastos] = useState(
    localStorage.getItem('gastos') ? JSON.parse(localStorage.getItem('gastos')) : []
  )

  const [presupuesto, setPresupuesto] = useState(
    Number(localStorage.getItem('presupuesto')) ?? 0
  )
  const [isValidPresupuesto, setIsValidPresupuesto] = useState(false)

  const [modal, setModal] = useState(false)
  const [animarModal, setAnimarModal] = useState(false)

  const [gastoEditar, setGastoEditar] = useState({})

  const [filtro, setFiltro] = useState('')
  const [gastosFiltrados, setGastosFiltrados] = useState([])


  // Activamos el Modal al editar un gasto
  useEffect(() =>{
    if(Object.keys(gastoEditar).length > 0){
      setModal(true)
      
      setTimeout(() => {
        setAnimarModal(true)
      }, 500)
    }
  },[gastoEditar])

  // Guerdamos el presupuesto en LS
  useEffect(()=>{
    localStorage.setItem('presupuesto', presupuesto ?? 0)
  }, [presupuesto])

  // Guardamos gastos en LS
  useEffect(()=>{
    localStorage.setItem('gastos', JSON.stringify(gastos) ?? [])
  }, [gastos])


  // Filtro de gastos
  useEffect(() => {
    if (filtro) {
      const gastosFiltrados = gastos.filter( gasto => gasto.categoria === filtro)

      setGastosFiltrados(gastosFiltrados)
    }
  }, [filtro])

  // Validamos si hay info en LS para pasar a la segunda pantalla
  useEffect(() => {
    const presupestoLS = Number(localStorage.getItem('presupuesto')) ?? 0

    if (presupestoLS > 0) {
      setIsValidPresupuesto(true)
    }
  }, [])
  

  // Activamos modal para un gasto nuevo
  const handleNuevoHasto = ()=>{
    setModal(true)
    setGastoEditar({})

    setTimeout(() => {
      setAnimarModal(true)
    }, 500)
  }

  // Guardamos gasto
  const guardarGasto = gasto =>{
      if (gasto.id) {
        // Actualizar 
        const gastosActualizados = gastos.map( gastoState => gastoState.id === gasto.id ? gasto : gastoState )
        setGastos(gastosActualizados)
        setGastoEditar({})
      } else {
        //Nuevo gasto
        gasto.id = generarId()
        gasto.fecha = Date.now()
        setGastos([...gastos, gasto])
      }

    setAnimarModal(false)
    setTimeout(() => {
        setModal(false)    
    }, 500)

  }

// Eliminamos gasto
  const eliminarGasto = id =>{
    const gastosActualizados = gastos.filter( gasto => gasto.id !== id)

    setGastos(gastosActualizados)

  }

  return (
    <div className={modal ? 'fijar' : ''}>
      <Header
        gastos={gastos}
        setGastos={setGastos}
        presupuesto={presupuesto}
        setPresupuesto={setPresupuesto}
        isValidPresupuesto={isValidPresupuesto}
        setIsValidPresupuesto={setIsValidPresupuesto}
      />

      {isValidPresupuesto && (
        <>
          <main>
            <Filtros
              filtro={filtro}
              setFiltro={setFiltro}
            />

            <ListadoGastos
              gastos={gastos}
              setGastos={setGastos}
              setGastoEditar={setGastoEditar}
              eliminarGasto={eliminarGasto}
              filtro={filtro}
              gastosFiltrados={gastosFiltrados}
            />

          </main>
          <div className="nuevo-gasto">
            <img
              src={IconoNuevoGasto}
              alt='icono nuevo gasto'
              onClick={handleNuevoHasto}
            />
          </div>
        </>
      )}

      {modal && <Modal
                  setModal={setModal}
                  animarModal={animarModal}
                  setAnimarModal={setAnimarModal}
                  guardarGasto={guardarGasto}
                  gastoEditar={gastoEditar}
                  setGastoEditar={setGastoEditar}
                />}
      
    </div>
  )
}

export default App
