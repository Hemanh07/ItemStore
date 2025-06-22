import React from 'react'

const DropDown = ({ fieldName, id, list, error }) => {

    const optionsList = [];
    for (let i = 0; i < list.length; i++) {
        optionsList.push(<option
            value={list[i].value}
            key={`${id}-${list[i].value}`}
        >
            {list[i].label}
        </option>)
    }
    optionsList.unshift(
        <option
            disabled={true}
            value="default" key="default"
        >
            Select {fieldName}
        </option>);
    return (
        <div
            className='dropdown'
        >
            <label
                htmlFor={id}
                id={`${id}-special`}
            >
                {fieldName}&nbsp;:
            </label>
            <select
                name={id}
                id={id}
                defaultValue={"default"}
                required
            >
                {optionsList}
            </select>
            {
                error && <p className='error'>{error}</p>
            }
        </div>
    )
}

export default DropDown