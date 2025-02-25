import React from 'react'
import { Brain } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const Logo = ({size=60}) => {
    const navigate = useNavigate()
    return (
        <Brain size={size} onClick={()=>navigate('/')}/>
    )
}

export default Logo
