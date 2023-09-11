import { useState } from 'react'
import { Panel, useReactFlow } from "reactflow";
import { Button } from './ui/button';

export default function Controls(){
   const { zoomIn, zoomOut, fitView, getZoom } = useReactFlow();
  const [zoomPercent, setZoomPercent] = useState(getZoom())

  const handleZoomIn = () => {
    zoomIn({duration: 300})
    setZoomPercent(getZoom())
  }

  const handleZoomOut = () => {
    zoomOut({duration: 300})
    setZoomPercent(getZoom())
  }

  const handleFit = () => {
    const duration = 1000
    const refreshRate = 100

    fitView({duration})
    const zoomRefresh = setInterval(() => {
      setZoomPercent(getZoom())
    }, refreshRate)

    setTimeout(() => clearInterval(zoomRefresh), duration + refreshRate)
  }

  return (
    <>
      <Panel position='bottom-right' className='flex'>
        <Button variant='outline' className='h-8 !py-0 mr-2' onClick={handleFit}><i className='i-mdi-fit-to-screen-outline' /></Button>
        <Button variant='outline' className='h-8 !py-0 border-r-none rounded-r-none' onClick={handleZoomOut}><i className='i-mdi-minus' /></Button>
        <Button variant='outline' className='h-8 !py-0 w-16 rounded-none' onClick={handleFit}>{Math.round(zoomPercent * 100) + "%"}</Button>
        <Button variant='outline' className='h-8 !py-0 border-l-none rounded-l-none' onClick={handleZoomIn}><i className='i-mdi-plus' /></Button>

        {/* <div className='ml-2'>
          <Button variant='outline' className='h-8 !py-0 border-r-none rounded-r-none' onClick={() => zoomOut({ duration: 100 })}><i className='i-mdi-undo' /></Button>
          <Button variant='outline' className='h-8 !py-0 rounded-l-none' onClick={() => zoomOut({ duration: 100 })}><i className='i-mdi-redo' /></Button>
        </div> */}
      </Panel>
    </>
  )

}