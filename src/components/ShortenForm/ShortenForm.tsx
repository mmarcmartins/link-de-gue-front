import { QueryClientProvider, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useControlledState } from "../../hooks/useControlledState";
import { queryClient } from "../../lib/react-query";
import { CopyButton } from '../CopyButton';

const VALID_REGEX = /^(https?:\/\/)?([\w\-]+\.)+[\w\-]{2,}(\/[\w\-._~:/?#[\]@!$&'()*+,;=]*)?$/i;

const validateInput = (value: string) => VALID_REGEX.test(value)

const Form = () => {
    const [error, setError] = useState('');

    const [value, setValue] = useControlledState({
        defaultValue: "",
        onChange: (val) => {            
            if(val.length === 0 ){
                setError('')  
                return
            };
            setError(validateInput(val) ? '' : 'Por favor, insira uma URL válida')
        }      
    })
    
    const { mutate, data, isError, isPending } = useMutation<{
        originalUrl: string,
        shortenedUrl: string,
        success: boolean
    }, Error, string>({
        mutationFn: async (fullUrl: string) => {
            const response = await fetch(`${import.meta.env.PUBLIC_API}/shorten`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({OriginalUrl: fullUrl})
            })

            if(!response.ok) throw new Error(`${response.status} ${response.statusText}`);

            const data = await response.json();        
            return data;
        }
    })

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if(value.length > 0 && validateInput(value)) {            
            mutate(value)
            return;
        }
        setError('Por favor, insira uma URL válida');
    }
    
    return (        
            <div className="w-full px-4 sm:px-6 md:px-8 py-4 sm:py-6 md:py-8 bg-white/90 rounded-lg shadow-lg">                
                {data?.success && (
                    <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-green-50 rounded-md border border-green-200">
                        <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                                <p className="text-xs sm:text-sm text-gray-600 mb-1">Link encurtado:</p>
                                <a 
                                    href={`${import.meta.env.PUBLIC_API}/${data.shortenedUrl}`} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-green-600 hover:text-green-700 font-medium break-all text-xs sm:text-sm md:text-base"
                                >
                                    {`${import.meta.env.PUBLIC_API}/${data.shortenedUrl}`}
                                </a>
                            </div>
                            <CopyButton 
                                textToCopy={`${import.meta.env.PUBLIC_API}/${data.shortenedUrl}`}
                                className="shrink-0"
                            />
                        </div>
                    </div>
                )}

                {isError && !isPending && (
                    <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-50 rounded-md border border-red-200">
                        <p className="text-center text-xs sm:text-sm text-red-600 mb-1">Erro ao encurtar o link, tente novamente.</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                    {error && (
                        <p className="text-xs sm:text-sm text-red-500">{error}</p>
                    )}
                    
                    <div className="flex flex-col sm:flex-row gap-2">
                        <input 
                            onChange={(event) => setValue(event.target.value)}
                            type="text" 
                            value={value} 
                            placeholder="Cole seu link aqui" 
                            className="w-full px-3 sm:px-4 py-2 border border-slate-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs sm:text-sm md:text-base"
                        />
                        <button 
                            type="submit"
                            disabled={isPending}
                            className="w-full sm:w-auto px-4 sm:px-6 py-2 bg-slate-700 text-white font-medium rounded-md hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-600 focus:ring-offset-2 transition-colors hover:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm md:text-base"
                        >
                            {isPending ? 'Encurtando...' : 'Encurtar'}
                        </button>
                    </div>
                </form>
            </div>
        
    )
}

export const ShortenForm = () => {    
    return(
        <QueryClientProvider client={queryClient}>            
            <Form />            
        </QueryClientProvider>
    )
};