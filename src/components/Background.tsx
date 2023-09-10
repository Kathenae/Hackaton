import { Background as ReactFlowBackground } from "reactflow"
import { useTheme } from "./providers/ThemeProvider"

export default function Background(){
   const { theme, systemIsDark } = useTheme()
   

   return (
      <div className="fixed top-0 left-0 w-screen h-screen z-0 pointer-events-none overflow-hidden">
         <ReactFlowBackground color={theme == 'dark' || (theme == 'system' && systemIsDark) ? '#fff' : '#000'} gap={32} />
      </div>
   )
}