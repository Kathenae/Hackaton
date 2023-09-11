import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { BranchFile } from "./github"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const extensionToIconClassMap = {
  ".file": "i-mdi-file",
  ".gitignore": "i-mdi-git",
  ".png": "i-mdi-image",
  ".txt": 'i-mdi-file-text',
  ".js": "i-mdi-language-javascript",
  ".jsx": "i-mdi-language-javascript",
  ".ts": "i-mdi-language-typescript",
  ".tsx": "i-mdi-language-typescript",
  ".md": "i-mdi-language-markdown",
  ".py": "i-mdi-language-python",
  ".java": "i-mdi-language-java",
  ".cpp": "i-mdi-language-cpp",
  ".css": "i-mdi-language-css3",
  ".cs": "i-mdi-language-csharp",
  ".html": "i-mdi-language-html5",
  ".php": "i-mdi-language-php",
  ".rb": "i-mdi-language-ruby",
  ".go": "i-mdi-language-go",
  ".swift": "i-mdi-language-swift",
  ".json": "i-mdi-code-json",
  ".xml": "i-mdi-xml",
  ".yaml": "i-mdi-xml",
  ".sql": "i-mdi-database",
  ".sh": "i-mdi-console",
  ".bat": "i-mdi-console",
  ".exe": "i-mdi-application",
  ".dll": "i-mdi-application",
  ".jar": "i-mdi-application",
}

export function createFileNode(file: BranchFile, position: {x: number, y: number}) {
  return {
    id: Math.round((Math.random() * 100000)).toString(), 
    type: 'editor', 
    position, 
    dragHandle: '.drag-handle',
    data: file,
  }
}

export function getFileIconClass(path: string){
  const extension = getFileExtension(path) as keyof typeof extensionToIconClassMap;
  if(extension in extensionToIconClassMap){
    return extensionToIconClassMap[extension as keyof typeof extensionToIconClassMap]
  }
  else{
    return extensionToIconClassMap[".file"]
  }
}

export function getFileExtension(filePath : string) : string {
  const fileName = filePath.split("/").pop();

  if(!fileName){
    return '.file';
  }

  const extension = fileName.split(".").pop();

  if(!extension){
    return '.file'
  }

  return `.${extension}`;
}