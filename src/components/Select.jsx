import React, {useId} from 'react'

function Select({
    options, //options contains array thats y we are putting map below..
    label,
    className,
    ...props
},ref) {
    const id = useId()
  return (
    <div className='w-full'>
        {label && <label htmlFor={id} className=''></label>}
        <select
        {...props}
        id={id}
        ref={ref}
        className={`px-3 py-2 rounded-lg bg-white text-black outline-none focus:bg-gray-50 duration-200 border border-gray-200 w-full ${className}`}
        >
            {options?.map((option) => ( //what if there is no options so we iterate with condtional rendering "?"...    
                <option key={option} value={option}>
                    {option}
                </option>
            ))}
        </select>
    </div>
  )
}

export default React.forwardRef(Select)  // forward ref is used in Input conponents but with different synntax.to be aware of  mutiple syntax