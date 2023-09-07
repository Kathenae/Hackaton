import { useRouteError } from 'react-router-dom';

export default function ErrorPage(){

   const error = useRouteError() as Error

   return (
      <div className="w-screen h-screen flex flex-col items-center justify-center">
         <h1 className='text-2xl font-bold'>Oops!</h1>
         <p className='mt-4'>Sorry, an unexpected error occured</p>
         <p>
            {error.message} 
         </p>
      </div>
   )
}